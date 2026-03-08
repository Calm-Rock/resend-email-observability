FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY index.js .

EXPOSE 3000

ENV OTEL_TRACES_EXPORTER=otlp
ENV OTEL_NODE_RESOURCE_DETECTORS=env,host,os

CMD ["node", "--require", "@opentelemetry/auto-instrumentations-node/register", "index.js"]