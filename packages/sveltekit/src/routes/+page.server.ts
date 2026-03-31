import type { PageServerLoad } from './$types';
import type { ApiResponse, Product } from '@benchmark/data';

export const load: PageServerLoad = async ({ fetch }) => {
  const apiUrl = process.env['API_URL'] ?? 'http://localhost:3000';
  const res = await fetch(`${apiUrl}/products`);
  const json: ApiResponse<Product[]> = await res.json() as ApiResponse<Product[]>;
  return {
    products: json.data
  };
};
