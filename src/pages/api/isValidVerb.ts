import fs from 'fs/promises';
import path from 'path';
import type { NextApiRequest, NextApiResponse } from 'next';
import { ni } from '../../lib/normalizeVerb';

const filePath = path.join(process.cwd(), 'src/json/allVerbs.json');

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method !== 'GET') return response.status(405).end();

  const { verb } = request.query;

  if (Array.isArray(verb) || !verb) return response.status(400).end();

  const normalizedVerb = ni(verb as string); 

  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const jsonObject = JSON.parse(data);
    const similarWords: string[] = [];

    const normalizedJsonObject = Object.keys(jsonObject).reduce((acc, key) => {
      acc[ni(key)] = jsonObject[key]; 
      return acc;
    }, {} as Record<string, any>);

    if (normalizedVerb in normalizedJsonObject) {
      const originalVerb = Object.keys(jsonObject).find(key => ni(key) === normalizedVerb);
      const originalValue = jsonObject[originalVerb as string]; 
      const findedWord = originalValue[0];

      for (const key of Object.keys(jsonObject)) {
        if (
          ni(key) !== normalizedVerb &&
          (ni(key).replace(/ç/g, 'c') === normalizedVerb ||
          ni(key).replace(/c/g, 'ç') === normalizedVerb)
        ) {
          similarWords.push(key);
        }
      }

      if (similarWords.length > 0) {
        similarWords.unshift(originalVerb as string);
        return response.status(200).json({
          result: true,
          findedWord,
          similar: similarWords,  // Retorna como array
        });
      } else {
        return response.status(200).json({
          result: true,
          findedWord,
          similar: null,  // Retorna null se não houver palavras similares
        });
      }
    } else {
      return response.status(200).json({ 
        result: false,
        findedWord: null,
        similar: null,
      });
    }
  } catch (error) {
    console.error(error);
    return response.status(500).end();
  }
}
