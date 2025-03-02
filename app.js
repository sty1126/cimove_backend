const express = require("express");
const app = express();

const PORT = 5000;

app.get("/", (req, res) => {
  res.send("¡Hola desde el servidor Node.js!");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
