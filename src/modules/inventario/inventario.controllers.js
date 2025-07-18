import * as service from './inventario.service.js';

export const getInventario = (req, res) => service.getInventario(req, res);
export const getInventarioById = (req, res) => service.getInventarioById(req, res);
export const createInventario = (req, res) => service.createInventario(req, res);
export const updateInventario = (req, res) => service.updateInventario(req, res);
