import { pool } from '../db.js';
import assert from 'assert';

async function testDatabaseConnection() {
  try {
    const result = await pool.query('SELECT NOW()');
    
    //Verificar al menos una fila existente
    assert.ok(result.rows.length > 0, 'No se recibió ninguna fila de la base de datos');

    console.log('✅ Prueba de conexión a la base de datos exitosa:', result.rows[0].now);
  } catch (error) {
    console.error('❌ Error al conectar con la base de datos o al ejecutar la consulta:', error);
    process.exit(1); 
  } finally {
    await pool.end(); // Cierra la conexión
  }
}

testDatabaseConnection();
