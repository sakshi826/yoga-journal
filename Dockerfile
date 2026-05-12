FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.cjs ./
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env ./

RUN npm ci --only=production

EXPOSE 80

ENV NODE_ENV=production
ENV PORT=80

CMD ["node", "server.cjs"]
