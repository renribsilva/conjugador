import fs from 'fs/promises';
import path from 'path';
import { ni } from './normalizeVerb';
import findOriginalVerbFormatted from './findOriginalVerbFormatted';
import isValidPrefix from './isValidPrefix';

const filePath = path.join(process.cwd(), 'src/json/allVerbs.json');
const INVALID_CHARS = "!\"#$%&'()*+,./:;<=>?@[\\]^_`{|}~1234567890";

// Caches
let cachedJsonObject: Record<string, any> | null = null;
let normalizedCache: Record<string, string> | null = null;

// Função para carregar o objeto JSON, aproveitando o cache
async function loadJsonObject() {
  if (!cachedJsonObject) {
    const data = await fs.readFile(filePath, 'utf-8');
    cachedJsonObject = JSON.parse(data);
  }
  return cachedJsonObject;
}

// Função para normalizar as chaves do JSON, aproveitando o cache
function getNormalizedJsonKeys(jsonObject: Record<string, any>) {
  if (!normalizedCache) {
    normalizedCache = Object.keys(jsonObject).reduce((acc, key) => {
      acc[ni(key)] = key;
      return acc;
    }, {} as Record<string, string>);
  }
  return normalizedCache;
}

// Função principal para processar o verbo
export async function processVerb(verb: string) {
  const normalizedVerb = ni(verb);
  const { hasPunct, punct } = extractPunctuation(normalizedVerb);

  let cleanedVerb = normalizedVerb;
  if (hasPunct && punct) {
    const regex = new RegExp(`[${punct.join('')}]`, 'g');
    cleanedVerb = cleanedVerb.replace(regex, '');
  }

  // Carregar dados JSON do arquivo ou do cache
  const jsonObject = await loadJsonObject();
  if (!jsonObject) {
    throw new Error('Failed to load JSON data.');
  }

  // Obter as chaves normalizadas do JSON
  const normalizedJsonObject = getNormalizedJsonKeys(jsonObject);

  // Procurar pelo verbo original formatado
  const formatted = findOriginalVerbFormatted(jsonObject, cleanedVerb);
  const originalVerb = findOriginalVerb(normalizedJsonObject, cleanedVerb);

  if (originalVerb) {
  
    const similarWords = findSimilarWords(normalizedJsonObject, cleanedVerb);
    const originalValue = jsonObject[originalVerb];
    const findedWord = originalValue[0];
    const hasPrefix = isValidPrefix(cleanedVerb).isValid

    return {
      result: true,
      findedWord,
      similar: similarWords.length > 0 ? [originalVerb, ...similarWords] : null,
      hasPunct,
      punct,
      hasPrefix, 
      formatted
    };

  } else if (formatted.forcedVerb && formatted.forcedVerb in normalizedJsonObject) {
    
    const similarWords = findSimilarWords(normalizedJsonObject, formatted.forcedVerb);
    const originalValue = jsonObject[formatted.forcedVerb];
    const findedWord = originalValue[0];
    const hasPrefix = isValidPrefix(formatted.forcedVerb).isValid

    return {
      result: true,
      findedWord,
      similar: similarWords.length > 0 ? [formatted.forcedVerb, ...similarWords] : null,
      hasPunct,
      punct,
      hasPrefix,
      formatted
    };
  } else {
    return {
      result: false,
      findedWord: null,
      similar: null,
      hasPunct,
      punct,
      hasPrefix: false,
      formatted
    };
  }
}

// Função para extrair pontuação do verbo
function extractPunctuation(verb: string) {
  const punct = verb.split('').filter((char) => INVALID_CHARS.includes(char));
  return {
    hasPunct: punct.length > 0,
    punct: punct.length > 0 ? Array.from(new Set(punct)) : null,
  };
}

// Função para encontrar o verbo original na lista normalizada
function findOriginalVerb(normalizedJsonObject: Record<string, string>, normalizedVerb: string) {
  return normalizedJsonObject[normalizedVerb] || null;
}

// Função para encontrar palavras similares ao verbo normalizado
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
