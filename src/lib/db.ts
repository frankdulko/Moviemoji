// lib/db.ts (TypeScript, MongoDB Node driver v5)
import { MongoClient, Db } from "mongodb";

const uri = process.env.MONGODB_URI!;
const dbName = process.env.MONGODB_DB!;

if (!uri) throw new Error("MONGODB_URI is not set");
if (!dbName) throw new Error("MONGODB_DB is not set");

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _mongoDb: Db | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "development") {
  // In dev, use a global so hot-reloads don't create new clients
  if (!global._mongoClientPromise) {
    console.log("[DB] Creating new MongoClient and connecting…", process.pid);
    const client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise!;
} else {
  // In prod, a single module instance is fine
  console.log("[DB] Creating new MongoClient and connecting (prod)…", process.pid);
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDb(): Promise<Db> {
  if (global._mongoDb) return global._mongoDb;
  const client = await clientPromise;
  const db = client.db(dbName);
  // cache for reuse (esp. in dev)
  global._mongoDb = db;
  return db;
}
