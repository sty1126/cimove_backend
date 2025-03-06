import { Router } from "express";
import { pool } from "../db.js";

const router = Router();

router.get("/productos", async (req, res) => {
  const { rows } = await pool.query("SELECT * FROM producto");
  console.log(rows);
  res.json(rows);
});

router.get("/productos/:productoId", async (req, res) => {
  const { productoId } = req.params;
  const { rows } = await pool.query(
    "SELECT * FROM producto WHERE id_producto = $1",
    [productoId]
  );
  console.log(rows);
  res.json(rows);

  if (rows.length === 0) {
    return res.json({ messa });
  }
});

router.post("/productos", (req, res) => {
  res.send("Creando productos");
});

router.put("/productos/:productoId", (req, res) => {
  const { productoId } = req.params;
  res.send("Actualizar producto" + productoId);
});

export default router;
