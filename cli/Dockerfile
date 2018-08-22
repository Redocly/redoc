# Package the 'redoc-cli' as a docker image.
#
# To build:
# $ cd <Redoc project directory>
# $ docker build -t redoc-cli -f cli/Dockerfile .
#
# To run:
# To display the command line options:
# $ docker run --rm -it redoc-cli redoc-cli --help
# .. will display the comand line help
#
# To the `swagger.yml` file in the current directory, and output 'redoc-static.html'
# $  docker run --rm -it  -v $PWD:/data redoc-cli redoc-cli bundle swagger.yml

FROM node:alpine

# Needs python, alpine-sdk to build node packages
RUN apk update && apk add --no-cache git python alpine-sdk nodejs

WORKDIR /build
COPY . /build

RUN yarn install --frozen-lockfile --ignore-optional --ignore-scripts && \
  npm run bundle && npm run compile:cli && \
  npm install typescript && \
  npm install iltorb  && \
  npm install -g redoc-cli

WORKDIR /data

