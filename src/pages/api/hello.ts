// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { DBMovie, getOrPickTodaysMovie } from "@/lib/movies";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<DBMovie>) {
  const movie = await getOrPickTodaysMovie();
  res.status(200).json(movie);
}
