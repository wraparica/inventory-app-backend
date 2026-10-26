import { AppError } from '../utils/AppError.js';
import Category from "../model/category.js";

export async function postCategory(name, description, createdBy, createdByUsername) {
    let data;
    try {
        const uom = await Category.create({
            name,
            description,
            isActive: true,
            createdBy,
            createdByUsername,
        });
        data = uom
    } catch (err) {
        throw new AppError('Received an invalid response from provider', 502);
    }

    return data;
}

export async function getAllCategories(createdBy, createdByUsername) {
    try {
        return await Category.find({
            createdBy, createdByUsername
        }).sort({ createdAt: -1 });
    } catch (err) {
        console.error("Failed to get all Categories:", err);

        throw new AppError("Failed to retrieve Categories", 500);
    }
}

export async function putCategory(id, name, description, createdBy, createdByUsername) {
    try {
        const uom = await Category.findOneAndUpdate(
            {
                _id: id,
                createdBy,
                createdByUsername,
            },
            {
                $set: {
                    name,
                    description,
                },
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!uom) {
            throw new AppError("Category not found or unauthorized", 404);
        }

        return uom;
    } catch (err) {
        throw new AppError("Failed to Update Category", 500);
    }
}

export async function deleteCategory(id, createdBy, createdByUsername) {
    try {
        const uom = await Category.findOneAndDelete(
            {
                _id: id,
                createdBy,
                createdByUsername,
            });

        if (!uom) {
            throw new AppError("Category not found or unauthorized", 404);
        }

        return uom;
    } catch (err) {
        console.error("Failed to delete Category:", err);

        throw new AppError("Failed to delete Category", 500);
    }
}