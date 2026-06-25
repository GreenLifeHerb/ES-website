FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY *.html ./
COPY *.xml ./
COPY *.txt ./
COPY favicon.ico ./
COPY favicon.png ./
COPY package.json ./
COPY package-lock.json ./
COPY server.js ./
COPY assets ./assets

RUN npm ci --omit=dev

EXPOSE 8080

CMD ["node", "server.js"]
