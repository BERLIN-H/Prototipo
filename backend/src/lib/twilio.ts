/**
 * twilio.ts
 * Helper centralizado para enviar mensajes WhatsApp via Twilio.
 * En sandbox usa ContentSid (template). En producción usa body libre.
 */

let _client: any = null;

async function getClient(): Promise<any | null> {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  if (!accountSid || !authToken) return null;
  if (!_client) {
    const twilio = await import('twilio');
    _client = twilio.default(accountSid, authToken);
  }
  return _client;
}

const FROM = () => process.env.TWILIO_WHATSAPP_NUMBER ?? 'whatsapp:+14155238886';

// El ContentSid del sandbox de Twilio (template de recordatorio)
const SANDBOX_CONTENT_SID = process.env.TWILIO_CONTENT_SID ?? 'HXb5b62575e6e4ff6129ad7c8efe1f983e';
const IS_SANDBOX = !process.env.TWILIO_PRODUCTION; // false solo si tienes número de producción

function formatDate(date: Date) {
  return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
}
function formatTime(date: Date) {
  return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
}

async function sendMessage(to: string, body: string, date?: Date): Promise<void> {
  const client = await getClient();
  if (!client) {
    console.log(`[Twilio] Sin credenciales — simulando mensaje para: ${to}`);
    console.log(`[Twilio] ${body}`);
    return;
  }
  try {
    let params: any;
    if (IS_SANDBOX && date) {
      // Sandbox: usar template con fecha y hora
      params = {
        from: FROM(),
        to: `whatsapp:${to}`,
        contentSid: SANDBOX_CONTENT_SID,
        contentVariables: JSON.stringify({
          '1': formatDate(date),
          '2': formatTime(date),
        }),
      };
    } else {
      // Producción: mensaje libre
      params = { from: FROM(), to: `whatsapp:${to}`, body };
    }
    const msg = await client.messages.create(params);
    console.log(`[Twilio] Mensaje enviado a ${to} — SID: ${msg.sid}`);
  } catch (err) {
    console.error('[Twilio] Error enviando mensaje:', err);
  }
}

// ── Confirmación al agendar ───────────────────────────────────────────────────
export async function sendAppointmentConfirmation(opts: {
  to: string;
  studentName: string;
  date: Date;
  professionalName: string;
  appointmentType?: string;
}): Promise<void> {
  const body =
    `✅ *Cita Agendada — Equilibria*\n\n` +
    `Hola ${opts.studentName}, tu cita ha sido registrada.\n\n` +
    `📅 *Fecha:* ${formatDate(opts.date)}\n` +
    `🕐 *Hora:* ${formatTime(opts.date)}\n` +
    `👨‍⚕️ *Psicólogo/a:* ${opts.professionalName}\n` +
    (opts.appointmentType ? `📋 *Tipo:* ${opts.appointmentType}\n` : '') +
    `\n_Si necesitas cancelar, hazlo desde la plataforma Equilibria._`;
  await sendMessage(opts.to, body, opts.date);
}

// ── Recordatorio 24h antes ────────────────────────────────────────────────────
export async function sendAppointmentReminder(opts: {
  to: string;
  studentName: string;
  date: Date;
  professionalName: string;
  appointmentType?: string;
}): Promise<void> {
  const body =
    `🔔 *Recordatorio — Equilibria*\n\n` +
    `Hola ${opts.studentName}, tienes una cita *mañana*:\n\n` +
    `📅 *Fecha:* ${formatDate(opts.date)}\n` +
    `🕐 *Hora:* ${formatTime(opts.date)}\n` +
    `👨‍⚕️ *Psicólogo/a:* ${opts.professionalName}\n` +
    `\n_Si necesitas cancelar, hazlo desde la plataforma Equilibria._`;
  await sendMessage(opts.to, body, opts.date);
}

// ── Notificación de cancelación al estudiante ─────────────────────────────────
export async function sendCancellationToStudent(opts: {
  to: string;
  studentName: string;
  date: Date;
  professionalName: string;
  cancelledBy: 'professional' | 'admin';
}): Promise<void> {
  const body =
    `❌ *Cita Cancelada — Equilibria*\n\n` +
    `Hola ${opts.studentName}, tu cita ha sido cancelada por tu psicólogo/a.\n\n` +
    `📅 *Fecha era:* ${formatDate(opts.date)} a las ${formatTime(opts.date)}\n` +
    `👨‍⚕️ *Psicólogo/a:* ${opts.professionalName}\n\n` +
    `_Por favor agenda una nueva cita desde la plataforma Equilibria._`;
  await sendMessage(opts.to, body, opts.date);
}

// ── Notificación de cancelación al psicólogo ──────────────────────────────────
export async function sendCancellationToProfessional(opts: {
  to: string;
  professionalName: string;
  date: Date;
  studentName: string;
}): Promise<void> {
  const body =
    `❌ *Cita Cancelada — Equilibria*\n\n` +
    `Hola ${opts.professionalName}, el/la estudiante *${opts.studentName}* ha cancelado su cita.\n\n` +
    `📅 *Fecha era:* ${formatDate(opts.date)} a las ${formatTime(opts.date)}\n\n` +
    `_El horario ha quedado disponible nuevamente._`;
  await sendMessage(opts.to, body, opts.date);
}
