import pg from "pg";

export const pool = new pg.Pool({
  user: "postgres",
  host: "localhost",
  password: "123321",
  database: "CIMOVE",
  port: "5432",
});

// Para comprobar si la conexión funciona, pidiendo una simple fecha
// pool.query("SELECT NOW()").then((result) => {
//  console.log(result);
//});
