import dotenv from "dotenv";
dotenv.config(); // Cargar las variables del archivo .env

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_DATABASE:", process.env.DB_DATABASE);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_URL:", process.env.DB_URL);

export const DB_USER = "user";
export const DB_PASSWORD = "9BP95pUndVwsKckL8DZntyHwYPf11XfV";
export const DB_HOST = "dpg-d08539vdiees738tpe3g-a.oregon-postgres.render.com";
export const DB_DATABASE = "cimove";
export const DB_PORT = "5432";
export const DB_URL =
  "postgres://user:9BP95pUndVwsKckL8DZntyHwYPf11XfV@dpg-d08539vdiees738tpe3g-a.oregon-postgres.render.com/cimove";

export const PORT = process.env.PORT || 4000;
