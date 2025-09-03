import PdfPrinter from "pdfmake"
import path from "path"
import {
  fetchProductosMasVendidos,
  fetchProductosBajoStock,
  fetchClientesActivos,
  fetchMejoresClientes,
  fetchTicketPromedioClientes,
  fetchSegmentacionClientes,
  fetchDashboardClientes,
  fetchIngresos,
  fetchEgresos,
  fetchDashboardFinanzas,
} from "./reportes.repository.js"

// Definir fuentes virtuales (basadas en las estándar)
const fonts = {
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};

const printer = new PdfPrinter(fonts)

const createPdf = (docDefinition) =>
  new Promise((resolve, reject) => {
    const chunks = []
    const doc = printer.createPdfKitDocument(docDefinition)
    doc.on("data", (chunk) => chunks.push(chunk))
    doc.on("end", () => resolve(Buffer.concat(chunks)))
    doc.end()
  })

// ---------------- Reportes ----------------
export const generateClientesPDF = async ({ fechaInicio, fechaFin, tipoPeriodo }) => {
  const [activos, mejores, ticket, segmentacion, dashboard] = await Promise.all([
    fetchClientesActivos(fechaInicio, fechaFin, tipoPeriodo),
    fetchMejoresClientes(fechaInicio, fechaFin),
    fetchTicketPromedioClientes(fechaInicio, fechaFin, tipoPeriodo),
    fetchSegmentacionClientes(fechaInicio, fechaFin),
    fetchDashboardClientes(fechaInicio, fechaFin, tipoPeriodo),
  ])

  const docDefinition = {
    content: [
      { text: "Reporte de Clientes", style: "header" },
      { text: `Total Clientes: ${dashboard?.resumen?.totalClientes || 0}` },
      { text: `Ticket Promedio: ${dashboard?.resumen?.ticketPromedioGeneral || 0}` },
      { text: "\nMejores Clientes", style: "subheader" },
      { ul: mejores.map((c) => `${c.nombre_cliente} - $${c.total_compras}`) },
      { text: "\nSegmentación de Clientes", style: "subheader" },
      { ul: segmentacion.map((s) => `${s.segmento_frecuencia} (${s.estado_actividad}) - ${s.cantidad_clientes}`) },
    ],
    styles: {
      header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
      subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
    },
  }

  return createPdf(docDefinition)
}

export const generateProductosPDF = async ({ fechaInicio, fechaFin, ordenarPor }) => {
  const [masVendidos, bajoStock] = await Promise.all([
    fetchProductosMasVendidos(fechaInicio, fechaFin, ordenarPor),
    fetchProductosBajoStock(),
  ])

  const docDefinition = {
    content: [
      { text: "Reporte de Productos", style: "header" },
      { text: "\nMás Vendidos", style: "subheader" },
      { ul: masVendidos.map((p) => `${p.nombre_producto} - ${p.total_unidades} uds`) },
      { text: "\nBajo Stock", style: "subheader" },
      { ul: bajoStock.map((p) => `${p.nombre_producto} - Stock actual: ${p.stock_actual}`) },
    ],
    styles: {
      header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] },
      subheader: { fontSize: 14, bold: true, margin: [0, 10, 0, 5] },
    },
  }

  return createPdf(docDefinition)
}

export const generateIngresosPDF = async ({ fechaInicio, fechaFin }) => {
  const [ingresos, dashboard] = await Promise.all([
    fetchIngresos(fechaInicio, fechaFin),
    fetchDashboardFinanzas(fechaInicio, fechaFin),
  ])

  const docDefinition = {
    content: [
      { text: "Reporte de Ingresos", style: "header" },
      { text: `Total: $${dashboard.totalIngresos}` },
      { ul: ingresos.map((i) => `${i.fecha} - ${i.metodo_pago}: $${i.monto}`) },
    ],
  }

  return createPdf(docDefinition)
}

export const generateEgresosPDF = async ({ fechaInicio, fechaFin }) => {
  const [egresos, dashboard] = await Promise.all([
    fetchEgresos(fechaInicio, fechaFin),
    fetchDashboardFinanzas(fechaInicio, fechaFin),
  ])

  const docDefinition = {
    content: [
      { text: "Reporte de Egresos", style: "header" },
      { text: `Total: $${dashboard.totalEgresos}` },
      { ul: egresos.map((e) => `${e.fecha} - ${e.concepto}: $${e.monto}`) },
    ],
  }

  return createPdf(docDefinition)
}

export const generateGeneralPDF = async ({ fechaInicio, fechaFin }) => {
  const [ingresos, egresos, dashboard] = await Promise.all([
    fetchIngresos(fechaInicio, fechaFin),
    fetchEgresos(fechaInicio, fechaFin),
    fetchDashboardFinanzas(fechaInicio, fechaFin),
  ])

  const docDefinition = {
    content: [
      { text: "Reporte General", style: "header" },
      { text: `Ingresos: $${dashboard.totalIngresos}`, margin: [0, 0, 0, 5] },
      { text: `Egresos: $${dashboard.totalEgresos}`, margin: [0, 0, 0, 10] },
      { text: "\nDetalle Ingresos", style: "subheader" },
      { ul: ingresos.map((i) => `${i.fecha} - ${i.metodo_pago}: $${i.monto}`) },
      { text: "\nDetalle Egresos", style: "subheader" },
      { ul: egresos.map((e) => `${e.fecha} - ${e.concepto}: $${e.monto}`) },
    ],
  }

  return createPdf(docDefinition)
}
