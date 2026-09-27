import { NextResponse } from "next/server";

const FASTAPI_BASE = process.env.FASTAPI_URL || "http://localhost:8000";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const params = searchParams.toString();
  const url = `${FASTAPI_BASE}/api/staff/directory${params ? `?${params}` : ""}`;

  try {
    const res = await fetch(url, { next: { revalidate: 0 } });
    const data = await res.json();
    if (!res.ok) {
      return NextResponse.json({ error: "Staff directory backend request failed" }, { status: res.status });
    }
    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Invalid staff directory response" }, { status: 502 });
    }
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "FastAPI backend unavailable" }, { status: 503 });
  }
}
