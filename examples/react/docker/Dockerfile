FROM node:24-alpine AS build
WORKDIR /app
COPY . .
RUN if [ -f redoc.tgz ]; then npm install ./redoc.tgz; fi && npm install && npm run build

FROM nginx:1.28-alpine
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
