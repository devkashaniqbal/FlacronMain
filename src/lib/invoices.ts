import { getDb } from "@/lib/firebase-server";

export type InvoiceStatus = "unpaid" | "paid" | "cancelled";

export type InvoiceLineItem = {
  description: string;
  quantity: number;
  unitPrice: number;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  billToName: string;
  billToEmail: string;
  billToCompany: string;
  items: InvoiceLineItem[];
  notes: string;
  status: InvoiceStatus;
  customOrderId: string | null;
  customerId: string | null;
  createdAt: number;
};

const invoicesCol = () => getDb().collection("invoices");
const countersCol = () => getDb().collection("counters");

async function nextInvoiceNumber(): Promise<string> {
  const year = new Date().getFullYear();
  const counterRef = countersCol().doc(`invoices-${year}`);

  const seq = await getDb().runTransaction(async (tx) => {
    const doc = await tx.get(counterRef);
    const current = doc.exists ? (doc.data()?.value as number) : 0;
    const next = current + 1;
    tx.set(counterRef, { value: next }, { merge: true });
    return next;
  });

  return `FE-${year}-${String(seq).padStart(3, "0")}`;
}

export async function createInvoice(data: {
  billToName: string;
  billToEmail: string;
  billToCompany: string;
  items: InvoiceLineItem[];
  notes: string;
  customOrderId?: string;
  customerId?: string;
}): Promise<string> {
  const invoiceNumber = await nextInvoiceNumber();
  const ref = await invoicesCol().add({
    invoiceNumber,
    billToName: data.billToName,
    billToEmail: data.billToEmail,
    billToCompany: data.billToCompany,
    items: data.items,
    notes: data.notes,
    status: "unpaid" as InvoiceStatus,
    customOrderId: data.customOrderId ?? null,
    customerId: data.customerId ?? null,
    createdAt: Date.now(),
  });
  return ref.id;
}

export async function listInvoices(): Promise<Invoice[]> {
  const snap = await invoicesCol().get();
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as Invoice)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getInvoice(id: string): Promise<Invoice | null> {
  const doc = await invoicesCol().doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as Invoice;
}

export async function updateInvoiceStatus(id: string, status: InvoiceStatus): Promise<void> {
  await invoicesCol().doc(id).update({ status });
}
