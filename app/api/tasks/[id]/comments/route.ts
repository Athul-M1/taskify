import { proxyRequest } from "@/lib/api-helper";
import { NextRequest } from "next/server";

export async function GET(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    return proxyRequest(`/api/v1/tasks/${id}/comments`);
}

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const body = await req.json();
    return proxyRequest(`/api/v1/tasks/${id}/comments`, {
        method: "POST",
        body: JSON.stringify(body),
    });
}
