import { NextRequest, NextResponse } from "next/server";
import { bravoFetch } from "@/lib/bravopay-server";

/**
 * GET /api/bravopay/status/:id
 * Proxy seguro para GET https://bravopay.club/api/v1/transactions/{id}
 *
 * Usado pelo polling do front a cada 3s.
 * Não expõe API key ao client.
 */
export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params;
    if (!id) return NextResponse.json({ error: "id obrigatório" }, { status: 400 });

    const safeId = encodeURIComponent(id);
    const { res, json, status } = await bravoFetch(`/transactions/${safeId}`, {
      method: "GET",
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: (json as Record<string, unknown>)?.message ?? "Erro ao consultar", details: json },
        { status }
      );
    }

    return NextResponse.json(json as object, { status: 200 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Erro interno";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
