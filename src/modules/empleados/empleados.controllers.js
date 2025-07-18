import * as service from "./empleados.service.js";

export const getEmpleadosConUsuarioController = (req, res) => service.getEmpleadosConUsuario(req, res);
export const crearEmpleadoController = (req, res) => service.crearEmpleado(req, res);
export const getEmpleadoPorIdController = (req, res) => service.getEmpleadoPorId(req, res);
export const eliminarEmpleadoController = (req, res) => service.eliminarEmpleado(req, res);
export const restaurarEmpleadoController = (req, res) => service.restaurarEmpleado(req, res);
export const actualizarEmpleadoController = (req, res) => service.actualizarEmpleado(req, res);
