# Etapa base com Node.js (MESMA DO PROJETO QUE FUNCIONOU)
FROM node:20-slim

# Instala Chromium e dependências essenciais (EXATO COMO NO DOU)
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    xdg-utils \
    --no-install-recommends && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Cria diretório da app
WORKDIR /app

# Copia e instala dependências
COPY package*.json ./
RUN npm install

# Copia o restante da aplicação
COPY . .

# Build da aplicação frontend
RUN npm run build

# Define a variável do caminho do Chromium (CRUCIAL PARA FUNCIONAR)
ENV CHROME_BIN=/usr/bin/chromium

# Define ambiente de produção
ENV NODE_ENV=production

# Expõe a porta
EXPOSE 80

# Comando para iniciar a aplicação
CMD ["npm", "start"]
