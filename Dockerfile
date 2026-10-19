# Stage 1: Build & Runtime environment with OpenJDK 21 + Node.js 20
FROM eclipse-temurin:21-jdk-jammy

# Install Node.js 20
RUN apt-get update && apt-get install -y curl build-essential && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy dependency files first for Docker caching
COPY server/package*.json ./server/
RUN cd server && npm install --production=false

COPY client/package*.json ./client/
RUN cd client && npm install

# Copy entire project
COPY . .

# Build React client into client/dist
RUN cd client && npm run build

# Set environment
ENV PORT=5000
ENV NODE_ENV=production
EXPOSE 5000

# Start Express server (serves API and client/dist)
WORKDIR /app/server
CMD ["node", "src/server.js"]
