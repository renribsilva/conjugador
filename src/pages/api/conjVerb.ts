'use server'

import { NextApiResponse, NextApiRequest } from 'next';
import { loadAllVerbObject, loadRegObject } from '../../lib/jsonLoad';
import { conjugateVerb } from '../../lib/conjugateVerb';
import { ni } from '../../lib/normalizeVerb';
import { pattern } from '../../lib/certainObjects';

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
      const allVerbJson = await loadAllVerbObject();
      const regJson = await loadRegObject();
      if (!allVerbJson || !regJson ) return ({ conjugations: null, propOfVerb: pattern })
      const conjugations = await conjugateVerb(ni(verb), regJson, allVerbJson)
      // console.dir(conjugations, {depth: null, colors: true})
      return response.status(200).json(conjugations);
    } catch (error) {
      return response.status(200).json({ conjugations: null, propOfVerb: pattern });
    }
  } else {
    return response.status(200).json({ conjugations: null, propOfVerb: pattern });
  }
}
