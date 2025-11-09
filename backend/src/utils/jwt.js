import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const SECRET = process.env.JWT_SECRET || 'dev_fallback_secret';
export const signJwt = (payload, opt={}) => jwt.sign(payload, SECRET, { expiresIn:"7d", ...opt });
export const verifyJwt = (token) => jwt.verify(token, SECRET);