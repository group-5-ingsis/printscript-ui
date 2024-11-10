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

COPY --from=build /app/dist ./dist
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

EXPOSE 5173

CMD if [ "$NODE_ENV" = "development" ]; then \
      npm run dev; \
    else \
      npm start; \
    fi
