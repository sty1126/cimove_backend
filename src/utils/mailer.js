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
    to: 'kpershopcimove@gmail.com',
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

const BASE_URL = "https://cimove-frontend.onrender.com/api";
//const BASE_URL = "http://localhost:3000";
export const sendPasswordResetEmail = async (email, token) => {
  const ResetPassword = `${BASE_URL}/reset-password?token=${token}`; //Si es para probar local no agregar otro /api

  const mailOptions = {
    from: '"Restablecer contraseña - CIMOVE" <kpershopcimove@gmail.com>',
    to: email,
    subject: "Restablecimiento de Contraseña",
    html: `
      <h2>Restablecimiento de Contraseña</h2>
      <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
      <a href="${ResetPassword}">Restablecer Contraseña</a>
      <p>Este enlace expirará en una hora.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};
