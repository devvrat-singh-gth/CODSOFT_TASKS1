import jwt from "jsonwebtoken";

interface JwtPayload {
  userId: string;
}

export const generateToken = (
  userId: string
): string => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d",
    }
  );
};

export const verifyToken = (
  token: string
): JwtPayload => {
  return jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as JwtPayload;
};