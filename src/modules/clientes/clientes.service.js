import * as repo from "./clientes.repository.js";


export const getClientes = (req, res) => repo.obtenerClientes(res);
export const getClienteById = (req, res) => repo.obtenerClientePorId(req.params.id, res);
export const getClientesNaturales = (req, res) => repo.obtenerClientesNaturales(res);
export const getClientesJuridicos = (req, res) => repo.obtenerClientesJuridicos(res);
export const getTiposCliente = (req, res) => repo.obtenerTiposCliente(res);
export const crearCliente = (req, res) => repo.crearCliente(req.body, res);
export const updateCliente = (req, res) => repo.actualizarCliente(req.params.id, req.body, res);
export const eliminarCliente = (req, res) => repo.eliminarCliente(req.params.id, res);
export const getClientesFormateados = (req, res) => repo.obtenerClientesFormateados(res);
export const getClientesPorSede = (req, res) => repo.obtenerClientesPorSede(req.params.idSede, res);
