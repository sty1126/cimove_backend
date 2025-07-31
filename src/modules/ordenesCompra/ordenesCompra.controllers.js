import { OrdenesCompraService } from "./ordenesCompra.service.js";

export const getOrdenesCompra = async (req, res) => {
  try {
    const data = await OrdenesCompraService.listarOrdenes();
    res.json(data);
  } catch (error) {
    console.error("Error al obtener órdenes:", error);
    res.status(500).json({ error: "Error al obtener órdenes" });
  }
};

export const createOrdenCompra = async (req, res) => {
  try {
    const nuevaOrden = await OrdenesCompraService.crearOrden(req.body);
    res.status(201).json(nuevaOrden);
  } catch (error) {
    console.error("Error al crear orden:", error);
    res.status(500).json({ error: "Error al crear orden" });
  }
};

export const getOrdenCompraById = async (req, res) => {
  try {
    const orden = await OrdenesCompraService.obtenerOrdenPorId(req.params.id);
    if (!orden) return res.status(404).json({ error: "Orden no encontrada" });
    res.json(orden);
  } catch (error) {
    console.error("Error al obtener orden:", error);
    res.status(500).json({ error: "Error al obtener orden" });
  }
};

export const procesarPedidoCarrito = async (req, res) => {
  try {
    const resultado = await OrdenesCompraService.procesarPedido(req.body.productos);
    res.status(201).json(resultado);
  } catch (error) {
    console.error("Error al procesar pedido:", error);
    res.status(500).json({ error: "Error al procesar pedido" });
  }
};
