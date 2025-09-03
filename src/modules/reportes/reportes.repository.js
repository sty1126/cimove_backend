import axios from "axios"

const API_BASE = "http://localhost:4000/api/estadisticas"

// Productos
export const fetchProductosMasVendidos = (fechaInicio, fechaFin, ordenarPor, limite = 10) =>
  axios.get(`${API_BASE}/productos/mas-vendidos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&ordenarPor=${ordenarPor}&limite=${limite}`)
    .then(res => res.data)

export const fetchProductosBajoStock = (limite = 20) =>
  axios.get(`${API_BASE}/productos/bajo-stock?limite=${limite}`)
    .then(res => res.data)

// Clientes
export const fetchClientesActivos = (fechaInicio, fechaFin, tipoPeriodo) =>
  axios.get(`${API_BASE}/clientes/activos-por-periodo?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&tipoPeriodo=${tipoPeriodo}`)
    .then(res => res.data)

export const fetchMejoresClientes = (fechaInicio, fechaFin, limite = 10) =>
  axios.get(`${API_BASE}/clientes/mejores?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&limite=${limite}`)
    .then(res => res.data)

export const fetchTicketPromedioClientes = (fechaInicio, fechaFin, tipoPeriodo) =>
  axios.get(`${API_BASE}/clientes/ticket-promedio?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&tipoPeriodo=${tipoPeriodo}`)
    .then(res => res.data)

export const fetchSegmentacionClientes = (fechaInicio, fechaFin) =>
  axios.get(`${API_BASE}/clientes/segmentacion?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
    .then(res => res.data)

export const fetchDashboardClientes = (fechaInicio, fechaFin, tipoPeriodo) =>
  axios.get(`${API_BASE}/dashboard-clientes?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&tipoPeriodo=${tipoPeriodo}`)
    .then(res => res.data)

// Finanzas
export const fetchIngresos = (fechaInicio, fechaFin) =>
  axios.get(`${API_BASE}/ingresos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
    .then(res => res.data)

export const fetchEgresos = (fechaInicio, fechaFin) =>
  axios.get(`${API_BASE}/egresos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
    .then(res => res.data)

export const fetchDashboardFinanzas = (fechaInicio, fechaFin) =>
  axios.get(`${API_BASE}/dashboard-finanzas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`)
    .then(res => res.data)
