import mongoose from "mongoose";

const uomSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },

        isActive: {
            type: Boolean,
            required: true,
            trim: true,
            default: true,
        },

        description: {
            type: String,
            required: true,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        createdByUsername: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const UOM = mongoose.model("UOM", uomSchema);

export default UOM;