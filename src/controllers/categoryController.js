import { AppError } from '../utils/AppError.js';
import {
    getAllCategories,
    postCategory,
    putCategory,
    deleteCategory
} from "../services/categoryService.js";

export async function category(req, res, next) {
    try {
        
        if (!req.body || Object.keys(req.body).length === 0) {
            throw new AppError('Request body is required', 400);
        }
        const createdBy = req.user.userId;
        const createdByUsername = req.user.username;
        const { name, description } = req.body;

        if (!name || !name.trim()) {
            throw new AppError('Unit name is required', 400);
        }

        if (!description || !description.trim()) {
            throw new AppError('Description is required', 400);
        }

        const data = await postCategory(name, description, createdBy, createdByUsername)

        res.status(201).json({
            success: true,
            message: "Category created successfully",
            data: data,
        });
    } catch (err) {
        next(err);
    }
}

export async function getCategories(req, res, next) {
    const createdBy = req.user.userId;
    const createdByUsername = req.user.username;
    try {
        const data = await getAllCategories(createdBy, createdByUsername);

        return res.status(200).json({
            success: true,
            message: "Categories retrieved successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const editCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const createdBy = req.user.userId;
        const createdByUsername = req.user.username;
        const { name, description } = req.body;

        const data = await putCategory(
            id,
            name,
            description,
            createdBy,
            createdByUsername
        );

        return res.status(200).json({
            success: true,
            message: "Category updated successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};

export const removeCategory = async (req, res, next) => {
    try {
        const { id } = req.params;
        const createdBy = req.user.userId;
        const createdByUsername = req.user.username;

        const data = await deleteCategory(
            id,
            createdBy,
            createdByUsername
        );

        return res.status(200).json({
            success: true,
            message: "Category deleted successfully",
            data,
        });
    } catch (error) {
        next(error);
    }
};


