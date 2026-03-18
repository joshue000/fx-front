# ── Stage 1: Build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --prefer-offline

COPY . .
RUN npm run build -- --configuration production

# ── Stage 2: Serve ───────────────────────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Remove the default nginx static content
RUN rm -rf /usr/share/nginx/html/*

# Copy built Angular app
COPY --from=builder /app/dist/fx-front/browser /usr/share/nginx/html

# nginx config: redirect all routes to index.html (Angular routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
