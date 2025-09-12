import dotenv from "dotenv";
dotenv.config();

// ================= LOCAL (Conexión Externa) =================
export const DB_USER = "user";
export const DB_PASSWORD = "xoYxmwu5VmtLYOZ7ZXJuK4NExtSJJqD7";
export const DB_HOST = "dpg-d31gpnur433s73f5iebg-a.oregon-postgres.render.com";
export const DB_DATABASE = "cimove_w0wi";
export const DB_PORT = 5432;

export const DB_URL = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

// ================= PRODUCCIÓN (Render - Conexión Interna) =================
// export const DB_URL = "postgresql://user:xoYxmwu5VmtLYOZ7ZXJuK4NExtSJJqD7@dpg-d31gpnur433s73f5iebg-a/cimove_w0wi";

// ================= BASE DE DATOS ANTERIOR (comentada) =================
// export const DB_USER = "user";
// export const DB_PASSWORD = "zOn1tEN8fVAbelj51aGHJKT0xxibJdCi";
// export const DB_HOST = "dpg-d2nka2be5dus73ftg920-a.oregon-postgres.render.com";
// export const DB_DATABASE = "cimove_db";
// export const DB_PORT = 5432;
// export const DB_URL = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;


export const PORT = process.env.PORT || 4000;

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
