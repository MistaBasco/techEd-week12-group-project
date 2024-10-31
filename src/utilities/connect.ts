import { Pool } from "pg";

let db: Pool;

export default function connect(): Pool {
  if (!db) {
    db = new Pool({
      connectionString: process.env.DB_URL,
    });
  }
  return db;
}
