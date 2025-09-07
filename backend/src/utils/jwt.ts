import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN: string | number = process.env.JWT_EXPIRES_IN || "7d";

export interface JwtPayload {
  userId: string;
  iat?: number;
  exp?: number;
}

const defaultOptions: SignOptions = {
  expiresIn: (JWT_EXPIRES_IN as any) || "7d"
};

export function signToken(payload: JwtPayload) {
  return jwt.sign(payload, JWT_SECRET, defaultOptions);
}

export function verifyToken(token: string): JwtPayload {
  return jwt.verify(token, JWT_SECRET) as JwtPayload;
}
