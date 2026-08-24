interface ContactConfirmationParams {
  fullName: string;
  email: string;
  phone: string;
  sedeInteres: string;
  subject: string;
  message: string;
  submittedAt: string;
}

export function generateContactConfirmationEmailHtml(params: ContactConfirmationParams): string {
  const {
    fullName,
    sedeInteres,
    subject,
    message,
    submittedAt,
  } = params;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>¡Hemos recibido tu mensaje! - Academia SEA</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Roboto, -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f8fafc" style="padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e2e8f0;">
          
          <!-- Header -->
          <tr>
            <td bgcolor="#0066cc" align="center" style="padding: 36px 30px; background: linear-gradient(135deg, #0066cc 0%, #004c99 100%);">
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">Academia SEA</h1>
              <p style="color: #bfdbfe; margin: 6px 0 0 0; font-size: 14px; font-weight: 600; letter-spacing: 0.5px;">
                ¡Gracias por ponerte en contacto con nosotros!
              </p>
            </td>
          </tr>

          <!-- Main Greeting -->
          <tr>
            <td style="padding: 30px 30px 10px 30px;">
              <h2 style="margin: 0 0 12px 0; font-size: 20px; color: #0f172a; font-weight: 800;">
                Hola, ${fullName} 👋
              </h2>
              <p style="margin: 0; font-size: 15px; color: #475569; line-height: 1.6;">
                Hemos recibido tu mensaje correctamente a través de nuestro sitio web. Queremos confirmarte que tu solicitud ya fue canalizada a nuestro equipo de atención y <strong>muy pronto un asesor académico de Academia SEA se pondrá en contacto contigo</strong> para resolver todas tus dudas y darte una atención personalizada.
              </p>
            </td>
          </tr>

          <!-- Summary Box -->
          <tr>
            <td style="padding: 20px 30px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; border-radius: 14px; padding: 20px; border: 1px solid #e2e8f0;">
                <tr>
                  <td>
                    <span style="font-size: 11px; font-weight: 800; color: #0066cc; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 12px;">
                      📋 Resumen de tu Consulta
                    </span>
                    <table width="100%" border="0" cellspacing="0" cellpadding="0">
                      <tr>
                        <td width="38%" style="padding: 5px 0; font-size: 13px; color: #64748b; font-weight: 600;">Motivo / Asunto:</td>
                        <td width="62%" style="padding: 5px 0; font-size: 13px; color: #0f172a; font-weight: 700;">${subject}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; font-size: 13px; color: #64748b; font-weight: 600;">Sede de Interés:</td>
                        <td style="padding: 5px 0; font-size: 13px; color: #0066cc; font-weight: 700;">${sedeInteres}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; font-size: 13px; color: #64748b; font-weight: 600;">Fecha de Envío:</td>
                        <td style="padding: 5px 0; font-size: 13px; color: #0f172a;">${submittedAt}</td>
                      </tr>
                      ${message ? `
                      <tr>
                        <td colspan="2" style="padding-top: 10px;">
                          <span style="font-size: 12px; color: #64748b; font-weight: 600; display: block; margin-bottom: 4px;">Tu mensaje:</span>
                          <div style="background-color: #ffffff; padding: 10px 14px; border-radius: 8px; font-size: 13px; color: #334155; border: 1px solid #e2e8f0; font-style: italic;">
                            "${message}"
                          </div>
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Immediate Help Card -->
          <tr>
            <td style="padding: 0 30px 25px 30px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 14px; padding: 18px;">
                <tr>
                  <td>
                    <h3 style="margin: 0 0 6px 0; font-size: 14px; color: #1e40af; font-weight: 700;">
                      ¿Necesitas atención inmediata?
                    </h3>
                    <p style="margin: 0 0 12px 0; font-size: 13px; color: #1e3a8a; line-height: 1.5;">
                      Si prefieres comunicarte directamente con nosotros vía WhatsApp, puedes escribirnos ahora mismo:
                    </p>
                    <a href="https://wa.me/523171035100?text=Hola,%20acabo%20de%20enviar%20un%20formulario%20de%20contacto%20y%20me%20gustar%C3%ADa%20atenci%C3%B3n%20r%C3%A1pida." target="_blank" style="display: inline-block; background-color: #25d366; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 10px 20px; border-radius: 10px; box-shadow: 0 2px 8px rgba(37, 211, 102, 0.3);">
                      💬 Escribir por WhatsApp
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 24px 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 13px; font-weight: 600; margin: 0 0 4px 0;">
                Academia SEA &bull; Sistema de Enseñanza y Aprendizaje
              </p>
              <p style="color: #94a3b8; font-size: 11px; line-height: 1.5; margin: 0;">
                Autlán de Navarro &bull; El Grullo &bull; Unión de Tula &bull; En Línea<br>
                Desarrollado por K&T ❤️
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
