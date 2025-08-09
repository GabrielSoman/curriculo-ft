# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Install Chromium for html-pdf-node
RUN apk add --no-cache chromium

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm install

# Copy all source files
COPY . .

# Build the application
RUN npm run build

# Verify build output
RUN echo "=== Build completed ===" && ls -la dist/

# Production stage
FROM node:18-alpine AS production

# Install Chromium for html-pdf-node
RUN apk add --no-cache chromium

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

# Switch to non-root user
USER nextjs

# Set environment variables for Puppeteer/html-pdf-node
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Set port environment variable
ENV PORT=80

# Expose port
EXPOSE 80

# Start the server
CMD ["npm", "start"]