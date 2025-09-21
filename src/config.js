// ================= LOCAL (Conexión Externa) =================
//export const DB_USER = "user";
//export const DB_PASSWORD = "xoYxmwu5VmtLYOZ7ZXJuK4NExtSJJqD7";
//export const DB_HOST = "dpg-d31gpnur433s73f5iebg-a.oregon-postgres.render.com";
//export const DB_DATABASE = "cimove_w0wi";
//export const DB_PORT = 5432;
//
//export const DB_URL = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

// ================= PRODUCCIÓN (Render - Conexión Interna) =================
// export const DB_URL = "postgresql://user:xoYxmwu5VmtLYOZ7ZXJuK4NExtSJJqD7@dpg-d31gpnur433s73f5iebg-a/cimove_w0wi";

// ================= BASE DE DATOS ANTERIOR (comentada) =================
import dotenv from "dotenv";

// Carga las variables del archivo .env
dotenv.config();

// Variables exportadas
export const PORT = process.env.PORT || 4000;
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_HOST = process.env.DB_HOST;
export const DB_DATABASE = process.env.DB_DATABASE;
export const DB_PORT = process.env.DB_PORT;
export const DB_URL = process.env.DB_URL;

// ================= IMPRESIÓN PARA VERIFICACIÓN =================
console.log("===== CONFIGURACIÓN DE BASE DE DATOS =====");
console.log("DB_USER:", DB_USER);
console.log("DB_PASSWORD:", DB_PASSWORD);
console.log("DB_HOST:", DB_HOST);
console.log("DB_DATABASE:", DB_DATABASE);
console.log("DB_PORT:", DB_PORT);
console.log("DB_URL:", DB_URL);
console.log("Puerto del servidor:", PORT);
console.log("==========================================");
