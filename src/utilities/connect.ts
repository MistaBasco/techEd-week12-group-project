import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();
let db: Pool;

export default function connect(): Pool {
  if (!db) {
    db = new Pool({
      connectionString: process.env.DB_URL,
    });
  }
  return db;
}
