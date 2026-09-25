import bcrypt from "bcryptjs";
import User from "../model/user.js";
import { AppError } from '../utils/AppError.js';
import { postRegister, postLogin } from "../services/inventoryService.js";

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
            throw new AppError('Username is required', 400);
        }

        if (!password || !password.trim()) {
            throw new AppError('Password is required', 400);
        }

        const user = await User.findOne({ username });

        if (!user) {
            throw new AppError('Invalid username', 400);
        }

        const passwordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordValid) {
            throw new AppError('Invalid password', 400);
        }

        const data = await postLogin(user)

        res.json({
            success: true,
            message: "Login successful",
            data: data,
        });
    } catch (err) {
        next(err);
    }
}