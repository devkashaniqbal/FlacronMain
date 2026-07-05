import { NextRequest, NextResponse } from "next/server";
import { getCustomerByEmail } from "@/lib/customers-data";
import { verifyPassword, createSessionToken, CUSTOMER_COOKIE } from "@/lib/customer-auth";

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const customer = await getCustomerByEmail(email);
  if (!customer?.passwordHash || !(await verifyPassword(password, customer.passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = await createSessionToken(customer.id);
  const response = NextResponse.json({ ok: true });
  response.cookies.set(CUSTOMER_COOKIE, token, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.delete(CUSTOMER_COOKIE);
  return response;
}
