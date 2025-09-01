import nodemailer from "nodemailer";

// Configura para el servicio de Gmail
const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: "465",
  secure: true,
  auth: {
    user: "kpershopcimove@gmail.com",
    pass: "bpsv rvrd mzvm kmfs", // Contraseña de aplicación
  },
});

// Añade verificación de conexión
transporter.verify(function (error, success) {
  if (error) {
    console.log("❌ Error de conexión con servidor de correo:", error);
  } else {
    //console.log("✅ Servidor de correo listo para enviar mensajes");
  }
});


export async function enviarCorreoNotificacion(notificacion) {
  //console.log("📧 Entrando a enviarCorreoNotificacion...");
  //console.log("📦 Notificación recibida:", notificacion);

  const titulo =
    notificacion.titulo ||
    notificacion.nombre_notificacion ||
    notificacion.NOMBRE_NOTIFICACION ||
    "Sin título";

  const mensaje =
    notificacion.mensaje ||
    notificacion.descripcion_notificacion ||
    notificacion.DESCRIPCION_NOTIFICACION ||
    "Sin mensaje";

  const fecha =
    notificacion.fecha_creacion ||
    notificacion.fechainicio_notificacion ||
    notificacion.FECHAINICIO_NOTIFICACION ||
    new Date();

  //console.log("📝 Datos finales para el correo:", { titulo, mensaje, fecha });

  const info = await transporter.sendMail({
    from: '"Sistema de Notificaciones" <kpershopcimove@gmail.com>',
    to: "marioandresperez1@gmail.com",
    subject: `Nueva notificación: ${titulo}`,
    text: `
      📢 Notificación del sistema

      Mensaje: ${mensaje}
      Fecha de creación: ${fecha}
    `,
  });

  //console.log("✅ Correo enviado con éxito:", info.messageId);
  return info;
}