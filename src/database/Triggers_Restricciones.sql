
-- 1) Trigger para guardar el cambio del precio de venta
-- Creación
CREATE OR REPLACE FUNCTION actualizar_precio_anterior()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo actualizar si el precio de venta actual cambia
  IF OLD.precioventaact_producto <> NEW.precioventaact_producto THEN
    NEW.precioventaant_producto = OLD.precioventaact_producto;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER trigger_actualizar_precio_anterior
BEFORE UPDATE ON producto
FOR EACH ROW
EXECUTE FUNCTION actualizar_precio_anterior();


-- 2) Trigger para calcular la margen de utilidad de un producto ingresado
-- Creación
CREATE OR REPLACE FUNCTION actualizar_margen_utilidad()
RETURNS TRIGGER AS $$
BEGIN
  NEW.margenutilidad_producto := NEW.precioventaact_producto - NEW.costoventa_producto;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER trg_actualizar_margen
BEFORE INSERT OR UPDATE ON producto
FOR EACH ROW
EXECUTE FUNCTION actualizar_margen_utilidad();


-- 3) Restricción para la tabla Inventario Local
ALTER TABLE INVENTARIOLOCAL ADD CONSTRAINT inventariolocal_unique UNIQUE (ID_PRODUCTO_INVENTARIOLOCAL, ID_SEDE_INVENTARIOLOCAL);


-- 4) Trigger para actualizar el stock del inventario general
-- Creación
CREATE OR REPLACE FUNCTION actualizar_inventario()
RETURNS TRIGGER AS $$
BEGIN
    -- Verificar si el producto ya existe en el inventario general
    IF EXISTS (SELECT 1 FROM INVENTARIO WHERE ID_PRODUCTO_INVENTARIO = NEW.ID_PRODUCTO_INVENTARIOLOCAL) THEN
        -- Si existe, actualizar la cantidad sumando las existencias en todas las sedes
        UPDATE INVENTARIO
        SET EXISTENCIA_INVENTARIO = (
            SELECT COALESCE(SUM(EXISTENCIA_INVENTARIOLOCAL), 0)
            FROM INVENTARIOLOCAL
            WHERE ID_PRODUCTO_INVENTARIOLOCAL = NEW.ID_PRODUCTO_INVENTARIOLOCAL
        )
        WHERE ID_PRODUCTO_INVENTARIO = NEW.ID_PRODUCTO_INVENTARIOLOCAL;
    ELSE
        -- Si no existe, crearlo con la cantidad actual de la sede
        INSERT INTO INVENTARIO (ID_PRODUCTO_INVENTARIO, EXISTENCIA_INVENTARIO)
        VALUES (NEW.ID_PRODUCTO_INVENTARIOLOCAL, NEW.EXISTENCIA_INVENTARIOLOCAL);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER trigger_actualizar_inventario
AFTER INSERT OR UPDATE OR DELETE ON INVENTARIOLOCAL
FOR EACH ROW
EXECUTE FUNCTION actualizar_inventario();
