import type { PageServerLoad } from './$types';
import type { ApiResponse, Product } from '@benchmark/data';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params, fetch }) => {
  const apiUrl = process.env['API_URL'] ?? 'http://localhost:3000';
  const res = await fetch(`${apiUrl}/products/${params.id}`);

  if (!res.ok) {
    error(404, 'Product not found');
  }

  const json: ApiResponse<Product> = await res.json() as ApiResponse<Product>;
  return {
    product: json.data
  };
};
