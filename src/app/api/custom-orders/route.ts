import { NextRequest, NextResponse } from "next/server";
import { createCustomOrder } from "@/lib/custom-orders";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, company, projectType, budget, description } = body;

  if (!name || !email || !description) {
    return NextResponse.json({ error: "Name, email, and description are required" }, { status: 400 });
  }

  const id = await createCustomOrder({
    name: String(name),
    email: String(email),
    company: String(company || ""),
    projectType: String(projectType || ""),
    budget: String(budget || ""),
    description: String(description).slice(0, 5000),
  });

  return NextResponse.json({ ok: true, id });
}
