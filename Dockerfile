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

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy server files
COPY --from=builder /app/src/server ./src/server

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Set port environment variable
ENV PORT=80

# Expose port
EXPOSE 80

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the server
CMD ["npm", "start"]