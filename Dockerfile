# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm install

# Copy all source files
COPY . .

# Debug: List files to verify structure
RUN echo "=== Files in /app ===" && ls -la
RUN echo "=== Checking index.html ===" && ls -la index.html || echo "index.html not found!"
RUN echo "=== Files in src ===" && ls -la src/ || echo "src directory not found!"

# Build the application
RUN npm run build

# Verify build output
RUN echo "=== Build output ===" && ls -la dist/ || echo "Build failed - no dist directory"

# Production stage
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Create non-root user first
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy built application from builder stage
COPY --from=builder --chown=nextjs:nodejs /app/dist ./dist

# Copy server files and node_modules from builder
COPY --from=builder --chown=nextjs:nodejs /app/src/server ./src/server
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package*.json ./

# Switch to non-root user
USER nextjs

# Set port environment variable
ENV PORT=80

# Expose port
EXPOSE 80

# Start the server
CMD ["npm", "start"]