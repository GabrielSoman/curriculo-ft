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
    ca-certificates \
    fontconfig \
    ttf-freefont \
    ttf-dejavu \
    && addgroup -g 1001 -S nodejs \
    && adduser -S nextjs -u 1001

# Create app directory
WORKDIR /app

# Copy built application and server files
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nextjs:nodejs /app/src/server ./src/server
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./

# Install only production dependencies
RUN npm ci --only=production --no-audit --no-fund && \
    npm cache clean --force

# Create necessary directories and set permissions
RUN mkdir -p /tmp /app/.cache && \
    chmod 777 /tmp && \
    chown -R nextjs:nodejs /app/.cache

# Switch to non-root user
USER nextjs

# Set Node.js environment variables
ENV NODE_ENV=production

# Set port environment variable
ENV PORT=80

# Expose port
EXPOSE 80

# Start the server
CMD ["npm", "start"]
