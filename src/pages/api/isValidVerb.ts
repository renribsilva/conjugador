import { NextApiRequest, NextApiResponse } from 'next';
import { isValidVerbProcess } from '../../lib/isValidVerbProcess';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== 'GET') return response.status(405).end();

  const { verb } = request.query;
  if (Array.isArray(verb) || !verb) return response.status(400).end();

  try {
    const result = await isValidVerbProcess(verb as string);
    return response.status(200).json(result);
  } catch (error) {
    console.error('Error processing verb:', error);
    return response.status(500).json({ error: 'Internal server error' });
  }
}
