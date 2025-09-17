import { MailerSend, EmailParams, Sender, Recipient } from "mailersend";

// Configura para el servicio
const mailerSend = new MailerSend({
  apiKey: "mlsn.21dca94af3f83ea5ee9a2b7a709ed822a3a80a3285b2a36c846987037997f8be" // 🔑 API Key
});

const sentFrom = new Sender("MS_XzTat2@test-p7kx4xwvw22g9yjr.mlsender.net", "CIMOVE - Notificaciones");


export async function enviarCorreoNotificacion(notificacion) {
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

  const recipients = [
    new Recipient("kpershopcimove@gmail.com", "Usuario destino"), 
  ];

  const emailParams = new EmailParams()
    .setFrom(sentFrom)
    .setTo(recipients)
    .setSubject(`CIMOVE - Nueva notificación: ${titulo}`)
    .setHtml(`
      <h3>📢 Notificación del sistema</h3>
      <p><b>Mensaje:</b> ${mensaje}</p>
      <p><b>Fecha de creación:</b> ${fecha}</p>
    `)
    .setText(`
      📢 Notificación del sistema

      Mensaje: ${mensaje}
      Fecha de creación: ${fecha}
    `);

  return await mailerSend.email.send(emailParams);
}
const BASE_URL = "https://cimove-frontend.onrender.com/api";
//const BASE_URL = "http://localhost:3000"; //Si es para probar en local se quita el /api únicamente para esta ruta.
export const sendPasswordResetEmail = async (email, token) => {
  const resetPasswordUrl = `${BASE_URL}/reset-password?token=${token}`;

  const recipients = [new Recipient(email, "Usuario")];

  const emailParams = new EmailParams()
    .setFrom(new Sender("MS_XzTat2@test-p7kx4xwvw22g9yjr.mlsender.net", "CIMOVE - Soporte"))
    .setTo(recipients)
    .setSubject("Restablecimiento de Contraseña")
    .setHtml(`
      <h2>Restablecimiento de Contraseña</h2>
      <p>Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace para continuar:</p>
      <a href="${resetPasswordUrl}">Restablecer Contraseña</a>
      <p>Este enlace expirará en una hora.</p>
    `)
    .setText(`
      Restablecimiento de Contraseña

      Has solicitado restablecer tu contraseña.
      Enlace: ${resetPasswordUrl}
      Este enlace expirará en una hora.
    `);

  return await mailerSend.email.send(emailParams);
};