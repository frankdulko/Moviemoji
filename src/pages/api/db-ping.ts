import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/lib/db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const db = await getDb();
    // Lightweight command to verify connectivity
    const result = await db.command({ ping: 1 });
    res.status(200).json({ ok: true, result });
  } catch (err: any) {
    console.error("DB PING ERROR:", err);
    res.status(500).json({ ok: false, error: err?.message });
  }
}
