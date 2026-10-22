import { AppError } from '../utils/AppError.js';

export async function uom(req, res, next) {
    try {
        console.log('UOM HIT');
        console.log('Content-Type:', req.headers['content-type']);
        console.log('Body:', req.body);

        if (!req.body || Object.keys(req.body).length === 0) {
            throw new AppError('Request body is required', 400);
        }
        const { createdBy, createdByUsername } = req.user;
        const { name, symbol, description } = req.body;

        if (!name || !name.trim()) {
            throw new AppError('Unit name is required', 400);
        }

        if (!symbol || !symbol.trim()) {
            throw new AppError('Symbol is required', 400);
        }

        if (!description || !description.trim()) {
            throw new AppError('Description is required', 400);
        }

        const data = await postUOM(name, symbol, description, createdBy, createdByUsername)

        res.status(201).json({
            success: true,
            message: "UOM created successfully",
            data: data,
        });
    } catch (err) {
        next(err);
    }
}
