FROM node:18-slim AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:18-slim
WORKDIR /app

ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production # Install only production dependencies

COPY --from=builder /app/dist ./dist

EXPOSE 5173
CMD ["npm", "start"]
