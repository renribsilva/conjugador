// pages/api/checkConnection.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ ok: boolean }>
) {
  if (req.method !== 'GET') {
    return res.status(200).json({ ok: false });
  }

  try {
    // Aqui você poderia validar DB se quiser
    return res.status(200).json({ ok: true });
  } catch (error) {
    // Nunca falha para o cliente: sempre retorna JSON válido
    return res.status(200).json({ ok: false });
  }
}
