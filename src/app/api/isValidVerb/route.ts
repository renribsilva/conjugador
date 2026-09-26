import { NextResponse } from "next/server";
import { processVerb } from "../../../lib/ssr/isValidVerbProcess";
import { loadAllVerbObject } from "../../../lib/ssr/jsonLoad";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const verb = searchParams.get("verb");

    if (!verb) {
      return NextResponse.json(
        {
          error:
            'Entrada inválida: "verb" é obrigatório e deve ser uma string.',
        },
        { status: 400 }
      );
    }

    const allVerbJson = await loadAllVerbObject();
    if (!allVerbJson) {
      return NextResponse.json(
        { error: "Erro ao carregar os dados necessários." },
        { status: 500 }
      );
    }

    const result = await processVerb(verb, allVerbJson);
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno no servidor." },
      { status: 500 }
    );
  }
}
