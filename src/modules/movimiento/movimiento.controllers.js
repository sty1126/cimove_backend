import * as moviservice from "./movimiento.service.js";

export const getMovimientos = (req, res) => moviservice.getMovimientos(req, res);
export const getTipoMovimientos = (req, res) => moviservice.getTipoMovimientos(req, res);
export const createMovimiento = (req, res) => moviservice.createMovimiento(req, res);
