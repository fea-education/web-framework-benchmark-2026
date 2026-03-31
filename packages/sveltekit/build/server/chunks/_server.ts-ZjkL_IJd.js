const GET = async ({ fetch }) => {
  const apiUrl = process.env["API_URL"] ?? "http://localhost:3000";
  const res = await fetch(`${apiUrl}/products`);
  const json = await res.json();
  return new Response(JSON.stringify(json), {
    headers: { "content-type": "application/json" }
  });
};

export { GET };
//# sourceMappingURL=_server.ts-ZjkL_IJd.js.map
