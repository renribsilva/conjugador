'use server'

import { NextApiResponse, NextApiRequest } from 'next';
import { loadAllVerbObject, loadIrregObject } from '../../lib/ssr/jsonLoad';
import { conjugateVerb } from '../../lib/ssr/conjugateVerb';
import { ni } from '../../lib/ssr/normalizeVerb';
import { pattern } from '../../lib/ssr/certainObjects';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  
  if (request.method === 'POST') {
    try {
      const { verb } = request.body;
      if (!verb || typeof verb !== 'string') {
        return response.status(200).json ({ conjugations: null, propOfVerb: pattern }) 
      }
      const [allVerbJson, regJson] = await Promise.all([
        loadAllVerbObject(),
        loadIrregObject()
      ]);
      if (!allVerbJson || !regJson ) return ({ conjugations: null, propOfVerb: pattern })
      const conjugations = await conjugateVerb(ni(verb), allVerbJson)
      // console.dir(conjugations, {depth: null, colors: true})
      return response.status(200).json(conjugations);
    } catch (error) {
      return response.status(200).json({ conjugations: null, propOfVerb: pattern });
    }
  } else {
    return response.status(200).json({ conjugations: null, propOfVerb: pattern });
  }
}
