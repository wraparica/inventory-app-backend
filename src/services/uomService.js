import { AppError } from '../utils/AppError.js';
import UOM from "../model/uom.js";

export async function postUOM(name, symbol, description, createdBy, createdByUsername) {
    let data;
    try {
        const uom = await UOM.create({
            name,
            symbol,
            description,
            createdBy,
            createdByUsername,
        });
        data = uom
    } catch (err) {
        throw new AppError('Received an invalid response from provider', 502);
    }

    return data;
}

export async function getAllUOM(createdBy, createdByUsername) {
    try {
        return await UOM.find({
            createdBy, createdByUsername
        }).sort({ createdAt: -1 });
    } catch (err) {
        console.error("Failed to get all UOMs:", err);

        throw new AppError("Failed to retrieve UOMs", 500);
    }
}

export async function putUOM(id, name, symbol, description, createdBy, createdByUsername) {
    try {
        const uom = await UOM.findOneAndUpdate(
            {
                _id: id,
                createdBy,
                createdByUsername,
            },
            {
                $set: {
                    name,
                    symbol,
                    description,
                },
            },
            {
                new: true,
                runValidators: true,
            }
        );

        if (!uom) {
            throw new AppError("UOM not found or unauthorized", 404);
        }

        return uom;
    } catch (err) {
        throw new AppError("Failed to Update UOMs", 500);
    }
}

export async function deleteUOM(id, createdBy, createdByUsername) {
    try {
        const uom = await UOM.findOneAndDelete(
            {
                _id: id,
                createdBy,
                createdByUsername,
            });

        if (!uom) {
            throw new AppError("UOM not found or unauthorized", 404);
        }

        return uom;
    } catch (err) {
        console.error("Failed to get all UOMs:", err);

        throw new AppError("Failed to delete UOM", 500);
    }
}