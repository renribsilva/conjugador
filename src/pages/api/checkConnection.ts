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
    return res.status(200).json({ ok: true });
  } catch (error) {
    return res.status(200).json({ ok: false });
  }
}
