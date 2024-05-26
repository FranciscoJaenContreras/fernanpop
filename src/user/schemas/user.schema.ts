import { Schema } from "mongoose";

export const ProductSchema = new Schema({
    name: String,
    password: String,
    email: String,
    createAt: {
        type: Date,
        default: Date.now
    }
});

