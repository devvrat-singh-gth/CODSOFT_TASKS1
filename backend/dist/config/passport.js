"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const db_1 = __importDefault(require("./db"));
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value
            ?.trim()
            .toLowerCase();
        if (!email) {
            return done(new Error("Google account does not provide an email"), false);
        }
        const avatarUrl = profile.photos?.[0]?.value || null;
        let user = await db_1.default.user.findUnique({
            where: {
                googleId: profile.id,
            },
        });
        if (!user) {
            user =
                await db_1.default.user.findUnique({
                    where: {
                        email,
                    },
                });
        }
        if (!user) {
            user =
                await db_1.default.user.create({
                    data: {
                        name: profile.displayName ||
                            "Google User",
                        email,
                        googleId: profile.id,
                        password: null,
                        avatarUrl,
                    },
                });
        }
        else {
            user =
                await db_1.default.user.update({
                    where: {
                        id: user.id,
                    },
                    data: {
                        googleId: user.googleId ||
                            profile.id,
                        avatarUrl: avatarUrl ||
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
    }
    catch (error) {
        return done(error, false);
    }
}));
exports.default = passport_1.default;
