# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci --no-audit --no-fund

# Copy all source files
COPY . .

# Build the application
RUN npm run build

# Verify build output
RUN echo "=== Build completed ===" && ls -la dist/

# Production stage
FROM node:18-alpine AS production

# Install Chromium and dependencies for PDF generation
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    freetype-dev \
    harfbuzz \
    ca-certificates \
    ttf-freefont \
    ttf-dejavu \
    fontconfig \
    font-noto \
    font-noto-cjk \
    font-noto-extra \
    wqy-zenhei \
    && fc-cache -f

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built application and server files
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/src/server ./src/server
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production --no-audit --no-fund && \
    npm cache clean --force

# Create necessary directories and set permissions
RUN mkdir -p /tmp && \
    chmod 777 /tmp && \
    mkdir -p /app/.cache && \
    chown -R nextjs:nodejs /app/.cache

# Switch to non-root user
USER nextjs

# Set Puppeteer environment variables
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    PUPPETEER_ARGS="--no-sandbox,--disable-setuid-sandbox,--disable-dev-shm-usage,--disable-accelerated-2d-canvas,--no-first-run,--no-zygote,--single-process,--disable-gpu,--disable-background-timer-throttling,--disable-renderer-backgrounding,--disable-backgrounding-occluded-windows,--disable-features=TranslateUI,--disable-extensions,--disable-component-extensions-with-background-pages" \
    DISPLAY=:99

# Set port environment variable
ENV PORT=80

# Expose port
EXPOSE 80

# Start the server
CMD ["npm", "start"]
