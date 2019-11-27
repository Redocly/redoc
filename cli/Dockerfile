# Package the 'redoc-cli' as a docker image.
#
# To build:
# $ cd <Redoc project directory>
# $ docker build -t redoc-cli -f cli/Dockerfile .
#
# To run:
# To display the command line options:
# $ docker run --rm -it redoc-cli --help
# .. will display the command line help
#
# To turn `swagger.yml` file in the current directory, to html documentation 'redoc-static.html'
# $  docker run --rm -it  -v $PWD:/data redoc-cli bundle swagger.yml

FROM node:alpine

RUN npm install -g redoc-cli

WORKDIR /data
EXPOSE 8080

ENTRYPOINT ["redoc-cli"]
CMD []
