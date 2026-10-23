import { AppError } from '../utils/AppError.js';
import {
    getAllUOM,
    postUOM,
    putUOM,
    deleteUOM
} from "../services/uomService.js";

export async function uom(req, res, next) {
    try {
        
        if (!req.body || Object.keys(req.body).length === 0) {
            throw new AppError('Request body is required', 400);
        }
        const createdBy = req.user.userId;
        const createdByUsername = req.user.username;
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

export async function getUOM(req, res, next) {
    const createdBy = req.user.userId;
    const createdByUsername = req.user.username;
    try {
        const data = await getAllUOM(createdBy, createdByUsername);

        return res.status(200).json({
            success: true,
            message: "UOMs retrieved successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const editUOM = async (req, res, next) => {
    try {
        const { id } = req.params;
        const createdBy = req.user.userId;
        const createdByUsername = req.user.username;
        const { name, symbol, description } = req.body;

        const data = await putUOM(
            id,
            name,
            symbol,
            description,
            createdBy,
            createdByUsername
        );

        return res.status(200).json({
            success: true,
            message: "UOM updated successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const removeUOM = async (req, res, next) => {
    try {
        const { id } = req.params;
        const createdBy = req.user.userId;
        const createdByUsername = req.user.username;

        const data = await deleteUOM(
            id,
            createdBy,
            createdByUsername
        );

        return res.status(200).json({
            success: true,
            message: "UOM deleted successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};


