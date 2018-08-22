# To build:
# - Must be in the project root directory
# - docker build -f cli/Dockerfile .
#
# To run
# - docker run --rm -i -t <image> --help


FROM node:alpine

RUN apk update && apk add --no-cache git python alpine-sdk nodejs

# generate bundle
WORKDIR /build
COPY . /build
#RUN cd cli && npm run compile:cli
RUN yarn install --frozen-lockfile --ignore-optional --ignore-scripts
RUN npm run bundle && npm run compile:cli

RUN npm install typescript
RUN npm install iltorb
RUN npm install -g redoc-cli

ENTRYPOINT ["redoc-cli"]

