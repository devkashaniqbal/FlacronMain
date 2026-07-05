import type { InvoiceLineItem } from "@/lib/invoices";

/** Client-safe total calculator — has no firebase-admin dependency, unlike lib/invoices.ts. */
export function invoiceTotal(items: InvoiceLineItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}
