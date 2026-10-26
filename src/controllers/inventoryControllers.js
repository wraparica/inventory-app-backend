import bcrypt from "bcryptjs";
import User from "../model/user.js";
import { AppError } from '../utils/AppError.js';
import {
    postRegister, createAccessToken,
    createRefreshToken,
    rotateRefreshToken,
    revokeRefreshToken,
} from "../services/inventoryService.js";

const refreshCookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    path: "/api",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

export async function register(req, res, next) {
    try {
        console.log('REGISTER HIT');
        console.log('Content-Type:', req.headers['content-type']);
        console.log('Body:', req.body);

        if (!req.body || Object.keys(req.body).length === 0) {
            throw new AppError('Request body is required', 400);
        }

        const { username, email, password } = req.body;

        if (!email || !email.trim()) {
            throw new AppError('Email is required', 400);
        }

        if (!username || !username.trim()) {
            throw new AppError('Username is required', 400);
        }

        if (!password || !password.trim()) {
            throw new AppError('Password is required', 400);
        }

        const existingEmail = await User.findOne({ email });
        const existingUsername = await User.findOne({ username });

        if (existingEmail) {
            throw new AppError('Email already exists', 400);
        }

        if (existingUsername) {
            throw new AppError('Username already exists', 400);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        const data = await postRegister(email, username, hashedPassword)

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: data,
        });
    } catch (err) {
        next(err);
    }
}

export async function login(req, res, next) {
    try {
        const { username, password } = req.body;

        if (!username || !username.trim()) {
            throw new AppError("Username is required", 400);
        }

        if (!password || !password.trim()) {
            throw new AppError("Password is required", 400);
        }

        const user = await User.findOne({ username });

        if (!user) {
            throw new AppError("Invalid username or password", 401);
        }

        const passwordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordValid) {
            throw new AppError("Invalid username or password", 401);
        }

        // Generate tokens after validating credentials
        const accessToken = createAccessToken(user);
        const refreshToken = await createRefreshToken(user);

        // Store the refresh token in an HttpOnly cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:
                process.env.NODE_ENV === "production" ? "none" : "lax",
            path: "/api/refresh",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                accessToken,
                username: user.username,
            },
        });
    } catch (err) {
        next(err);
    }
}

export async function getCurrentUser(req, res, next) {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            throw new AppError('Invalid username', 400);
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
            },
        });

    } catch (err) {
        next(err);
    }
}

export async function refresh(req, res, next) {
    console.log("Refresh cookie received:", Boolean(oldToken));
    console.log("Parsed cookie names:", Object.keys(req.cookies ?? {}));
    try {
        const oldToken = req.cookies?.refreshToken;

        if (!oldToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token required",
            });
        }

        const userId = await rotateRefreshToken(oldToken);

        if (!userId) {
            res.clearCookie("refreshToken", refreshCookieOptions);

            return res.status(401).json({
                success: false,
                message: "Invalid or expired refresh token",
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            res.clearCookie("refreshToken", refreshCookieOptions);

            return res.status(401).json({
                success: false,
                message: "User no longer exists",
            });
        }

        const accessToken = createAccessToken(user);
        const newRefreshToken = await createRefreshToken(user);

        res.cookie("refreshToken", newRefreshToken, refreshCookieOptions);

        return res.status(200).json({
            success: true,
            data: { accessToken },
        });
    } catch (error) {
        next(error);
    }
}

export async function logout(req, res, next) {
    try {
        const token = req.cookies?.refreshToken;

        if (token) {
            await revokeRefreshToken(token);
        }

        res.clearCookie("refreshToken", refreshCookieOptions);

        return res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    } catch (error) {
        next(error);
    }
}