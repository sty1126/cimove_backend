import PdfPrinter from "pdfmake";
import axios from "axios";

class ReportesService {
  constructor() {
    this.baseURL = "http://localhost:4000/api/estadisticas";

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

  createStyledTable(headers, data, widths = null) {
    return {
      table: {
        widths: widths || Array(headers.length).fill("*"),
        body: [
          headers.map((header) => ({
            text: header,
            style: "tableHeader",
            fillColor: "#2563eb",
            color: "white",
          })),
          ...data,
        ],
      },
      layout: {
        fillColor: (rowIndex, node, columnIndex) =>
          rowIndex % 2 === 0 ? "#f8fafc" : null,
        hLineWidth: (i, node) =>
          i === 0 || i === node.table.body.length ? 2 : 1,
        vLineWidth: (i, node) =>
          i === 0 || i === node.table.widths.length ? 2 : 1,
        hLineColor: (i, node) =>
          i === 0 || i === node.table.body.length ? "#1e40af" : "#e2e8f0",
        vLineColor: (i, node) =>
          i === 0 || i === node.table.widths.length ? "#1e40af" : "#e2e8f0",
        paddingLeft: (i, node) => 8,
        paddingRight: (i, node) => 8,
        paddingTop: (i, node) => 6,
        paddingBottom: (i, node) => 6,
      },
      margin: [0, 0, 0, 8],
    };
  }

  createSeparator() {
    return {
      canvas: [
        {
          type: "line",
          x1: 0,
          y1: 0,
          x2: 515,
          y2: 0,
          lineWidth: 2,
          lineColor: "#e2e8f0",
        },
      ],
      margin: [0, 5, 0, 8],
    };
  }

  async generateReportePDF(fechaInicio, fechaFin) {
    try {
      // ================= GENERAL =================
      const rentabilidadResp = await axios.get(
        `${this.baseURL}/generales/rentabilidad`,
        {
          params: { fechaInicio, fechaFin },
        }
      );
      const evolucionResp = await axios.get(
        `${this.baseURL}/generales/rentabilidad-evolucion`,
        {
          params: { fechaInicio, fechaFin },
        }
      );

      const generalSection = [
        {
          text: "RESUMEN GENERAL",
          fontSize: 16,
          bold: true,
          color: "#1e40af",
          margin: [0, 10, 0, 10],
          alignment: "left",
        },
        {
          columns: [
            {
              width: "*",
              stack: [
                {
                  text: "Ingreso Total",
                  style: "cardTitle",
                },
                {
                  text: this.formatCurrency(
                    rentabilidadResp.data.ingreso_total
                  ),
                  style: "cardValuePositive",
                },
              ],
              margin: [0, 0, 5, 0],
            },
            {
              width: "*",
              stack: [
                {
                  text: "Egreso Total",
                  style: "cardTitle",
                },
                {
                  text: this.formatCurrency(rentabilidadResp.data.egreso_total),
                  style: "cardValueNegative",
                },
              ],
              margin: [5, 0, 5, 0],
            },
            {
              width: "*",
              stack: [
                {
                  text: "Beneficio Neto",
                  style: "cardTitle",
                },
                {
                  text: this.formatCurrency(
                    rentabilidadResp.data.beneficio_neto
                  ),
                  style: "cardValueProfit",
                },
              ],
              margin: [5, 0, 0, 0],
            },
          ],
          columnGap: 10,
          margin: [0, 5, 0, 15],
        },
        {
          text: "Evolución de Rentabilidad",
          fontSize: 13,
          bold: true,
          color: "#374151",
          margin: [0, 5, 0, 8],
        },
        this.createStyledTable(
          ["Fecha", "Ingreso", "Beneficio Neto"],
          evolucionResp.data.map((r) => [
            this.formatDate(r.fecha),
            this.formatCurrency(r.ingreso_total),
            this.formatCurrency(r.beneficio_neto),
          ]),
          ["*", "*", "*"]
        ),
        this.createSeparator(),
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
        {
          text: "PRODUCTOS",
          fontSize: 16,
          bold: true,
          color: "#1e40af",
          margin: [0, 15, 0, 10],
          alignment: "left",
        },
        {
          text: "Productos Bajo Stock",
          fontSize: 13,
          bold: true,
          color: "#374151",
          margin: [0, 5, 0, 8],
        },
        this.createStyledTable(
          ["ID", "Nombre", "Categoría", "Stock Actual"],
          bajoStockResp.data.map((p) => [
            p.id_producto,
            p.nombre_producto,
            p.categoria,
            p.stock_actual,
          ]),
          ["auto", "*", "*", "auto"]
        ),
        {
          text: "Productos Más Vendidos",
          fontSize: 13,
          bold: true,
          color: "#374151",
          margin: [0, 10, 0, 8],
        },
        this.createStyledTable(
          ["ID", "Nombre", "Categoría", "Unidades", "Total Ventas"],
          masVendidosResp.data.map((p) => [
            p.id_producto,
            p.nombre_producto,
            p.categoria,
            p.total_unidades,
            this.formatCurrency(p.total_ventas),
          ]),
          ["auto", "*", "*", "auto", "*"]
        ),
        this.createSeparator(),
      ];

      // ================= INGRESOS =================
      const ventasDiaSemanaResp = await axios.get(
        `${this.baseURL}/ingresos/ventas-dia-semana`,
        {
          params: { fechaInicio, fechaFin },
        }
      );
      const ingresosCategoriaResp = await axios.get(
        `${this.baseURL}/ingresos/ingresos-categoria`,
        {
          params: { fechaInicio, fechaFin, limite: 10 },
        }
      );

      const ingresosSection = [
        {
          text: "INGRESOS",
          fontSize: 16,
          bold: true,
          color: "#1e40af",
          margin: [0, 15, 0, 10],
          alignment: "left",
        },
        {
          text: "Ventas por Día de la Semana",
          fontSize: 13,
          bold: true,
          color: "#374151",
          margin: [0, 5, 0, 8],
        },
        this.createStyledTable(
          [
            "Día",
            "Días con Ventas",
            "Cantidad Facturas",
            "Total Ventas",
            "Promedio Diario",
            "% Ventas",
          ],
          ventasDiaSemanaResp.data.map((r) => [
            r.nombre_dia,
            r.dias_con_ventas,
            r.cantidad_facturas,
            this.formatCurrency(r.total_ventas),
            this.formatCurrency(r.promedio_ventas_diarias),
            r.porcentaje_ventas + "%",
          ]),
          ["*", "auto", "auto", "*", "*", "auto"]
        ),
        {
          text: "Ingresos por Categoría",
          fontSize: 13,
          bold: true,
          color: "#374151",
          margin: [0, 10, 0, 8],
        },
        this.createStyledTable(
          ["ID", "Categoría", "Ingreso Total", "%"],
          ingresosCategoriaResp.data.map((r) => [
            r.id_categoria,
            r.categoria,
            this.formatCurrency(r.ingreso_total),
            r.porcentaje + "%",
          ]),
          ["auto", "*", "*", "auto"]
        ),
        this.createSeparator(),
      ];

      // ================= EGRESOS =================
      const egresosResp = await axios.get(`${this.baseURL}/egresos/egresos`, {
        params: { fechaInicio, fechaFin },
      });
      const principalesEgresosResp = await axios.get(
        `${this.baseURL}/egresos/principales-egresos`,
        {
          params: { fechaInicio, fechaFin, limite: 10 },
        }
      );

      const egresosSection = [
        {
          text: "EGRESOS",
          fontSize: 16,
          bold: true,
          color: "#1e40af",
          margin: [0, 15, 0, 10],
          alignment: "left",
        },
        {
          text: "Egresos Totales",
          fontSize: 13,
          bold: true,
          color: "#374151",
          margin: [0, 5, 0, 8],
        },
        this.createStyledTable(
          ["Fecha", "Egreso Total"],
          egresosResp.data.map((r) => [
            this.formatDate(r.fecha),
            this.formatCurrency(r.egreso_total),
          ]),
          ["*", "*"]
        ),
        {
          text: "Principales Egresos por Proveedor",
          fontSize: 13,
          bold: true,
          color: "#374151",
          margin: [0, 10, 0, 8],
        },
        this.createStyledTable(
          ["ID Proveedor", "Nombre", "Total Egreso"],
          principalesEgresosResp.data.map((r) => [
            r.id_proveedor,
            r.nombre_proveedor,
            this.formatCurrency(r.egreso_total),
          ]),
          ["auto", "*", "*"]
        ),
        this.createSeparator(),
      ];

      // ================= CLIENTES =================
      const mejoresClientesResp = await axios.get(
        `${this.baseURL}/clientes/mejores-clientes`,
        {
          params: { fechaInicio, fechaFin, limite: 10 },
        }
      );
      const clientesPorSedeResp = await axios.get(
        `${this.baseURL}/clientes/clientes-por-sede`,
        {
          params: { fechaInicio, fechaFin },
        }
      );

      const clientesSection = [
        {
          text: "CLIENTES",
          fontSize: 16,
          bold: true,
          color: "#1e40af",
          margin: [0, 15, 0, 10],
          alignment: "left",
        },
        {
          text: "Mejores Clientes",
          fontSize: 13,
          bold: true,
          color: "#374151",
          margin: [0, 5, 0, 8],
        },
        this.createStyledTable(
          ["ID", "Nombre", "Tipo", "Total Compras", "Cantidad Compras"],
          mejoresClientesResp.data.map((r) => [
            r.id_cliente,
            r.nombre_cliente,
            r.tipo_cliente,
            this.formatCurrency(r.total_compras),
            r.cantidad_compras,
          ]),
          ["auto", "*", "*", "*", "auto"]
        ),
        {
          text: "Clientes por Sede",
          fontSize: 13,
          bold: true,
          color: "#374151",
          margin: [0, 10, 0, 8],
        },
        this.createStyledTable(
          ["Sede", "ID Cliente", "Nombre", "Total Facturas", "Total Ventas"],
          clientesPorSedeResp.data.map((r) => [
            r.nombre_sede,
            r.id_cliente,
            r.nombre_cliente,
            r.total_facturas,
            this.formatCurrency(r.total_ventas),
          ]),
          ["*", "auto", "*", "auto", "*"]
        ),
      ];

      // ================= PDF DEFINITIVO =================
      const docDefinition = {
        content: [
          {
            columns: [
              {
                width: "*",
                stack: [
                  {
                    text: "Kper-shop",
                    style: "companyName",
                  },
                  {
                    text: "REPORTE DE ESTADÍSTICAS",
                    style: "mainTitle",
                  },
                  {
                    text: `Período: ${fechaInicio} - ${fechaFin}`,
                    style: "subtitle",
                  },
                ],
              },
              {
                width: "auto",
                stack: [
                  {
                    text: new Date().toLocaleDateString("es-CO"),
                    style: "dateStyle",
                  },
                  {
                    text: "Generado automáticamente",
                    style: "generatedBy",
                  },
                ],
              },
            ],
            margin: [0, 0, 0, 30],
          },
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: 515,
                y2: 0,
                lineWidth: 3,
                lineColor: "#2563eb",
              },
            ],
            margin: [0, 0, 0, 15],
          },
          ...generalSection,
          ...productosSection,
          ...ingresosSection,
          ...egresosSection,
          ...clientesSection,
          {
            canvas: [
              {
                type: "line",
                x1: 0,
                y1: 0,
                x2: 515,
                y2: 0,
                lineWidth: 2,
                lineColor: "#e2e8f0",
              },
            ],
            margin: [0, 20, 0, 10],
          },
          {
            columns: [
              {
                width: "*",
                text: "© 2024 Kper-shop - Todos los derechos reservados",
                style: "footerLeft",
              },
              {
                width: "auto",
                stack: [
                  {
                    text: "Generado por",
                    style: "footerSmall",
                  },
                  {
                    text: "CIMOVE",
                    style: "cimoveBrand",
                  },
                ],
              },
            ],
            margin: [0, 0, 0, 5],
          },
        ],
        styles: {
          companyName: {
            fontSize: 28,
            bold: true,
            color: "#1e40af",
            margin: [0, 0, 0, 5],
            decoration: "underline",
            decorationColor: "#3b82f6",
          },
          mainTitle: {
            fontSize: 20,
            bold: true,
            color: "#374151",
            margin: [0, 0, 0, 5],
          },
          subtitle: {
            fontSize: 14,
            color: "#64748b",
            italics: true,
          },
          dateStyle: {
            fontSize: 12,
            bold: true,
            color: "#374151",
            alignment: "right",
          },
          generatedBy: {
            fontSize: 10,
            color: "#9ca3af",
            alignment: "right",
          },
          sectionHeader: {
            fontSize: 18,
            bold: true,
            color: "#1e40af",
            margin: [0, 15, 0, 8],
            decoration: "underline",
            decorationColor: "#3b82f6",
          },
          subSectionHeader: {
            fontSize: 14,
            bold: true,
            color: "#374151",
            margin: [0, 8, 0, 5],
          },
          tableHeader: {
            fontSize: 11,
            bold: true,
            alignment: "center",
          },
          cardTitle: {
            fontSize: 11,
            color: "#6b7280",
            margin: [0, 0, 0, 3],
          },
          cardValuePositive: {
            fontSize: 16,
            bold: true,
            color: "#059669",
          },
          cardValueNegative: {
            fontSize: 16,
            bold: true,
            color: "#dc2626",
          },
          cardValueProfit: {
            fontSize: 16,
            bold: true,
            color: "#2563eb",
          },
          footerLeft: {
            fontSize: 10,
            color: "#6b7280",
            italics: true,
          },
          footerSmall: {
            fontSize: 8,
            color: "#9ca3af",
            alignment: "right",
          },
          cimoveBrand: {
            fontSize: 14,
            bold: true,
            color: "#2563eb",
            alignment: "right",
            decoration: "underline",
            decorationColor: "#3b82f6",
          },
        },
        defaultStyle: {
          fontSize: 10,
          font: "Roboto",
          lineHeight: 1.3,
        },
        pageMargins: [40, 50, 40, 50],
        info: {
          title: `Reporte Estadísticas Kper-shop ${fechaInicio} - ${fechaFin}`,
          author: "CIMOVE - Sistema de Reportes",
          subject: "Reporte de Estadísticas Empresariales",
          keywords:
            "estadísticas, reporte, ventas, productos, clientes, kper-shop",
        },
      };

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
