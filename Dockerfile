# ── Etapa 1: Build ─────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

# Generar Prisma client
RUN npx prisma generate

# Build frontend + backend
RUN npm run build

# ── Etapa 2: Runtime ───────────────────────────────────────────────────
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

COPY package.json ./
RUN npm install --omit=dev

# Artefactos del build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Prisma necesita el schema y el config en runtime para migrate/db push
COPY --from=builder /app/backend/prisma ./backend/prisma
COPY --from=builder /app/prisma.config.ts ./prisma.config.ts

# Script de arranque
COPY docker-entrypoint.sh ./
RUN chmod +x docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
