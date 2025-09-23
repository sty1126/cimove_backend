import pg from "pg";
import { DB_URL } from "./config.js";

// Conexión
export const pool = new pg.Pool({
  connectionString: DB_URL,
  ssl: {
    rejectUnauthorized: false, // Configuración de SSL
  },
});
