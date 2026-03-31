import type { PageServerLoad } from './$types';
import type { ApiResponse, Product } from '@benchmark/data';

export const load: PageServerLoad = async ({ fetch }) => {
  const apiUrl = process.env['API_URL'] ?? 'http://localhost:3000';
  try {
    const res = await fetch(`${apiUrl}/products`);
    if (!res.ok) return { products: [] };
    const json: ApiResponse<Product[]> = await res.json() as ApiResponse<Product[]>;
    return {
      products: json.data ?? []
    };
  } catch {
    return { products: [] };
  }
};
