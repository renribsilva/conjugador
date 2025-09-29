// pages/api/conjugations.ts
import { sql } from '@vercel/postgres';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ ok: boolean }>
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false });
  }

  try {
    // Tenta puxar qualquer dado da tabela json
    await sql`SELECT 1 FROM json LIMIT 1;`;
    // Se der certo, retorna true
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Erro ao verificar conjugações:', error);
    // Em caso de erro, retorna false
    res.status(200).json({ ok: false });
  }
}
