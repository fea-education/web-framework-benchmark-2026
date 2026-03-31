import type { Product, Category, CartItem, ApiResponse } from "./types.js";
import productsJson from "./products.json" with { type: "json" };

export type { Product, Category, CartItem, ApiResponse };

export const products: Product[] = productsJson as Product[];

export default products;
