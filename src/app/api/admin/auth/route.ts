import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json();
    const expected = process.env.ADMIN_PASSWORD || "admin123";
    if (password === expected) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false, error: "Senha incorreta" }, { status: 401 });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
