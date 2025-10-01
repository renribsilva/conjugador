import { NextApiRequest, NextApiResponse } from "next";
import { loadRegObject } from "../../lib/jsonLoad";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const regJson = await loadRegObject();
    if (!regJson) return res.status(200).json({});
    return res.status(200).json(regJson);
  } catch {
    return res.status(200).json({});
  }
}