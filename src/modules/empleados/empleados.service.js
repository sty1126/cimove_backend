import * as repo from "./empleados.repository.js";

export const getEmpleadosConUsuario = (req, res) => repo.obtenerEmpleadosConUsuario(res);
export const crearEmpleado = (req, res) => repo.crearEmpleado(req.body, res);
export const getEmpleadoPorId = (req, res) => repo.obtenerEmpleadoPorId(req.params.id, res);
export const eliminarEmpleado = (req, res) => repo.eliminarEmpleado(req.params.id, res);
export const restaurarEmpleado = (req, res) => repo.restaurarEmpleado(req.params.id, res);
export const actualizarEmpleado = (req, res) => repo.actualizarEmpleado(req.params.id, req.body, res);
