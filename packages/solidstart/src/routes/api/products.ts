import type { APIEvent } from "@solidjs/start/server";

const API_URL = process.env["VITE_API_URL"] ?? import.meta.env["VITE_API_URL"] ?? "http://localhost:3000";

export async function GET(_event: APIEvent) {
  const res = await fetch(`${API_URL}/products`);
  const data = await res.json() as unknown;
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
