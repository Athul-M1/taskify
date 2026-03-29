import { proxyRequest } from "@/lib/api-helper";
import { NextRequest } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  return proxyRequest(`/api/v1/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action"); // "status" or "assign"

  const body = await req.json();

  if (action === "status") {
    return proxyRequest(`/api/v1/tasks/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  } else if (action === "assign") {
    return proxyRequest(`/api/v1/tasks/${id}/assign`, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  return proxyRequest(`/api/v1/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(body),
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  return proxyRequest(`/api/v1/tasks/${id}`, {
    method: "DELETE",
  });
}
