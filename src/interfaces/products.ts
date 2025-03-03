import { User } from "./user";

export interface Product extends Document {
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    stock: number;
    isOndiscount: boolean;
    discountPct: number;
    isHidden: boolean;
    _createdBy: User['id'];
}

