import { AppError } from '../utils/AppError.js';
import User from "../model/user.js";
import RefreshToken from "../models/refreshToken.js";
import jwt from 'jsonwebtoken';
import crypto from "node:crypto";

const ACCESS_TOKEN_EXPIRES_IN =
    process.env.ACCESS_TOKEN_EXPIRES_IN || "15m";

const REFRESH_TOKEN_EXPIRES_IN =
    process.env.REFRESH_TOKEN_EXPIRES_IN || "7d";

const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export async function postRegister(email, username, password) {
    let data;
    try {
        const user = await User.create({
            email,
            username,
            password,
        });
        data = {
            id: user._id,
            email: user.email,
        }
    } catch (err) {
        throw new AppError('Received an invalid response from provider', 502);
    }

    return data;
}

export async function postLogin(user) {
    let data;
    try {
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: ACCESS_TOKEN_EXPIRES_IN,
            }
        );
        data = {
            token: token,
            user: {
                id: user._id,
                email: user.email,
                username: user.username,
            }
        }
    } catch (err) {
        console.log(err)
        throw new AppError('Received an invalid response from provider', 502);
    }

    return data;
}

export function createAccessToken(user) {
  return jwt.sign(
    { id: user._id.toString() },
    process.env.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function createRefreshToken(user) {
  // Random opaque token; only its hash is stored in MongoDB.
  const token = crypto.randomBytes(64).toString("hex");

  await RefreshToken.create({
    userId: user._id,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS),
  });

  return token;
}

export async function rotateRefreshToken(token) {
  const tokenHash = hashToken(token);

  // Atomically remove the old token so it cannot be reused.
  const storedToken = await RefreshToken.findOneAndDelete({
    tokenHash,
    expiresAt: { $gt: new Date() },
  });

  if (!storedToken) {
    return null;
  }

  return storedToken.userId;
}

export async function revokeRefreshToken(token) {
  await RefreshToken.deleteOne({ tokenHash: hashToken(token) });
}