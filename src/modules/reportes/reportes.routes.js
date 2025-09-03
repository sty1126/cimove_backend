import express from "express"
import { generateReport } from "./reportes.controller.js"

const router = express.Router()

router.post("/:type/pdf", generateReport)

export default router
