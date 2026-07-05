import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { listCustomOrders } from "@/lib/custom-orders";

export async function GET(request: NextRequest) {
  if (!(await isAdminRequest(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await listCustomOrders();
  return NextResponse.json({ orders });
}
