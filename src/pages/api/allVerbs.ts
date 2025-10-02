import { NextApiRequest, NextApiResponse } from "next";
import { loadAllVerbObject } from "../../lib/jsonLoad";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await loadAllVerbObject();
    return res.status(200).json(response);
  } catch (err) {
    throw err
  }
}