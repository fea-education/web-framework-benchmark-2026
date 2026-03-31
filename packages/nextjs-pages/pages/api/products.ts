import type { NextApiRequest, NextApiResponse } from "next";
import type { ApiResponse, Product } from "@benchmark/data";

const API_URL = process.env["API_URL"] ?? "http://localhost:3000";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse<Product[]>>
) {
  const upstream = await fetch(`${API_URL}/products`);
  const json = (await upstream.json()) as ApiResponse<Product[]>;
  res.status(200).json(json);
}
