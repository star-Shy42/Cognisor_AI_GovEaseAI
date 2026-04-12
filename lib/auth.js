// lib/auth.js - Jose JWT utilities
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const alg = 'HS256';

export async function generateToken(userId, email) {
  return await new jose.SignJWT({ userId, email })
    .setProtectedHeader({ alg })
    .setExpirationTime('7d')
    .sign(new TextEncoder().encode(JWT_SECRET));
}

export async function verifyToken(token) {
  try {
    const { payload } = await jose.jwtVerify(token, new TextEncoder().encode(JWT_SECRET), { algorithms: [alg] });
    return payload;
  } catch (error) {
    console.error('JWT verify error:', error);
    return null;
  }
}
