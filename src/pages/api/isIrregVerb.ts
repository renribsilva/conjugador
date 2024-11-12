import fs from 'fs/promises';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ni } from '../../lib/normalizeVerb';

const verbsFilePath = path.join(process.cwd(), 'src/json/irregVerbs.json');

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'GET') return response.status(405).end();

  const { verb } = request.query;

  if (!verb || Array.isArray(verb)) return response.status(400).end();

  const normalizedVerb = ni(verb as string)

  try {
    const data = await fs.readFile(verbsFilePath, 'utf-8');
    const verbArray: string[] = JSON.parse(data);

    return verbArray.includes(normalizedVerb)
      ? response.status(200).json({ result: true })
      : response.status(404).json({ result: false });
  } catch {
    return response.status(500).end();
  }
}
