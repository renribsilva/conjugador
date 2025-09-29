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
    await sql`SELECT 1;`;
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(500).json({ ok: false });
  }
}
