FROM node:20-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=8080

COPY 404.html ./
COPY about.html ./
COPY accessibility.html ./
COPY applications.html ./
COPY brand-ingredients.html ./
COPY contact.html ./
COPY cookies.html ./
COPY index.html ./
COPY partner.html ./
COPY privacy.html ./
COPY product-artichoke.html ./
COPY product-black-ginger.html ./
COPY product-green-coffee.html ./
COPY products.html ./
COPY quality.html ./
COPY resources.html ./
COPY robots.txt ./
COPY sitemap.xml ./
COPY terms.html ./
COPY warehouse.html ./
COPY package.json ./
COPY server.js ./
COPY assets ./assets

EXPOSE 8080

CMD ["node", "server.js"]
