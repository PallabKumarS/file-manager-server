import jwt, { type JwtPayload, type SignOptions } from "jsonwebtoken";

export const createToken = (
  jwtPayload: { id: string; role: string; email: string },
  secret: string,
  expiresIn: string,
): string => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  } as SignOptions);
};

export const verifyToken = (token: string, secret: string): JwtPayload => {
  const newToken = token.includes("Bearer") ? token.split(" ")[1] : token;
  return jwt.verify(newToken, secret) as JwtPayload;
};
