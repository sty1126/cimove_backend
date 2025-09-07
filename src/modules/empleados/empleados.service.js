import * as repo from "./empleados.repository.js";

export const getEmpleadosConUsuario = async (req, res) => {
    try {
        const empleados = await repo.obtenerEmpleadosConUsuario();
        res.status(200).json(empleados);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const crearEmpleado = async (req, res) => {
    try {
        const result = await repo.crearEmpleado(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getEmpleadoPorId = async (req, res) => {
    try {
        const empleado = await repo.obtenerEmpleadoPorId(req.params.id);
        res.status(200).json(empleado);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const eliminarEmpleado = async (req, res) => {
    try {
        await repo.eliminarEmpleado(req.params.id);
        res.status(200).json({ message: "Empleado eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const restaurarEmpleado = async (req, res) => {
    try {
        await repo.restaurarEmpleado(req.params.id);
        res.status(200).json({ message: "Empleado restaurado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const actualizarEmpleado = async (req, res) => {
    try {
        await repo.actualizarEmpleado(req.params.id, req.body);
        res.status(200).json({ message: "Empleado actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};