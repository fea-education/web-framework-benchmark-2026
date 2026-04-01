import type { RequestHandler } from '@builder.io/qwik-city';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';

export const onGet: RequestHandler = async ({ json }) => {
  const res = await fetch(`${API_URL}/products`);
  const data = await res.json();
  json(200, data);
};
