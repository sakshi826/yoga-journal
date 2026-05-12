FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:20
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server.cjs ./
COPY --from=builder /app/package*.json ./
RUN npm install --production
EXPOSE 80
ENV NODE_ENV=production
ENV PORT=80
CMD ["node", "server.cjs"]
