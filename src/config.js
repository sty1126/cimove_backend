import dotenv from "dotenv";
dotenv.config();

// Credenciales
export const DB_USER = "user";
export const DB_PASSWORD = "QgDzlxnU7tLITopGVpG2YPMjdLKq2zIq";
export const DB_HOST = "dpg-d1av76euk2gs7396tmgg-a.oregon-postgres.render.com";
export const DB_DATABASE = "cimove_2yyy";
export const DB_PORT = "5432";

// Construcción de URL
export const DB_URL = `postgres://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_DATABASE}`;

// Puerto del servidor
export const PORT = process.env.PORT || 4000;

// Imprimir toda la info para verificación
console.log("===== CONFIGURACIÓN DE BASE DE DATOS =====");
console.log("DB_USER:", DB_USER);
console.log("DB_PASSWORD:", DB_PASSWORD);
console.log("DB_HOST:", DB_HOST);
console.log("DB_DATABASE:", DB_DATABASE);
console.log("DB_PORT:", DB_PORT);
console.log("DB_URL:", DB_URL);
console.log("Puerto del servidor:", PORT);
console.log("==========================================");
