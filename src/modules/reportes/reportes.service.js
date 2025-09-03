import PdfPrinter from "pdfmake";
import path from "path";
import axios from "axios";

class ReportesService {
  constructor() {
    this.baseURL = "http://localhost:4000/api/estadisticas";

    // Fuentes pdfmake
    this.fonts = {
      Roboto: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
        italics: "Helvetica-Oblique",
        bolditalics: "Helvetica-BoldOblique",
      },
    };

    this.printer = new PdfPrinter(this.fonts);
  }

  formatCurrency(value) {
    if (!value) return "$0";
    return "$" + Number(value).toLocaleString("es-CO");
  }

  formatDate(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-CO");
  }

  async generateReportePDF(fechaInicio, fechaFin) {
    try {
      // ================= GENERAL =================
      const rentabilidadResp = await axios.get(
        `${this.baseURL}/generales/rentabilidad`,
        { params: { fechaInicio, fechaFin } }
      );
      const evolucionResp = await axios.get(
        `${this.baseURL}/generales/rentabilidad-evolucion`,
        { params: { fechaInicio, fechaFin } }
      );

      const generalSection = [
        { text: "GENERAL", style: "header" },
        {
          text: `Ingreso Total: ${this.formatCurrency(
            rentabilidadResp.data.ingreso_total
          )}`,
        },
        {
          text: `Egreso Total: ${this.formatCurrency(
            rentabilidadResp.data.egreso_total
          )}`,
        },
        {
          text: `Beneficio Neto: ${this.formatCurrency(
            rentabilidadResp.data.beneficio_neto
          )}`,
        },
        {
          text: "Evolución de Rentabilidad",
          style: "subheader",
          margin: [0, 10, 0, 5],
        },
        {
          table: {
            widths: ["*", "*", "*"],
            body: [
              ["Fecha", "Ingreso", "Beneficio Neto"],
              ...evolucionResp.data.map((r) => [
                this.formatDate(r.fecha),
                this.formatCurrency(r.ingreso_total),
                this.formatCurrency(r.beneficio_neto),
              ]),
            ],
          },
          layout: "lightHorizontalLines",
        },
      ];

      // ================= PRODUCTOS =================
      const bajoStockResp = await axios.get(
        `${this.baseURL}/productos/bajo-stock`,
        { params: { limite: 20 } }
      );
      const masVendidosResp = await axios.get(
        `${this.baseURL}/productos/mas-vendidos`,
        {
          params: { fechaInicio, fechaFin, limite: 10, ordenarPor: "unidades" },
        }
      );

      const productosSection = [
        { text: "PRODUCTOS", style: "header", margin: [0, 20, 0, 5] },
        { text: "Productos Bajo Stock", style: "subheader" },
        {
          table: {
            widths: ["*", "*", "*", "*"],
            body: [
              ["ID", "Nombre", "Categoría", "Stock Actual"],
              ...bajoStockResp.data.map((p) => [
                p.id_producto,
                p.nombre_producto,
                p.categoria,
                p.stock_actual,
              ]),
            ],
          },
          layout: "lightHorizontalLines",
        },
        {
          text: "Productos Más Vendidos",
          style: "subheader",
          margin: [0, 10, 0, 5],
        },
        {
          table: {
            widths: ["*", "*", "*", "*", "*"],
            body: [
              ["ID", "Nombre", "Categoría", "Unidades", "Total Ventas"],
              ...masVendidosResp.data.map((p) => [
                p.id_producto,
                p.nombre_producto,
                p.categoria,
                p.total_unidades,
                this.formatCurrency(p.total_ventas),
              ]),
            ],
          },
          layout: "lightHorizontalLines",
        },
      ];

      // ================= INGRESOS =================
      const ventasDiaSemanaResp = await axios.get(
        `${this.baseURL}/ingresos/ventas-dia-semana`,
        { params: { fechaInicio, fechaFin } }
      );
      const ingresosCategoriaResp = await axios.get(
        `${this.baseURL}/ingresos/ingresos-categoria`,
        { params: { fechaInicio, fechaFin, limite: 10 } }
      );

      const ingresosSection = [
        { text: "INGRESOS", style: "header", margin: [0, 20, 0, 5] },
        { text: "Ventas por Día de la Semana", style: "subheader" },
        {
          table: {
            widths: ["*", "*", "*", "*", "*", "*"],
            body: [
              [
                "Día",
                "Días con Ventas",
                "Cantidad Facturas",
                "Total Ventas",
                "Promedio Diario",
                "% Ventas",
              ],
              ...ventasDiaSemanaResp.data.map((r) => [
                r.nombre_dia,
                r.dias_con_ventas,
                r.cantidad_facturas,
                this.formatCurrency(r.total_ventas),
                this.formatCurrency(r.promedio_ventas_diarias),
                r.porcentaje_ventas + "%",
              ]),
            ],
          },
          layout: "lightHorizontalLines",
        },
        {
          text: "Ingresos por Categoría",
          style: "subheader",
          margin: [0, 10, 0, 5],
        },
        {
          table: {
            widths: ["*", "*", "*", "*"],
            body: [
              ["ID", "Categoría", "Ingreso Total", "%"],
              ...ingresosCategoriaResp.data.map((r) => [
                r.id_categoria,
                r.categoria,
                this.formatCurrency(r.ingreso_total),
                r.porcentaje + "%",
              ]),
            ],
          },
          layout: "lightHorizontalLines",
        },
      ];

      // ================= EGRESOS =================
      const egresosResp = await axios.get(`${this.baseURL}/egresos/egresos`, {
        params: { fechaInicio, fechaFin },
      });
      const principalesEgresosResp = await axios.get(
        `${this.baseURL}/egresos/principales-egresos`,
        { params: { fechaInicio, fechaFin, limite: 10 } }
      );

      const egresosSection = [
        { text: "EGRESOS", style: "header", margin: [0, 20, 0, 5] },
        { text: "Egresos Totales", style: "subheader" },
        {
          table: {
            widths: ["*", "*"],
            body: [
              ["Fecha", "Egreso Total"],
              ...egresosResp.data.map((r) => [
                this.formatDate(r.fecha),
                this.formatCurrency(r.egreso_total),
              ]),
            ],
          },
          layout: "lightHorizontalLines",
        },
        {
          text: "Principales Egresos por Proveedor",
          style: "subheader",
          margin: [0, 10, 0, 5],
        },
        {
          table: {
            widths: ["*", "*", "*"],
            body: [
              ["ID Proveedor", "Nombre", "Total Egreso"],
              ...principalesEgresosResp.data.map((r) => [
                r.id_proveedor,
                r.nombre_proveedor,
                this.formatCurrency(r.egreso_total),
              ]),
            ],
          },
          layout: "lightHorizontalLines",
        },
      ];

      // ================= CLIENTES =================
      const mejoresClientesResp = await axios.get(
        `${this.baseURL}/clientes/mejores-clientes`,
        { params: { fechaInicio, fechaFin, limite: 10 } }
      );
      const clientesPorSedeResp = await axios.get(
        `${this.baseURL}/clientes/clientes-por-sede`,
        { params: { fechaInicio, fechaFin } }
      );

      const clientesSection = [
        { text: "CLIENTES", style: "header", margin: [0, 20, 0, 5] },
        { text: "Mejores Clientes", style: "subheader" },
        {
          table: {
            widths: ["*", "*", "*", "*", "*"],
            body: [
              ["ID", "Nombre", "Tipo", "Total Compras", "Cantidad Compras"],
              ...mejoresClientesResp.data.map((r) => [
                r.id_cliente,
                r.nombre_cliente,
                r.tipo_cliente,
                this.formatCurrency(r.total_compras),
                r.cantidad_compras,
              ]),
            ],
          },
          layout: "lightHorizontalLines",
        },
        {
          text: "Clientes por Sede",
          style: "subheader",
          margin: [0, 10, 0, 5],
        },
        {
          table: {
            widths: ["*", "*", "*", "*", "*"],
            body: [
              [
                "Sede",
                "ID Cliente",
                "Nombre",
                "Total Facturas",
                "Total Ventas",
              ],
              ...clientesPorSedeResp.data.map((r) => [
                r.nombre_sede,
                r.id_cliente,
                r.nombre_cliente,
                r.total_facturas,
                this.formatCurrency(r.total_ventas),
              ]),
            ],
          },
          layout: "lightHorizontalLines",
        },
      ];

      // ================= PDF DEFINITIVO =================
      const docDefinition = {
        content: [
          {
            text: `Reporte de Estadísticas (${fechaInicio} - ${fechaFin})`,
            style: "title",
            margin: [0, 0, 0, 10],
          },
          ...generalSection,
          ...productosSection,
          ...ingresosSection,
          ...egresosSection,
          ...clientesSection,
        ],
        styles: {
          title: { fontSize: 18, bold: true },
          header: { fontSize: 16, bold: true },
          subheader: { fontSize: 14, bold: true },
        },
        defaultStyle: { fontSize: 11, font: "Roboto" },
      };

      // Convertimos a PDF Buffer
      const pdfDoc = this.printer.createPdfKitDocument(docDefinition);
      return new Promise((resolve, reject) => {
        const chunks = [];
        pdfDoc.on("data", (chunk) => chunks.push(chunk));
        pdfDoc.on("end", () => resolve(Buffer.concat(chunks)));
        pdfDoc.on("error", reject);
        pdfDoc.end();
      });
    } catch (error) {
      console.error("Error generando el PDF:", error);
      throw error;
    }
  }
}

export default ReportesService;
