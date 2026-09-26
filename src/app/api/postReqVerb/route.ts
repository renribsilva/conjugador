import { sql } from "@vercel/postgres";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { data, type } = body;

    if (!data || typeof data !== "string") {
      return NextResponse.json(
        { error: "A valid string is required" },
        { status: 400 },
      );
    }

    if (!type || typeof type !== "string") {
      return NextResponse.json(
        { error: "A valid type is required" },
        { status: 400 },
      );
    }

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

    return NextResponse.json({ post: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ post: false }, { status: 200 });
  }
}
