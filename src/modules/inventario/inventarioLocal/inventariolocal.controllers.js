import * as service from "./inventarioLocal.service.js";

export const getInventarioLocal = (req, res) =>
  service.getInventarioLocal(req, res);
export const getInventarioLocalBySede = (req, res) =>
  service.getInventarioLocalBySede(req, res);
export const createInventarioLocal = (req, res) =>
  service.createInventarioLocal(req, res);
export const updateInventarioLocal = (req, res) =>
  service.updateInventarioLocal(req, res);
export const addStockToSede = (req, res) => service.addStockToSede(req, res);
export const existeEnInventarioLocal = (req, res) =>
  service.existeEnInventarioLocal(req, res);
export const getInventarioLocalEstado = (req, res) =>
  service.getInventarioLocalEstado(req, res);
export const getInventarioLocalEstadoBySede = (req, res) =>
  service.getInventarioLocalEstadoBySede(req, res);
