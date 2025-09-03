import axios from "axios";

class ReportesRepository {
  constructor() {
    this.baseURL = "http://localhost:4000";
  }

  formatDateForAPI(date) {
    if (!date) return null;
    return new Date(date).toISOString().split("T")[0];
  }
  // ------------------- Generales -------------------
  async getEstadisticasGenerales(fechaInicio, fechaFin) {
    try {
      const fechaInicioFormatted = this.formatDateForAPI(fechaInicio);
      const fechaFinFormatted = this.formatDateForAPI(fechaFin);

      // Rentabilidad total
      const rentabilidad = await axios.get(
        `${this.baseURL}/api/estadisticas/generales/rentabilidad?fechaInicio=${fechaInicioFormatted}&fechaFin=${fechaFinFormatted}`
      );

      // Evolución de rentabilidad por fecha
      const rentabilidadEvolucion = await axios.get(
        `${this.baseURL}/api/estadisticas/generales/rentabilidad-evolucion?fechaInicio=${fechaInicioFormatted}&fechaFin=${fechaFinFormatted}`
      );

      return {
        rentabilidad: rentabilidad.data,
        rentabilidadEvolucion: rentabilidadEvolucion.data,
      };
    } catch (error) {
      console.error(error);
      throw new Error(
        `Error obteniendo estadísticas generales: ${error.message}`
      );
    }
  }

  // ------------------- Ingresos -------------------
  async getEstadisticasIngresos(fechaInicio, fechaFin) {
    try {
      const fechaInicioFormatted = this.formatDateForAPI(fechaInicio);
      const fechaFinFormatted = this.formatDateForAPI(fechaFin);

      const [
        ventasDiaSemana,
        mapaCalor,
        ingresosPeriodo,
        ingresosCategoria,
        ingresosSede,
        metodoPago,
        metodoPagoSede,
      ] = await Promise.all([
        axios.get(
          `${this.baseURL}/api/estadisticas/ingresos/ventas-dia-semana?fechaInicio=${fechaInicioFormatted}&fechaFin=${fechaFinFormatted}`
        ),
        axios.get(
          `${this.baseURL}/api/estadisticas/ingresos/mapa-calor?fechaInicio=${fechaInicioFormatted}&fechaFin=${fechaFinFormatted}`
        ),
        axios.get(
          `${this.baseURL}/api/estadisticas/ingresos/ingresos-periodo?fechaInicio=${fechaInicioFormatted}&fechaFin=${fechaFinFormatted}`
        ),
        axios.get(
          `${this.baseURL}/api/estadisticas/ingresos/ingresos-categoria?fechaInicio=${fechaInicioFormatted}&fechaFin=${fechaFinFormatted}&limite=10`
        ),
        axios.get(
          `${this.baseURL}/api/estadisticas/ingresos/ventas-sede?fechaInicio=${fechaInicioFormatted}&fechaFin=${fechaFinFormatted}`
        ),
        axios.get(
          `${this.baseURL}/api/estadisticas/ingresos/ingresos-metodo-pago?fechaInicio=${fechaInicioFormatted}&fechaFin=${fechaFinFormatted}`
        ),
        axios.get(
          `${this.baseURL}/api/estadisticas/ingresos/ingresos-metodo-pago-sede?fechaInicio=${fechaInicioFormatted}&fechaFin=${fechaFinFormatted}`
        ),
      ]);

      return {
        ventasDiaSemana: ventasDiaSemana.data,
        mapaCalor: mapaCalor.data,
        ingresosPeriodo: ingresosPeriodo.data,
        ingresosCategoria: ingresosCategoria.data,
        ingresosSede: ingresosSede.data,
        metodoPago: metodoPago.data,
        metodoPagoSede: metodoPagoSede.data,
      };
    } catch (error) {
      console.error(error);
      throw new Error(
        `Error obteniendo estadísticas de ingresos: ${error.message}`
      );
    }
  }

