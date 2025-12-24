# Stage 1: Build da aplica??o
FROM node:20-alpine AS builder

WORKDIR /app

# Copia arquivos de depend?ncias
COPY package*.json ./

# Instala depend?ncias
RUN npm ci --only=production=false

# Copia o restante do c?digo
COPY . .

# Build da aplica??o (tsc + vite build)
RUN npm run build

# Stage 2: Servir com Nginx
FROM nginx:alpine

# Copia os arquivos buildados do stage anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia a configura??o customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exp?e a porta 4173
EXPOSE 4173

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]
