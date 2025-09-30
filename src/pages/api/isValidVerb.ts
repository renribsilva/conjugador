import { NextApiRequest, NextApiResponse } from 'next';
import { processVerb } from '../../lib/isValidVerbProcess';
import allVerbData from "../../json/allVerbs.json"

let allVerbJson: Record<string, any> | null;

async function loadAllVerbObject() {
  if (!allVerbJson) {
    allVerbJson = allVerbData;
  }
  return allVerbJson;
}

export default async function handler(
  request: NextApiRequest, 
  response: NextApiResponse
) {
  if (request.method !== 'GET') return response.status(200).json({ originalVerb: null, variationVerb: null });
  const { verb } = request.query;
  if (!verb || typeof verb !== 'string') {
    return response.status(200).json({ originalVerb: null, variationVerb: null });
  }
  try {
    await loadAllVerbObject();
    if (allVerbJson === null ) return response.status(200).json({ originalVerb: null, variationVerb: null });
    const result = await processVerb(verb as string, allVerbJson);
    return response.status(200).json(result);
  } catch (error) {
    return response.status(200).json({ originalVerb: null, variationVerb: null });
  }
}