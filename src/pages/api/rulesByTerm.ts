import { NextApiRequest, NextApiResponse } from "next";
import { loadIrregObject } from "../../lib/jsonLoad";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  try {
    const regJson = await loadIrregObject();
    return res.status(200).json(regJson);
  } catch (err) {
    throw err
  }
}