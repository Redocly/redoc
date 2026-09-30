FROM nginx:1.28-alpine

COPY docker/set-redoc-url.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/set-redoc-url.sh

COPY index.html /usr/share/nginx/html/