  // ------------------- Egresos -------------------
  async getEstadisticasEgresos(fechaInicio, fechaFin) {
    try {
      const fechaInicioFormatted = this.formatDateForAPI(fechaInicio);
      const fechaFinFormatted = this.formatDateForAPI(fechaFin);

      const [egresos, principalesEgresos] = await Promise.all([
        axios.get(
          `${this.baseURL}/api/estadisticas/egresos/egresos?fechaInicio=${fechaInicioFormatted}&fechaFin=${fechaFinFormatted}`
        ),
        axios.get(
          `${this.baseURL}/api/estadisticas/egresos/principales-egresos?fechaInicio=${fechaInicioFormatted}&fechaFin=${fechaFinFormatted}&limite=10`
        ),
      ]);

      return {
        egresos: egresos.data,
        principalesEgresos: principalesEgresos.data,
      };
    } catch (error) {
      console.error(error);
      throw new Error(
        `Error obteniendo estadísticas de egresos: ${error.message}`
      );
    }
  }
  // ------------------- Productos -------------------
  async getEstadisticasProductos(
    fechaInicio,
    fechaFin,
    limite = 10,
    idProducto = null,
    idSede = null
  ) {
    try {
      const fechaInicioFormatted = this.formatDateForAPI(fechaInicio);
      const fechaFinFormatted = this.formatDateForAPI(fechaFin);

      // Llamadas a los endpoints
      const bajoStock = await axios.get(
        `${this.baseURL}/api/estadisticas/productos/bajo-stock?limite=20`
      );

      const historicoVentasProducto = idProducto
        ? await axios.get(
            `${this.baseURL}/api/estadisticas/productos/historico-ventas-producto?idProducto=${idProducto}&fechaInicio=${fechaInicioFormatted}&fechaFin=${fechaFinFormatted}`
          )
        : { data: [] }; // si no hay idProducto, devolvemos array vacío

      const masVendidos = await axios.get(
        `${this.baseURL}/api/estadisticas/productos/mas-vendidos?fechaInicio=${fechaInicioFormatted}&fechaFin=${fechaFinFormatted}&ordenarPor=unidades&limite=${limite}`
      );

      const masVendidosSede = idSede
        ? await axios.get(
            `${this.baseURL}/api/estadisticas/productos/mas-vendidos-sede?fechaInicio=${fechaInicioFormatted}&fechaFin=${fechaFinFormatted}&idSede=${idSede}&limite=${limite}`
          )
        : { data: [] }; // si no hay idSede, devolvemos array vacío

      return {
        bajoStock: bajoStock.data,
        historicoVentasProducto: historicoVentasProducto.data,
        masVendidos: masVendidos.data,
        masVendidosSede: masVendidosSede.data,
      };
    } catch (error) {
      console.error(error);
      throw new Error(
        `Error obteniendo estadísticas de productos: ${error.message}`
      );
    }
  }

  // ------------------- Clientes -------------------
  async getEstadisticasClientes(fechaInicio, fechaFin) {
    try {
      const fechaInicioFormatted = this.formatDateForAPI(fechaInicio);
      const fechaFinFormatted = this.formatDateForAPI(fechaFin);

      const [clientesActivos, mejoresClientes, clientesPorSede] =
        await Promise.all([
          axios.get(
            `${this.baseURL}/api/estadisticas/clientes/clientes-activos?fechaInicio=${fechaInicioFormatted}&fechaFin=${fechaFinFormatted}`
          ),
          axios.get(
            `${this.baseURL}/api/estadisticas/clientes/mejores-clientes?fechaInicio=${fechaInicioFormatted}&fechaFin=${fechaFinFormatted}&limite=10`
          ),
          axios.get(
            `${this.baseURL}/api/estadisticas/clientes/clientes-por-sede`
          ),
        ]);

      return {
        clientesActivos: clientesActivos.data,
        mejoresClientes: mejoresClientes.data,
        clientesPorSede: clientesPorSede.data,
      };
    } catch (error) {
      console.error(error);
      throw new Error(
        `Error obteniendo estadísticas de clientes: ${error.message}`
      );
    }
  }
}

export default ReportesRepository;
