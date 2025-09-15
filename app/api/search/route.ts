import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const res = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=20`,
    {
      headers: {
        Authorization: "cyAIhzLLCFYqaRrw64rZa89ZZdhJkPQUQiXZOl69eB62BpOEVXsA2PdD", // use env var instead of hardcoding
      },
    }
  );

  const dataRes = await res.json();
  const data = dataRes.photos
  return NextResponse.json(data);
}