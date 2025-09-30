import { NextApiRequest, NextApiResponse } from "next";
import { loadAllVerbObject } from "../../lib/jsonLoad";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const allVerbJson = await loadAllVerbObject();
    if (!allVerbJson) return res.status(200).json({});
    return res.status(200).json(allVerbJson);
  } catch {
    return res.status(200).json({});
  }
}