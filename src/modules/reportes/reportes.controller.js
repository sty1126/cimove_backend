import {
  generateClientesPDF,
  generateProductosPDF,
  generateIngresosPDF,
  generateEgresosPDF,
  generateGeneralPDF,
} from "./reportes.service.js"

export const generateReport = async (req, res) => {
  try {
    const { type } = req.params
    const params = req.body

    let pdfBuffer
    switch (type) {
      case "clientes":
        pdfBuffer = await generateClientesPDF(params)
        break
      case "productos":
        pdfBuffer = await generateProductosPDF(params)
        break
      case "ingresos":
        pdfBuffer = await generateIngresosPDF(params)
        break
      case "egresos":
        pdfBuffer = await generateEgresosPDF(params)
        break
      case "general":
        pdfBuffer = await generateGeneralPDF(params)
        break
      default:
        return res.status(400).json({ error: "Tipo de reporte no válido" })
    }

    res.setHeader("Content-Type", "application/pdf")
    res.setHeader("Content-Disposition", `attachment; filename=${type}-reporte.pdf`)
    res.send(pdfBuffer)
  } catch (error) {
    console.error("Error generando reporte:", error)
    res.status(500).json({ error: "Error generando el PDF" })
  }
}
