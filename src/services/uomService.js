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