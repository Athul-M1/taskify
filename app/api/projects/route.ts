import { proxyRequest } from "@/lib/api-helper";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  return proxyRequest(`/api/v1/projects?${searchParams.toString()}`);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  return proxyRequest("/api/v1/projects", {
    method: "POST",
    body: JSON.stringify(body),
  });
}
