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

    const { data, type } = request.body;

    if (!data || typeof data !== 'string') {
      return response.status(400).json({ error: 'A valid string is required' });
    }

    if (!type || typeof type !== 'string') {
      return response.status(400).json({ error: 'A valid type is required' });
    }

    // await sql`DELETE FROM requisitions WHERE type = ${type};`;

    const result = await sql`
      SELECT data
      FROM requisitions
      WHERE type = ${type}
      LIMIT 1;
    `;

    let currentData: string[] = [];

    if (result.rowCount && result.rowCount > 0) {
      currentData = result.rows[0].data || [];
    } else {
      await sql`
        INSERT INTO requisitions (type, data)
        VALUES (${type}, '[]'::jsonb);
      `;
    }

    currentData.push(data);

    const uniqueData = Array.from(new Set(currentData));

    await sql`
      UPDATE requisitions
      SET data = ${JSON.stringify(uniqueData)}::jsonb
      WHERE type = ${type};
    `;
    return response.status(200).json({ post: true });
  } catch (error) {
    return response.status(200).json({ post: false });
  }
}
