import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { createInvoice, listInvoices, type InvoiceLineItem } from "@/lib/invoices";

export async function GET(request: NextRequest) {
  if (!(await isAdminRequest(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const invoices = await listInvoices();
  return NextResponse.json({ invoices });
}

export async function POST(request: NextRequest) {
  if (!(await isAdminRequest(request))) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { billToName, billToEmail, billToCompany, items, notes, customOrderId, customerId } = body;

  if (!billToName || !billToEmail) {
    return NextResponse.json({ error: "Bill-to name and email are required" }, { status: 400 });
  }
  if (!Array.isArray(items) || items.length === 0) {
    return NextResponse.json({ error: "At least one line item is required" }, { status: 400 });
  }

  const cleanItems: InvoiceLineItem[] = items.map((item: { description?: string; quantity?: number; unitPrice?: number }) => ({
    description: String(item.description || "").slice(0, 500),
    quantity: Number(item.quantity) || 1,
    unitPrice: Number(item.unitPrice) || 0,
  }));

  const id = await createInvoice({
    billToName: String(billToName),
    billToEmail: String(billToEmail),
    billToCompany: String(billToCompany || ""),
    items: cleanItems,
    notes: String(notes || ""),
    customOrderId: customOrderId || undefined,
    customerId: customerId || undefined,
  });

  return NextResponse.json({ ok: true, id });
}
