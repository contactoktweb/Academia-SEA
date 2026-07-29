interface PlacementTestEmailParams {
  name: string;
  ageCategory: string;
  email?: string;
  phone?: string;
  sede: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  level: string;
  description: string;
  submittedAt: string;
}

export function generatePlacementTestEmailHtml(params: PlacementTestEmailParams): string {
  const {
    name,
    ageCategory,
    email = "No proporcionado",
    phone = "No proporcionado",
    sede,
    score,
    totalQuestions,
    percentage,
    level,
    description,
    submittedAt,
  } = params;

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Nuevo Examen de Ubicación - Academia SEA</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f1f5f9; color: #1e293b; -webkit-font-smoothing: antialiased;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#f1f5f9" style="padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="600" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          
          <!-- Header -->
          <tr>
            <td bgcolor="#0284c7" align="center" style="padding: 35px 30px; background: linear-gradient(135deg, #0284c7 0%, #0369a1 100%);">
              <h1 style="color: #ffffff; margin: 0; font-size: 26px; font-weight: 800; letter-spacing: -0.5px;">Academia SEA</h1>
              <p style="color: #e0f2fe; margin: 8px 0 0 0; font-size: 14px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                Alerta de Examen de Ubicación
              </p>
            </td>
          </tr>

          <!-- Banner Status -->
          <tr>
            <td style="padding: 24px 30px 10px 30px;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f0f9ff; border: 1px solid #bae6fd; border-radius: 12px; padding: 16px;">
                <tr>
                  <td>
                    <span style="font-size: 12px; font-weight: 800; color: #0284c7; text-transform: uppercase; tracking: 1px;">Nuevo Aspirante Registrado</span>
                    <h2 style="margin: 4px 0 0 0; font-size: 20px; color: #0c4a6e; font-weight: 800;">${name}</h2>
                    <p style="margin: 4px 0 0 0; font-size: 13px; color: #0369a1;">Realizado el: <strong>${submittedAt}</strong></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content Body -->
          <tr>
            <td style="padding: 20px 30px 30px 30px;">
              
              <!-- Result Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0f172a; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px; color: #ffffff;">
                <tr>
                  <td>
                    <span style="font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 1.5px; color: #94a3b8; display: block; margin-bottom: 6px;">Nivel Diagnóstico Asignado</span>
                    <div style="font-size: 36px; font-weight: 900; color: #38bdf8; letter-spacing: -0.5px; margin-bottom: 4px;">${level}</div>
                    <p style="margin: 0; font-size: 14px; color: #cbd5e1; font-weight: 600;">
                      Aciertos: <strong style="color: #ffffff;">${score} / ${totalQuestions}</strong> &bull; Porcentaje: <strong style="color: #38bdf8;">${Math.round(percentage)}%</strong>
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Candidate Info Table -->
              <h3 style="font-size: 15px; font-weight: 700; color: #334155; margin: 0 0 12px 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 6px;">
                📋 Datos del Aspirante
              </h3>
              
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 24px;">
                <tr>
                  <td width="40%" style="padding: 8px 0; font-size: 13px; color: #64748b; font-weight: 600;">Nombre Completo:</td>
                  <td width="60%" style="padding: 8px 0; font-size: 14px; color: #0f172a; font-weight: 700;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #64748b; font-weight: 600;">Edad / Categoría:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #0f172a; font-weight: 600;">${ageCategory}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #64748b; font-weight: 600;">Sede de Interés:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #0284c7; font-weight: 700;">${sede}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #64748b; font-weight: 600;">Correo Electrónico:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #0f172a;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; color: #64748b; font-weight: 600;">Teléfono / WhatsApp:</td>
                  <td style="padding: 8px 0; font-size: 14px; color: #0f172a;">${phone}</td>
                </tr>
              </table>

              <!-- Diagnosis Box -->
              <h3 style="font-size: 15px; font-weight: 700; color: #334155; margin: 0 0 12px 0; border-bottom: 2px solid #f1f5f9; padding-bottom: 6px;">
                💡 Observaciones y Recomendaciones
              </h3>
              <div style="background-color: #f8fafc; border-left: 4px solid #0284c7; padding: 14px 16px; border-radius: 8px; font-size: 13px; color: #334155; font-style: italic; line-height: 1.5; margin-bottom: 24px;">
                "${description}"
              </div>

              <!-- Button CTA -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td align="center">
                    <a href="https://www.academiasea.mx/admin" target="_blank" style="display: inline-block; background-color: #0284c7; color: #ffffff; text-decoration: none; font-size: 14px; font-weight: 700; padding: 14px 28px; border-radius: 12px; box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);">
                      Ver Registros en Sanity Studio &rarr;
                    </a>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding: 24px 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0;">
              <p style="color: #94a3b8; font-size: 12px; line-height: 1.5; margin: 0;">
                Sistema Automático de Notificaciones &bull; Academia SEA<br>
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
