import { sql } from '@vercel/postgres';
import { NextApiResponse, NextApiRequest } from 'next';
import { conjugateVerb } from '../../lib/conjugateVerb';
import { ni } from '../../lib/normalizeVerb';
import allVerbData from "../../json/allVerbs.json"
import regData from "../../json/rulesForReg.json"
import { pattern } from '../../lib/certainObjects';

let allVerbJson: Record<string, any> | null;
let regJson: Record<string, any> | null;

async function loadAllVerbObject() {
  if (!allVerbJson) {
    allVerbJson = allVerbData;
  }
  return allVerbJson;
}

async function loadRegObject() {
  if (!regJson) {
    regJson = regData;
  }
  return regJson;
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'POST') {
    return response.status(200).json({ conjugations: null, propOfVerb: pattern });
  }  
  if (request.method === 'POST') {
    try {
      const { verb } = request.body; 
      if (!verb || typeof verb !== 'string') {
        return response.status(200).json({ conjugations: null, propOfVerb: pattern });
      }
      await loadAllVerbObject();
      await loadRegObject();
      if (allVerbJson === null || regJson === null ) return response.status(200).json({ conjugations: null, propOfVerb: pattern });
      const conjugations = conjugateVerb(ni(verb), allVerbJson, regJson);
      if (!conjugations) return response.status(200).json ({ conjugations: null, propOfVerb: pattern })
      await sql`DELETE FROM json;`;
      await sql`INSERT INTO json (conjugations) VALUES (${JSON.stringify(conjugations.conjugations)});`;
      return response.status(200).json(conjugations.propOfVerb);
    } catch (error) {
      return response.status(200).json({ conjugations: null, propOfVerb: pattern });
    }
  } else {
    return response.status(200).json({ conjugations: null, propOfVerb: pattern });
  }
}