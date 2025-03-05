import express from "express";
import { PORT } from "./config.js";

const app = express();

// Asignación de puerto importada desde config.js
app.listen(PORT);
console.log("Server on port", PORT);
