interface AdminLeadNotificationParams {
  fullName: string;
  email: string;
  phone: string;
  phoneType: string;
  country: string;
  state?: string;
  target: string;
  ageRange: string;
  submittedAt: string;
  source?: string;
}

export function generateAdminLeadNotificationEmailHtml(params: AdminLeadNotificationParams): string {
  const {
    fullName,
    email,
    phone,
    phoneType,
    country,
    state,
    target,
    ageRange,
    submittedAt,
    source = "Hero Principal Web (/)",
  } = params;

  const cleanPhone = phone ? phone.replace(/[^0-9+]/g, "") : "";
  const whatsappUrl = cleanPhone
    ? `https://wa.me/${cleanPhone.replace("+", "")}?text=${encodeURIComponent(`Hola ${fullName}, te contactamos de Academia SEA respecto a tu registro para el curso de inglés (${target}).`)}`
    : "";

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo Prospecto Web - Academia SEA</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Roboto, -apple-system, BlinkMacSystemFont, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #1e293b; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f1f5f9" style="padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="620" border="0" cellspacing="0" cellpadding="0" style="max-width: 620px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 12px 30px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td bgcolor="#ff6600" align="center" style="padding: 34px 30px; background: linear-gradient(135deg, #ff6600 0%, #e65500 100%);">
              <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Academia SEA</h1>
              <p style="color: #ffedd5; margin: 6px 0 0 0; font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px;">
                🚀 Nuevo Prospecto / Lead Registrado
              </p>
            </td>
          </tr>

          <!-- Status Card -->
          <tr>
            <td style="padding: 24px 30px 10px 30px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fff7ed; border: 1px solid #fed7aa; border-radius: 14px; padding: 16px 20px;">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: #ffedd5; color: #c2410c; font-size: 11px; font-weight: 800; padding: 3px 8px; border-radius: 6px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">
                      Interesado en Promoción 2026
                    </span>
                    <h2 style="margin: 4px 0 0 0; font-size: 20px; color: #7c2d12; font-weight: 800;">${fullName}</h2>
                    <p style="margin: 4px 0 0 0; font-size: 13px; color: #9a3412;">Registrado el: <strong>${submittedAt}</strong></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Lead Details Table -->
          <tr>
            <td style="padding: 15px 30px 20px 30px;">
              <h3 style="font-size: 14px; font-weight: 800; color: #334155; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 2px solid #f1f5f9; padding-bottom: 8px;">
                📋 Información del Prospecto
              </h3>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 18px;">
                <tr>
                  <td width="38%" style="padding: 8px 0; font-size: 13px; color: #64748b; font-weight: 600;">Nombre Completo:</td>
                  <td width="62%" style="padding: 8px 0; font-size: 14px; color: #0f172a; font-weight: 700;">${fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #64748b; font-weight: 600;">Correo Electrónico:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #0066cc; font-weight: 600;">
                    <a href="mailto:${email}" style="color: #0066cc; text-decoration: none;">${email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #64748b; font-weight: 600;">Teléfono (${phoneType}):</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #0f172a; font-weight: 700;">
                    <a href="tel:${phone}" style="color: #0f172a; text-decoration: none;">${phone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #64748b; font-weight: 600;">Interés / Para quién:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #ea580c; font-weight: 700;">${target}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #64748b; font-weight: 600;">Rango de Edad:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #0f172a; font-weight: 600;">${ageRange}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #64748b; font-weight: 600;">Ubicación:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #0f172a;">${country}${state ? `, ${state}` : ""}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #64748b; font-weight: 600;">Origen:</td>
                  <td style="padding: 8px 0; font-size: 12px; color: #64748b;">${source}</td>
                </tr>
              </table>

              <!-- Action CTAs -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-top: 20px;">
                <tr>
                  ${whatsappUrl ? `
                  <td align="center" style="padding: 6px;">
                    <a href="${whatsappUrl}" target="_blank" style="display: inline-block; width: 85%; max-width: 240px; background-color: #25d366; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 12px 18px; border-radius: 10px; text-align: center; box-shadow: 0 4px 10px rgba(37, 211, 102, 0.25);">
                      💬 Contactar por WhatsApp
                    </a>
                  </td>
                  ` : ''}
                  <td align="center" style="padding: 6px;">
                    <a href="https://www.academiasea.mx/dashboard/contactos" target="_blank" style="display: inline-block; width: 85%; max-width: 240px; background-color: #ff6600; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 700; padding: 12px 18px; border-radius: 10px; text-align: center; box-shadow: 0 4px 10px rgba(255, 102, 0, 0.25);">
                      📊 Ver en Dashboard
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 24px 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
              <p style="color: #64748b; font-size: 12px; font-weight: 600; margin: 0 0 4px 0;">
                Sistema de Notificaciones Automáticas &bull; Academia SEA
              </p>
              <p style="color: #94a3b8; font-size: 11px; line-height: 1.5; margin: 0;">
                &copy; ${new Date().getFullYear()} Academia SEA. Todos los derechos reservados.<br>
                <a href="https://www.kytcode.lat" target="_blank" style="color: #64748b; text-decoration: none; font-weight: 600;">
                  Desarrollado por K&T <span style="color: #0f172a;">&#9829;</span>
                </a>
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
