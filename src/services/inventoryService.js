import { AppError } from '../utils/AppError.js';
import User from "../model/user.js";
import jwt from 'jsonwebtoken';

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
                expiresIn: "1h",
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