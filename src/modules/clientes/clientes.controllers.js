import * as service from "./clientes.service.js";

export const getClientesController = (req, res) => service.getClientes(req, res);
export const getClienteByIdController = (req, res) => service.getClienteById(req, res);
export const getClientesNaturalesController = (req, res) => service.getClientesNaturales(req, res);
export const getClientesJuridicosController = (req, res) => service.getClientesJuridicos(req, res);
export const getTiposClienteController = (req, res) => service.getTiposCliente(req, res);
export const crearClienteController = (req, res) => service.crearCliente(req, res);
export const updateClienteController = (req, res) => service.updateCliente(req, res);
export const eliminarClienteController = (req, res) => service.eliminarCliente(req, res);
export const getClientesFormateadosController = (req, res) => service.getClientesFormateados(req, res);
export const getClientesPorSedeController = (req, res) => service.getClientesPorSede(req, res);
