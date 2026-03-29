import { proxyRequest } from "@/lib/api-helper";

import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  return proxyRequest(`/api/v1/users?${searchParams.toString()}`);
}
