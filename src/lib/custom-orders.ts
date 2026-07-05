import { getDb } from "@/lib/firebase-server";

export type CustomOrderStatus = "new" | "reviewed" | "quoted" | "closed";

export type CustomOrder = {
  id: string;
  name: string;
  email: string;
  company: string;
  projectType: string;
  budget: string;
  description: string;
  status: CustomOrderStatus;
  createdAt: number;
};

const ordersCol = () => getDb().collection("customOrders");

export async function createCustomOrder(data: Omit<CustomOrder, "id" | "status" | "createdAt">): Promise<string> {
  const ref = await ordersCol().add({ ...data, status: "new" as CustomOrderStatus, createdAt: Date.now() });
  return ref.id;
}

export async function listCustomOrders(): Promise<CustomOrder[]> {
  const snap = await ordersCol().get();
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }) as CustomOrder)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export async function getCustomOrder(id: string): Promise<CustomOrder | null> {
  const doc = await ordersCol().doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() } as CustomOrder;
}

export async function updateCustomOrderStatus(id: string, status: CustomOrderStatus): Promise<void> {
  await ordersCol().doc(id).update({ status });
}
