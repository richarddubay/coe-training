import jwt from "jsonwebtoken";
import "dotenv/config";

interface JWTPayload {
  sub: number;
}

const secretKey = process.env.JWT_SECRET_KEY ?? "some-random-key";

export const generateAccessToken = async (userId: number): Promise<string> => {
  const payload: JWTPayload = { sub: userId };
  return jwt.sign(payload, secretKey, {
    expiresIn: "1d",
  });
};

export const verifyAccessToken = async (
  accessToken: string
): Promise<string | JWTPayload> => {
  let verifiedToken: string | JWTPayload = "";
  try {
    verifiedToken = jwt.verify(accessToken, secretKey) as string | JWTPayload;
  } catch (error) {
    console.error(error);
  }
  return verifiedToken;
};
