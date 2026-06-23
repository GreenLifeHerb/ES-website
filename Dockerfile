FROM nginx:1.27-alpine

WORKDIR /usr/share/nginx/html

COPY ES-website/ ./

EXPOSE 8080

CMD ["sh", "-c", "sed -i 's/listen       80;/listen       8080;/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]
