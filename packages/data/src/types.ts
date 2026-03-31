export type Category =
  | "Electronics"
  | "Clothing"
  | "Books"
  | "Home & Garden"
  | "Sports"
  | "Toys"
  | "Food & Beverage"
  | "Beauty";

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: Category;
  stock: number;
  rating: number;
  image_url: string;
  tags: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ApiResponse<T> {
  data: T;
  total?: number;
  page?: number;
  pageSize?: number;
}
