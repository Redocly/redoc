# To run:
# docker build -t redoc .
# docker run -it --rm -p 80:80 -e SPEC_URL='http://localhost:8000/swagger.yaml' redoc
# Ensure http://localhost:8000/swagger.yaml is served with cors. A good solution is:
# npm i -g http-server
# http-server -p 8000 --cors

FROM node:24.11.1-alpine3.22@sha256:2867d550cf9d8bb50059a0fff528741f11a84d985c732e60e19e8e75c7239c43 AS build

WORKDIR /build

COPY . .

RUN npm ci --no-optional --ignore-scripts --no-fund --omit=dev \
  && npm install --no-save vite

RUN npm run build:standalone && npm run minify

FROM nginx:1.28-alpine@sha256:8f2bcf97c473dfe311e79a510ee540ee02e28ce1e6a64e1ef89bfad32574ef10

ENV PAGE_TITLE="ReDoc"
ENV PAGE_FAVICON="favicon.png"
ENV BASE_PATH=
ENV SPEC_URL="https://cdn.redocly.com/redoc/museum-api.yaml"
ENV PORT=80
ENV HOST=localhost
ENV REDOC_OPTIONS=

# add docker-entrypoint scripts
COPY config/docker/docker-entrypoint.d/ /docker-entrypoint.d/
RUN chmod -R +x /docker-entrypoint.d/

# copy nginx config
COPY config/docker/nginx/templates/ /etc/nginx/templates/
COPY config/docker/nginx/nginx.conf config/docker/nginx/handle_options.conf config/docker/nginx/security.conf /etc/nginx/

# copy static files
COPY config/docker/static/ /usr/share/nginx/html/
COPY --from=build /build/bundle/redoc.standalone.js /usr/share/nginx/html/

# Provide rights to the root group to write to nginx repositories (needed to run in OpenShift)
RUN chgrp -R 0 /etc/nginx \
  && chgrp -R 0 /usr/share/nginx/html \
  && chgrp -R 0 /var/cache/nginx \
  && chgrp -R 0 /var/log/nginx \
  && chgrp -R 0 /var/run \
  && chmod -R g+rwX /etc/nginx \
  && chmod -R g+rwX /usr/share/nginx/html \
  && chmod -R g+rwX /var/cache/nginx \
  && chmod -R g+rwX /var/log/nginx \
  && chmod -R g+rwX /var/run
