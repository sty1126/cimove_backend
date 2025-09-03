import ReportesService from "./reportes.service.js";

class ReportesController {
  constructor() {
    this.reportesService = new ReportesService();
  }

  async generarReportePDF(req, res) {
    try {
      const { fechaInicio, fechaFin } = req.body;

      if (!fechaInicio || !fechaFin) {
        return res
          .status(400)
          .json({ error: "Las fechas de inicio y fin son requeridas" });
      }

      const fechaInicioDate = new Date(fechaInicio);
      const fechaFinDate = new Date(fechaFin);

      if (isNaN(fechaInicioDate.getTime()) || isNaN(fechaFinDate.getTime())) {
        return res
          .status(400)
          .json({ error: "Formato de fecha inválido. Use YYYY-MM-DD" });
      }

      if (fechaInicioDate > fechaFinDate) {
        return res.status(400).json({
          error: "La fecha de inicio no puede ser mayor que la fecha de fin",
        });
      }

      // Genera el PDF como buffer
      const pdfBuffer = await this.reportesService.generateReportePDF(
        fechaInicio,
        fechaFin
      );

      const filename = `reporte_estadisticas_${fechaInicio}_${fechaFin}.pdf`;

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${filename}"`
      );
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "Content-Type");

      // Enviamos el buffer para descarga
      res.send(pdfBuffer);
    } catch (error) {
      console.error("Error generando reporte PDF:", error);
      res.status(500).json({
        error: "Error interno del servidor al generar el reporte",
        details: error.message,
      });
    }
  }

  async obtenerEstadoReporte(req, res) {
    try {
      res.json({
        status: "success",
        message: "Servicio de reportes disponible",
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error obteniendo estado del reporte:", error);
      res.status(500).json({
        error: "Error interno del servidor",
        details: error.message,
      });
    }
  }
}

export default ReportesController;
