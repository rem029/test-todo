export interface DecodedUser {
  id: number;
  username: string;
  iat: number;
  exp: number;
}

declare module "express-serve-static-core" {
  interface Request {
    user?: DecodedUser;
  }
}
