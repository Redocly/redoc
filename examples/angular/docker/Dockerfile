FROM node:24-alpine AS build
WORKDIR /app
ENV NG_CLI_ANALYTICS=false
COPY . .
RUN if [ -f redoc.tgz ]; then npm install ./redoc.tgz; fi && npm install && npm run build

FROM nginx:1.28-alpine
COPY --from=build /app/dist/browser /usr/share/nginx/html
