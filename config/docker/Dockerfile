# To run:
# docker build -t redoc -f config/docker/Dockerfile .
# docker run -it --rm -p 80:80 -e SPEC_URL='http://localhost:8000/openapi.yaml' redoc
# Ensure http://localhost:8000/openapi.yaml is served with cors. A good solution is:
# npm i -g http-server
# http-server -p 8000 --cors

# `--build-arg BUNDLE_STAGE=prebuilt` takes bundles/redoc.standalone.js from `npm run build`
# instead of building it in the image (the Docker smoke test uses it).
ARG BUNDLE_STAGE=build

FROM node:24.21.0-alpine3.24@sha256:ebfe2f90462722a7a4de65e91990e97fe0d401c70e0e762c5b53302f905ec1c1 AS build

WORKDIR /build

COPY package.json package-lock.json ./

RUN npm ci --no-fund

COPY . .

RUN npm run build:standalone && npm run minify

FROM scratch AS prebuilt
COPY bundles/redoc.standalone.js /build/bundles/

FROM ${BUNDLE_STAGE} AS bundle

FROM nginx:1.30-alpine@sha256:0985e772fb9f729e6fa0980da05fca5d9c468e870eed43071545afa9d2e27d94

ENV PAGE_TITLE="ReDoc"
ENV PAGE_FAVICON="favicon.png"
ENV BASE_PATH=
ENV SPEC_URL="https://cdn.redocly.com/redoc/museum-api.yaml"
ENV PORT=80
ENV HOST=localhost
ENV REDOC_OPTIONS=

# add docker-entrypoint scripts
COPY config/docker/docker-entrypoint.d/ /docker-entrypoint.d/
COPY config/docker/docker-run.sh /usr/local/bin/
RUN chmod -R +x /docker-entrypoint.d/ /usr/local/bin/docker-run.sh

# copy nginx config
COPY config/docker/nginx/templates/ /etc/redoc/nginx/
COPY config/docker/nginx/nginx.conf config/docker/nginx/handle_options.conf config/docker/nginx/security.conf config/docker/nginx/caching.conf /etc/nginx/

# copy static files; index.html is generated at start-up
COPY config/docker/index.tpl.html /etc/redoc/index.tpl.html
COPY config/docker/static/ /usr/share/nginx/html/
RUN rm /etc/nginx/conf.d/default.conf \
  && ln -sf /tmp/redoc/index.html /usr/share/nginx/html/index.html
COPY --from=bundle /build/bundles/redoc.standalone.js /usr/share/nginx/html/

# Put a content hash in the asset names and record them for the page templates
RUN cd /usr/share/nginx/html \
  && BUNDLE_FILE="redoc.standalone.$(sha256sum redoc.standalone.js | cut -c1-12).js" \
  && STYLES_FILE="styles.$(sha256sum styles.css | cut -c1-12).css" \
  && mv redoc.standalone.js "$BUNDLE_FILE" \
  && mv styles.css "$STYLES_FILE" \
  && printf 'BUNDLE_FILE=%s\nSTYLES_FILE=%s\n' "$BUNDLE_FILE" "$STYLES_FILE" > /etc/redoc-assets.env

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
