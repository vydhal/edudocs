FROM node:18-alpine

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code and prisma schema
COPY . .

# Generate Prisma Client
RUN npx prisma generate

EXPOSE 3001

# Start command (using migrate deploy to ensure DB is compliant)
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]
