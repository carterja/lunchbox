# Stage 1: build frontend
FROM node:22-bookworm-slim AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: run app (Node + Playwright Chromium for URL scraping)
FROM node:22-bookworm AS runner
WORKDIR /app

# Install Playwright Chromium and system deps for URL scraping
RUN npx -y playwright@1.52.0 install chromium --with-deps

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist
COPY server ./server

# App listens on PORT (default 9515); bind to all interfaces
ENV NODE_ENV=production
ENV PORT=9515
EXPOSE 9515

CMD ["node", "server/index.js"]
