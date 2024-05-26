import { Schema } from "mongoose";

export const ProductSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    image: String,
    createAt: {
        type: Date,
        default: Date.now
    }
});

