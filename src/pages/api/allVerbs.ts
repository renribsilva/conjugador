import { NextApiRequest, NextApiResponse } from "next";
import { loadAllVerbObject } from "../../lib/ssr/jsonLoad";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const allVerbJson = await loadAllVerbObject();
    if (!allVerbJson) return res.status(500).json({ error: 'Falha ao carregar verbos' });
    return res.status(200).json(allVerbJson);
  } catch (err) {
    return res.status(500).json({ error: 'Erro interno no servidor' });
  }
}