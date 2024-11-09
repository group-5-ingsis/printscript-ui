FROM node:18-slim AS base
WORKDIR /app

ARG BUILD_ENV
ENV NODE_ENV=${BUILD_ENV}

COPY package*.json ./

RUN if [ "$NODE_ENV" = "development" ]; then \
      npm install; \
    else \
      npm ci --only=production; \
    fi

COPY . .

RUN if [ "$NODE_ENV" = "development" ]; then \
      echo "Skipping build for development"; \
    else \
      npm run build; \
    fi

EXPOSE 5173

CMD if [ "$NODE_ENV" = "development" ]; then \
      npm run dev; \
    else \
      npm start; \
    fi
