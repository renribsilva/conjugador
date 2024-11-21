import fs from 'fs/promises';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ni, nw } from '../../lib/normalizeVerb';
import findOriginalVerbFormatted from '../../lib/findOriginalVerbFormatted';

const filePath = path.join(process.cwd(), 'src/json/allVerbs.json');
const INVALID_CHARS = "!\"#$%&'()*+,./:;<=>?@[\\]^_`{|}~1234567890";

let cachedJsonObject: Record<string, any> | null = null;
let normalizedCache: Record<string, string> | null = null;

async function loadJsonObject() {
  if (!cachedJsonObject) {
    const data = await fs.readFile(filePath, 'utf-8');
    cachedJsonObject = JSON.parse(data);
  }
  return cachedJsonObject;
}

function getNormalizedJsonKeys(jsonObject: Record<string, any>) {
  if (!normalizedCache) {
    normalizedCache = Object.keys(jsonObject).reduce((acc, key) => {
      acc[ni(key)] = key;
      return acc;
    }, {} as Record<string, string>);
  }
  return normalizedCache;
}

export default async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method !== 'GET') return response.status(405).end();

  const { verb } = request.query;
  if (Array.isArray(verb) || !verb) return response.status(400).end();

  let normalizedVerb = ni(verb as string);
  const { hasPunct, punct } = extractPunctuation(normalizedVerb);

  if (hasPunct && punct) {
    const regex = new RegExp(`[${punct.join('')}]`, 'g');
    normalizedVerb = normalizedVerb.replace(regex, '');
  }

  try {
    const jsonObject = await loadJsonObject();

    if (!jsonObject) {
      return response.status(500).json({ error: 'Failed to load JSON data.' });
    }

    const normalizedJsonObject = getNormalizedJsonKeys(jsonObject);
    const formatted = findOriginalVerbFormatted(jsonObject, normalizedVerb);

    const originalVerb = findOriginalVerb(normalizedJsonObject, normalizedVerb);

    if (originalVerb) {
      const similarWords = findSimilarWords(normalizedJsonObject, normalizedVerb);
      const originalValue = jsonObject[originalVerb];
      const findedWord = originalValue[0];

      return response.status(200).json({
        result: true,
        findedWord,
        similar: similarWords.length > 0 ? [originalVerb, ...similarWords] : null,
        hasPunct,
        punct,
        forced: false,
        originalInput: formatted.originalInput,
      });
    } else if (formatted.isForced && formatted.forcedVerb in normalizedJsonObject) {
      const similarWords = findSimilarWords(normalizedJsonObject, formatted.forcedVerb);
      const originalValue = jsonObject[formatted.forcedVerb];
      const findedWord = originalValue[0];

      return response.status(200).json({
        result: true,
        findedWord,
        similar: similarWords.length > 0 ? [formatted.forcedVerb, ...similarWords] : null,
        hasPunct,
        punct,
        forced: true,
        originalInput: formatted.originalInput,
      });
    } else {
      return response.status(200).json({
        result: false,
        findedWord: null,
        similar: null,
        hasPunct,
        punct,
        originalInput: formatted.originalInput,
      });
    }
  } catch (error) {
    console.error('Error reading or parsing file:', error);
    return response.status(500).end();
  }
}

function extractPunctuation(verb: string) {
  const punct = verb.split('').filter((char) => INVALID_CHARS.includes(char));
  return {
    hasPunct: punct.length > 0,
    punct: punct.length > 0 ? Array.from(new Set(punct)) : null,
  };
}

function findOriginalVerb(normalizedJsonObject: Record<string, string>, normalizedVerb: string) {
  return normalizedJsonObject[normalizedVerb] || null;
}

function findSimilarWords(normalizedJsonObject: Record<string, string>, normalizedVerb: string) {
  const similarWords: string[] = [];
  for (const [normalizedKey, originalKey] of Object.entries(normalizedJsonObject)) {
    if (
      normalizedKey !== normalizedVerb &&
      (normalizedKey.replace(/ç/g, 'c') === normalizedVerb || normalizedKey.replace(/c/g, 'ç') === normalizedVerb)
    ) {
      similarWords.push(originalKey);
    }
  }
  return similarWords;
}
