import { NextApiRequest, NextApiResponse } from 'next';
import { processVerb } from '../../lib/isValidVerbProcess';

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== 'GET') return response.status(200).json({ originalVerb: null, variationVerb: null });
  const { verb } = request.query;
  try {
    const result = await processVerb(verb as string);
    return response.status(200).json(result);
  } catch (error) {
    return response.status(200).json({ originalVerb: null, variationVerb: null });
  }
}