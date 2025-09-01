import { enviarCorreoNotificacion } from '../utils/mailer.js';

async function testEmail() {
  console.log("🧪 Probando envío de correo...");
  
  const testData = {
    titulo: "PRUEBA - Notificación del Sistema",
    mensaje: "Este es un correo de prueba para verificar la configuración",
    fecha_creacion: new Date()
  };

  try {
    const result = await enviarCorreoNotificacion(testData);
    console.log("🎉 ¡PRUEBA EXITOSA! Correo enviado:");
    console.log("Message ID:", result.messageId);
  } catch (error) {
    console.error("💥 PRUEBA FALLIDA:");
    console.error("Error:", error.message);
    
    // Errores comunes de Gmail:
    if (error.code === 'EAUTH') {
      console.log("\n🔒 Problema de autenticación:");
      console.log("1. Verifica que tengas verificación en 2 pasos ACTIVADA");
      console.log("2. Genera una CONTRASEÑA DE APLICACIÓN específica");
      console.log("3. No uses tu contraseña normal de Gmail");
    }
  }
}

testEmail();