import { sql } from '@vercel/postgres';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { data, deleteAll } = request.body;
    console.log(data)
    console.log(deleteAll)

    if (!data || typeof data !== 'string') {
      return response.status(400).json({ error: 'A valid string is required' });
    }

    if (deleteAll) {
      await sql`DELETE FROM requisitions;`;
    }

    const result = await sql`
      SELECT 1 FROM requisitions WHERE (review_conj::jsonb) IS NOT NULL AND review_conj::jsonb != '{}'::jsonb LIMIT 1;
    `;
    
    if (result.rowCount === 0) {
      // Se não houver nenhuma linha válida, insere uma linha com review_conj como um JSON vazio
      await sql`
        INSERT INTO requisitions (review_conj)
        VALUES ('{}'::jsonb);
      `;
    }

    const nextKey = await getNextKey();

    await sql`
      UPDATE requisitions
      SET review_conj = jsonb_set(
        review_conj::jsonb,          -- Usa o review_conj existente
        ${`{${nextKey}}`}::text[],   -- Caminho do campo "data" no JSON
        ${JSON.stringify(data)}::jsonb -- Insere o valor de "data" de forma segura
      )
      WHERE review_conj IS NOT NULL;
    `;

    return response.status(200).json({ message: 'Data successfully added to review_conj!' });
  } catch (error) {
    console.error('Error handling request:', error.message);
    return response.status(500).json({ error: error.message });
  }
}

async function getNextKey() {

  const result = await sql`
    SELECT review_conj
    FROM requisitions
    WHERE review_conj IS NOT NULL
    LIMIT 1;
  `;

  console.log(result);

  let nextKey = 1;
  
  console.log("nextKey:", nextKey);

  return nextKey;
}

getNextKey();