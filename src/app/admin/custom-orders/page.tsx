"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Layers } from "lucide-react";
import type { CustomOrder, CustomOrderStatus } from "@/lib/custom-orders";

const STATUS_STYLES: Record<CustomOrderStatus, string> = {
  new: "bg-blue-100 text-blue-700",
  reviewed: "bg-amber-100 text-amber-700",
  quoted: "bg-purple-100 text-purple-700",
  closed: "bg-slate-100 text-slate-500",
};

export default function AdminCustomOrdersPage() {
  const [orders, setOrders] = useState<CustomOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/custom-orders")
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-4 sm:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Custom Orders</h1>
        <p className="text-sm text-slate-500 mt-1">Requests submitted at <code className="text-xs">/custom-order</code> for enterprise plans, white-label, or bespoke work.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-900">All Requests</h2>
          <span className="text-sm text-slate-400">{loading ? "—" : orders.length} total</span>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center text-slate-400 text-sm">Loading…</div>
        ) : orders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <Layers className="mx-auto h-8 w-8 text-slate-300 mb-2" />
            <p className="text-slate-500 text-sm">No custom order requests yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50">
            {orders.map((o) => (
              <Link
                key={o.id}
                href={`/admin/custom-orders/${o.id}`}
                className="flex items-center justify-between gap-4 px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900 text-sm">{o.name}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[o.status]}`}>
                      {o.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{o.company || o.email} · {o.projectType || "General inquiry"}</p>
                </div>
                <span className="text-xs text-slate-400 shrink-0">{new Date(o.createdAt).toLocaleDateString()}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
