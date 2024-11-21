import fs from 'fs/promises';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ni, nw } from '../../lib/normalizeVerb';
import findOriginalVerbFormatted from '../../lib/findOriginalVerbFormatted';

const filePath = path.join(process.cwd(), 'src/json/allVerbs.json');
const INVALID_CHARS = "!\"#$%&'()*+,./:;<=>?@[\\]^_`{|}~1234567890";

export default async function handler(

  request: NextApiRequest,
  response: NextApiResponse,
  
) {
  
  if (request.method !== 'GET') return response.status(405).end();

  const { verb } = request.query;
  if (Array.isArray(verb) || !verb) return response.status(400).end();

  let normalizedVerb = ni(verb as string);

  const content = extractPunctuation(nw(normalizedVerb));
  const { hasPunct, punct } = content;

  if (hasPunct && punct) {
    const regex = new RegExp(`[${punct.join('')}]`, 'g');
    normalizedVerb = normalizedVerb.replace(regex, '');
  }

  try {

    const data = await fs.readFile(filePath, 'utf-8');
    const jsonObject = JSON.parse(data);

    const normalizedJsonObject = normalizeJsonKeys(jsonObject);
    const formatted = findOriginalVerbFormatted(jsonObject, normalizedVerb)

    if (normalizedVerb in normalizedJsonObject) {

      const similarWords = findSimilarWords(jsonObject, normalizedVerb);      
      const originalVerb = findOriginalVerb(jsonObject, normalizedVerb);
      const originalValue = jsonObject[originalVerb as string];
      const findedWord = originalValue[0];

      return response.status(200).json({
        result: true,
        findedWord,
        similar: similarWords.length > 0 ? [originalVerb, ...similarWords] : null,
        hasPunct,
        punct,
        forced: false,
        originalInput: formatted.originalInput
      });

    } else if (formatted.isForced && formatted.forcedVerb in normalizedJsonObject) {

      const similarWords = findSimilarWords(jsonObject, formatted.forcedVerb);
      const originalVerb = formatted.forcedVerb;
      const originalValue = jsonObject[originalVerb as string];
      const findedWord = originalValue[0];

      return response.status(200).json({
        result: true,
        findedWord,
        similar: similarWords.length > 0 ? [originalVerb, ...similarWords] : null,
        hasPunct,
        punct,
        forced: true,
        originalInput: formatted.originalInput

      });

    } else {

      return response.status(200).json({

        result: false,
        findedWord: null,
        similar: null,
        hasPunct,
        punct,
        originalInput: formatted.originalInput

      });
    }

  } catch (error) {

    console.error('Error reading or parsing file:', error);
    return response.status(500).end();

  }
}

function extractPunctuation(verb: string) {
  const content = { hasPunct: false, punct: null as string[] | null };

  for (const char of verb) {
    if (INVALID_CHARS.includes(nw(char))) {
      if (!content.punct) content.punct = [];
      if (!content.punct.includes(nw(char))) content.punct.push(nw(char));
    }
  }

  if (content.punct && content.punct.length > 0) {
    content.hasPunct = true;
  } else {
    content.punct = null;
    content.hasPunct = false;
  }

  return content;
}

function normalizeJsonKeys(jsonObject: Record<string, any>) {
  return Object.keys(jsonObject).reduce((acc, key) => {
    acc[ni(key)] = jsonObject[key];
    return acc;
  }, {} as Record<string, any>);
}

function findOriginalVerb(jsonObject: Record<string, any>, normalizedVerb: string) {
  return Object.keys(jsonObject).find((key) => ni(key) === normalizedVerb);
}

function findSimilarWords(jsonObject: Record<string, any>, normalizedVerb: string) {
  const similarWords: string[] = [];

  for (const key of Object.keys(jsonObject)) {
    if (
      ni(key) !== normalizedVerb &&
      (ni(key).replace(/ç/g, 'c') === normalizedVerb ||
        ni(key).replace(/c/g, 'ç') === normalizedVerb)
    ) {
      similarWords.push(key);
    }
  }

  return similarWords;
}
