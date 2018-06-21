# To run:
# docker build -t redoc .
# docker run -it --rm -p 80:80 -e SPEC_URL='http://localhost:8000/swagger.yaml' redoc
# Ensure http://localhost:8000/swagger.yaml is served with cors. A good solution is:
# npm i -g http-server
# http-server -p 8000 --cors

FROM node:alpine

RUN apk update && apk add git

# generate bundle
WORKDIR /build
COPY . /build
RUN yarn install --frozen-lockfile --ignore-optional --ignore-scripts
RUN npm run bundle:standalone

FROM nginx:alpine

ENV PAGE_TITLE="ReDoc"
ENV PAGE_FAVICON="favicon.png"
ENV SPEC_URL="http://petstore.swagger.io/v2/swagger.json"
ENV PORT=80
ENV REDOC_OPTIONS=

# copy files to the nginx folder
COPY --from=0 build/bundles /usr/share/nginx/html
COPY config/docker/index.tpl.html /usr/share/nginx/html/index.html
COPY demo/favicon.png /usr/share/nginx/html/
COPY config/docker/nginx.conf /etc/nginx/
COPY config/docker/docker-run.sh /usr/share/nginx/

EXPOSE 80

CMD ["sh", "/usr/share/nginx/docker-run.sh"]
