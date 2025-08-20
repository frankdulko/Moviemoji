import { ObjectId } from "mongodb";
import { getDb } from "./db";

export type DBMovie = {
  title: string;
  year: number;
  emojis: string[];
  used?: boolean;
};

function todayKeyUTC() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export async function getTodaysMovie(): Promise<DBMovie | null> {
  const db = await getDb();
  const doc = await db.collection("daily").findOne({ dateKey: todayKeyUTC() }, { projection: { "movie._id": 0 } });
  return (doc?.movie as DBMovie) ?? null;
}

export async function getOrPickTodaysMovie(): Promise<DBMovie> {
  const db = await getDb();
  const key = todayKeyUTC();

  const existing = await db.collection("daily").findOne({ dateKey: key });
  if (existing?.movie) return existing.movie as DBMovie;

  const filter = {}; // add optional filters here if you want (e.g., { used: false })
  const [movie] = await db
    .collection<DBMovie>("movies")
    .aggregate([{ $match: filter }, { $sample: { size: 1 } }])
    .toArray();

  if (!movie) throw new Error("No movies left to pick.");

  // Mark used + store daily (transaction optional for simplicity)
  //await db.collection("movies").updateOne({ _id: movie._id }, { $set: { used: true } });
  await db.collection("daily").insertOne({ dateKey: key, movie, createdAt: new Date() });

  return movie as DBMovie;
}
