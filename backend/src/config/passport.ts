import passport from "passport";
import {
  Strategy as GoogleStrategy,
} from "passport-google-oauth20";

import prisma from "./db";

passport.use(
  new GoogleStrategy(
    {
      clientID:
        process.env.GOOGLE_CLIENT_ID!,

      clientSecret:
        process.env.GOOGLE_CLIENT_SECRET!,

      callbackURL:
        process.env.GOOGLE_CALLBACK_URL!,
    },

    async (
      accessToken,
      refreshToken,
      profile,
      done
    ) => {
      try {
        const email =
          profile.emails?.[0]?.value
            ?.trim()
            .toLowerCase();

        if (!email) {
          return done(
            new Error(
              "Google account does not provide an email"
            ),
            false
          );
        }

        const avatarUrl =
          profile.photos?.[0]?.value || null;

        let user =
          await prisma.user.findUnique({
            where: {
              googleId: profile.id,
            },
          });

        if (!user) {
          user =
            await prisma.user.findUnique({
              where: {
                email,
              },
            });
        }

        if (!user) {
          user =
            await prisma.user.create({
              data: {
                name:
                  profile.displayName ||
                  "Google User",

                email,

                googleId:
                  profile.id,

                password: null,

                avatarUrl,
              },
            });
        } else {
          user =
            await prisma.user.update({
              where: {
                id: user.id,
              },
              data: {
                googleId:
                  user.googleId ||
                  profile.id,

                avatarUrl:
                  avatarUrl ||
                  user.avatarUrl,
              },
            });
        }

        return done(null, {
          id: user.id,
          email: user.email,
          name: user.name,
          avatarUrl: user.avatarUrl,
        });
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

export default passport;