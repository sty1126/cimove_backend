import pg from "pg";
import { DB_URL } from "./config.js";

export const pool = new pg.Pool({
  user: DB_USER,
  host: DB_HOST,
  password: DB_PASSWORD,
  database: DB_DATABASE,
  port: DB_PORT,
  ssl: false,
  connectionString: DB_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
