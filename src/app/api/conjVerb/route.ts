import { NextResponse } from "next/server";
import { loadAllVerbObject } from "../../../lib/ssr/jsonLoad";
import { conjugateVerb } from "../../../lib/ssr/conjugateVerb";
import { ni } from "../../../lib/ssr/normalizeVerb";

export async function GET(request: Request) {
  try {
    // Captura os parâmetros de busca da URL (ex: /api/conjVerb?verb=amar)
    const { searchParams } = new URL(request.url);
    const verb = searchParams.get("verb");

    if (!verb) {
      return NextResponse.json(
        {
          error:
            'Entrada inválida: "verb" é obrigatório e deve ser uma string.',
        },
        { status: 400 },
      );
    }

    const allVerbJson = await loadAllVerbObject();
    if (!allVerbJson) {
      return NextResponse.json(
        { error: "Erro ao carregar os dados necessários." },
        { status: 500 },
      );
    }

    const conjugations = await conjugateVerb(ni(verb) as string, allVerbJson);
    return NextResponse.json(conjugations, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 },
    );
  }
}
