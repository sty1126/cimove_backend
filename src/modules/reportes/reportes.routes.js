import express from "express";
import ReportesController from "./reportes.controller.js";

class ReportesRoutes {
  constructor() {
    this.router = express.Router();
    this.reportesController = new ReportesController();
    this.initializeRoutes();
  }

  initializeRoutes() {
    // Generar PDF
    this.router.post(
      "/pdf",
      this.reportesController.generarReportePDF.bind(this.reportesController)
    );

    // Obtener estado del reporte
    this.router.get(
      "/estado",
      this.reportesController.obtenerEstadoReporte.bind(this.reportesController)
    );

    // Manejo de errores
    this.router.use((error, req, res, next) => {
      console.error("Error en rutas de reportes:", error);
      res.status(500).json({
        error: "Error en el servicio de reportes",
        details: error.message,
        timestamp: new Date().toISOString(),
      });
    });
  }

  getRouter() {
    return this.router;
  }
}

export default new ReportesRoutes().getRouter();
