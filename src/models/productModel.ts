import { Schema, model } from 'mongoose';
import { Product } from '../interfaces/products';
import { ref } from 'joi/lib';

const productSchema = new Schema<Product>({
    name: { type: String, required: true, min: 6, max: 255 },
    description: { type: String, required: true, min: 6, max: 255 },
    imageURL: { type: String, required: true, min: 6, max: 255 },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
    isOndiscount: { type: Boolean, required: true, default: false },
    discountPct: { type: Number, required: true, default: 0 },
    isHidden: { type: Boolean, required: false },
    _createdBy: { type: String, ref: 'User', required: false }
});

export const productModel = model<Product>('Product', productSchema);