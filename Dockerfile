FROM node:18-slim AS dependencies
WORKDIR /app

ARG BUILD_ENV=production
ENV NODE_ENV=${BUILD_ENV}

COPY package*.json ./
RUN if [ "$NODE_ENV" = "development" ]; then \
      npm install; \
    else \
      npm ci --only=production --prefer-offline; \
    fi

FROM dependencies AS build
COPY . .
RUN if [ "$NODE_ENV" != "development" ]; then \
      npm run build; \
    fi

FROM node:18-slim AS final
WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

ARG BUILD_ENV
RUN if [ "$BUILD_ENV" != "development" ] && [ -d /app/dist ]; then \
      cp -r /app/dist ./dist; \
    else \
      echo "Development mode - skipping dist copy"; \
    fi

EXPOSE 5173

CMD if [ "$NODE_ENV" = "development" ]; then \
      npm run dev; \
    else \
      npm start; \
    fi
