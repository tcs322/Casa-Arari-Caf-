# Etapa 1 — Build da aplicação
FROM node:20-alpine AS build

WORKDIR /app

# Instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante dos arquivos e executa o build
COPY . .
RUN npm run build

# Etapa 2 — Servir com Nginx
FROM nginx:1.27-alpine

# Remove a página padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia os arquivos gerados pelo build do Vue
COPY --from=build /app/dist /usr/share/nginx/html

# Copia configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposição da porta
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
