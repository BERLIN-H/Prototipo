import { Response } from 'express';
import { AuthRequest } from '../../middlewares/auth.middleware';
import prisma from '../../lib/prisma';

// GET /api/citas — citas del usuario autenticado (estudiante ve las suyas, psicólogo ve las suyas como profesional)
export const getCitas = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = req.user!;
  const { status, from, to } = req.query;

  const where: any = {};

  if (user.role === 'USER') {
    where.studentId = user.id;
  } else if (user.role === 'PSYCHOLOGIST') {
    where.professionalId = user.id;
  }
  // ADMIN ve todas

  if (status) where.status = status;
  if (from || to) {
    where.date = {};
    if (from) where.date.gte = new Date(from as string);
    if (to) where.date.lte = new Date(to as string);
  }

  const citas = await prisma.cita.findMany({
    where,
    include: {
      student: { select: { id: true, name: true, email: true, faculty: true, semester: true } },
      professional: { select: { id: true, name: true, email: true } },
    },
    orderBy: { date: 'asc' },
  });

  res.json(citas);
};

// GET /api/citas/next — próxima cita del estudiante
export const getNextCita = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = req.user!;

  const cita = await prisma.cita.findFirst({
    where: {
      studentId: user.id,
      status: { in: ['PENDIENTE', 'CONFIRMADA'] },
      date: { gte: new Date() },
    },
    include: {
      professional: { select: { id: true, name: true, email: true } },
    },
    orderBy: { date: 'asc' },
  });

  res.json(cita);
};

// POST /api/citas
export const createCita = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = req.user!;
  const { professionalId, date, type, mode, location, notes } = req.body;

  // Verificar que el profesional existe y es psicólogo
  const professional = await prisma.user.findUnique({ where: { id: professionalId } });
  if (!professional || professional.role !== 'PSYCHOLOGIST') {
    res.status(400).json({ error: 'El profesional seleccionado no es válido' });
    return;
  }

  // Verificar que no haya solapamiento para el profesional
  const citaDate = new Date(date);
  const windowStart = new Date(citaDate.getTime() - 45 * 60 * 1000);
  const windowEnd = new Date(citaDate.getTime() + 45 * 60 * 1000);

  const overlap = await prisma.cita.findFirst({
    where: {
      professionalId,
      status: { in: ['PENDIENTE', 'CONFIRMADA'] },
      date: { gte: windowStart, lte: windowEnd },
    },
  });

  if (overlap) {
    res.status(409).json({ error: 'El profesional ya tiene una cita en ese horario' });
    return;
  }

  const cita = await prisma.cita.create({
    data: {
      studentId: user.id,
      professionalId,
      date: citaDate,
      type: type ?? 'Consulta General',
      mode: mode ?? 'Presencial',
      location,
      notes,
    },
    include: {
      professional: { select: { id: true, name: true, email: true } },
      student: { select: { id: true, name: true, email: true } },
    },
  });

  // Crear notificación automática para el estudiante
  await prisma.notification.create({
    data: {
      userId: user.id,
      title: 'Cita Agendada',
      message: `Tu cita con ${professional.name} ha sido agendada para el ${citaDate.toLocaleDateString('es-CO', { dateStyle: 'full' })}.`,
      type: 'SUCCESS',
    },
  });

  res.status(201).json(cita);
};

// PATCH /api/citas/:id
export const updateCita = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = req.user!;
  const id = parseInt(req.params.id);
  const data = req.body;

  const cita = await prisma.cita.findUnique({ where: { id } });
  if (!cita) {
    res.status(404).json({ error: 'Cita no encontrada' });
    return;
  }

  // Solo el estudiante dueño, el profesional asignado, o admin pueden modificar
  const canEdit =
    user.role === 'ADMIN' ||
    cita.studentId === user.id ||
    cita.professionalId === user.id;

  if (!canEdit) {
    res.status(403).json({ error: 'Sin permisos para modificar esta cita' });
    return;
  }

  const updated = await prisma.cita.update({
    where: { id },
    data: {
      ...(data.status && { status: data.status }),
      ...(data.date && { date: new Date(data.date) }),
      ...(data.type && { type: data.type }),
      ...(data.mode && { mode: data.mode }),
      ...(data.location !== undefined && { location: data.location }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
    include: {
      professional: { select: { id: true, name: true } },
      student: { select: { id: true, name: true } },
    },
  });

  // Notificar al estudiante si el profesional cambia el estado
  if (data.status && cita.professionalId === user.id) {
    const statusLabel: Record<string, string> = {
      CONFIRMADA: 'confirmada ✅',
      CANCELADA: 'cancelada ❌',
      COMPLETADA: 'marcada como completada',
    };
    await prisma.notification.create({
      data: {
        userId: cita.studentId,
        title: `Cita ${statusLabel[data.status] ?? 'actualizada'}`,
        message: `Tu cita ha sido ${statusLabel[data.status] ?? 'actualizada'} por tu profesional.`,
        type: data.status === 'CONFIRMADA' ? 'SUCCESS' : data.status === 'CANCELADA' ? 'WARNING' : 'INFO',
      },
    });
  }

  res.json(updated);
};

// DELETE /api/citas/:id
export const deleteCita = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = req.user!;
  const id = parseInt(req.params.id);

  const cita = await prisma.cita.findUnique({ where: { id } });
  if (!cita) {
    res.status(404).json({ error: 'Cita no encontrada' });
    return;
  }

  if (user.role !== 'ADMIN' && cita.studentId !== user.id) {
    res.status(403).json({ error: 'Sin permisos para eliminar esta cita' });
    return;
  }

  await prisma.cita.delete({ where: { id } });
  res.status(204).send();
};

// GET /api/citas/professionals — lista de psicólogos disponibles
export const getProfessionals = async (_req: AuthRequest, res: Response): Promise<void> => {
  const professionals = await prisma.user.findMany({
    where: { role: 'PSYCHOLOGIST' },
    select: { id: true, name: true, email: true },
    orderBy: { name: 'asc' },
  });
  res.json(professionals);
};
