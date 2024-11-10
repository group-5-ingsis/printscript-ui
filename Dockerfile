FROM node:18-slim AS dependencies
WORKDIR /app

ARG BUILD_ENV
ENV NODE_ENV=${BUILD_ENV}

COPY package*.json ./

RUN if [ "$NODE_ENV" = "development" ]; then \
      npm install; \
    else \
      npm ci --only=production --prefer-offline; \
    fi

FROM dependencies AS development
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev"]

FROM dependencies AS build
COPY . .
RUN npm run build

FROM node:18-slim AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=dependencies /app/node_modules ./node_modules
COPY package.json ./

EXPOSE 5173
CMD ["npm", "start"]
