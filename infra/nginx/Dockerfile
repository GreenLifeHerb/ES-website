FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html

COPY index.html ./
COPY *.html ./
COPY assets ./assets
COPY sitemap.xml* ./
COPY robots.txt* ./
COPY infra/nginx/default.conf /etc/nginx/conf.d/default.conf
