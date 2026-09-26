import { NextResponse } from "next/server";
import { loadAllVerbObject } from "../../../lib/ssr/jsonLoad";

export async function GET() {
  try {
    const allVerbJson = await loadAllVerbObject();

    if (!allVerbJson) {
      return NextResponse.json(
        { error: "Falha ao carregar verbos" },
        { status: 500 },
      );
    }

    return NextResponse.json(allVerbJson, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Erro interno no servidor" },
      { status: 500 },
    );
  }
}
