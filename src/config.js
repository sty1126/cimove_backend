import dotenv from "dotenv";
dotenv.config();

// ================= LOCAL =================
export const DB_USER = "user"; // usuario de Render para conexión externa
export const DB_PASSWORD = "Z7z1NvSr9851YdrS3nv7mwomJ9vf6ydq";
export const DB_HOST = "dpg-d23djfh5pdvs739rlceg-a.oregon-postgres.render.com";
export const DB_DATABASE = "cimove_mofu";
export const DB_PORT = 5432;

export const DB_URL = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_DATABASE}`;

// ================= PRODUCCIÓN (Render) =================
// export const DB_URL = process.env.DATABASE_URL;
// export const DB_USER = undefined;
// export const DB_PASSWORD = undefined;
// export const DB_HOST = undefined;
// export const DB_DATABASE = undefined;
// export const DB_PORT = undefined;

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
