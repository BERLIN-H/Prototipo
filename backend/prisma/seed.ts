import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Iniciando seed de Equilibria...');

  const adminPassword = await bcrypt.hash('Admin2026!', 10);
  await prisma.user.upsert({
    where: { email: 'admin@equilibria.edu' },
    update: {},
    create: { email: 'admin@equilibria.edu', password: adminPassword, name: 'Administrador Equilibria', role: 'ADMIN' },
  });

  const psycPassword = await bcrypt.hash('Psico2026!', 10);
  await prisma.user.upsert({
    where: { email: 'dra.rodriguez@equilibria.edu' },
    update: {},
    create: { email: 'dra.rodriguez@equilibria.edu', password: psycPassword, name: 'Dra. Elena Rodríguez', role: 'PSYCHOLOGIST' },
  });

  const studentPassword = await bcrypt.hash('Estudiante2026!', 10);
  await prisma.user.upsert({
    where: { email: 'mariana@estudiante.edu' },
    update: {},
    create: { email: 'mariana@estudiante.edu', password: studentPassword, name: 'Mariana García', role: 'USER' },
  });

  console.log('✅ Usuarios creados:');
  console.log('   👤 Admin:       admin@equilibria.edu / Admin2026!');
  console.log('   🩺 Psicólogo:   dra.rodriguez@equilibria.edu / Psico2026!');
  console.log('   🎓 Estudiante:  mariana@estudiante.edu / Estudiante2026!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
