import { proxyRequest } from "@/lib/api-helper";
import { NextRequest } from "next/server";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const { id } = await params;
    return proxyRequest(`/api/v1/projects/${id}`);
  }

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  return proxyRequest(`/api/v1/projects/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyRequest(`/api/v1/projects/${id}`, {
    method: "DELETE",
  });
}
