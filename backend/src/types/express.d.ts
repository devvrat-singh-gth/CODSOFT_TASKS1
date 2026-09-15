import "express";

declare global {
  namespace Express {
    interface User {
      id: string;
      email: string;
      name?: string;
      avatarUrl?: string | null;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};