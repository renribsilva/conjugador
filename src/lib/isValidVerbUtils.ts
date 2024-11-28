import { ni } from "./normalizeVerb";
import fs from 'fs/promises';
import path from 'path';

const INVALID_CHARS = "!\"#$%&'()*+,./:;<=>?@[\\]^_`{|}~1234567890";

export function extractPunctuation(verb: string) {
  const punct = verb.split('').filter((char) => INVALID_CHARS.includes(char));
  return {
    punct: punct.length > 0 ? Array.from(new Set(punct)) : null,
  };
}

export function findOriginalVerb(normalizedJsonObject: Record<string, string>, normalizedVerb: string) {
  return normalizedJsonObject[normalizedVerb] || null;
}

export function findSimilarWords(normalizedJsonObject: Record<string, string>, normalizedVerb: string) {
  const similarWords: string[] = [];
  for (const [normalizedKey, originalKey] of Object.entries(normalizedJsonObject)) {
    if (
      normalizedKey !== normalizedVerb &&
      (normalizedKey.replace(/ç/g, 'c') === normalizedVerb )
    ) {
      similarWords.push(originalKey);
    }
  }
  return similarWords;
}

let normalizedCache: Record<string, string> | null = null;

export function getNormalizedJsonKeys(jsonObject: Record<string, any>) {
  if (!normalizedCache) {
    normalizedCache = Object.keys(jsonObject).reduce((acc, key) => {
      acc[ni(key)] = key;
      return acc;
    }, {} as Record<string, string>);
  }
  return normalizedCache;
}

let cachedJsonObject: Record<string, any> | null = null;
const filePath = path.join(process.cwd(), 'src/json/allVerbs.json');

export async function loadJsonObject() {
  if (!cachedJsonObject) {
    const data = await fs.readFile(filePath, 'utf-8');
    cachedJsonObject = JSON.parse(data);
  }
  return cachedJsonObject;
}