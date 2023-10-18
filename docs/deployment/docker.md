---
seo:
  title: Use the Redoc Docker image
---

# How to use the Redoc Docker image

Redoc is available as a pre-built Docker image in [Docker Hub](https://hub.docker.com/r/redocly/redoc/).

If you have [Docker](https://docs.docker.com/get-docker/) installed, pull the image with the following command:

```docker
docker pull redocly/redoc
```

Then run the image with the following command:

```docker
docker run -p 8080:80 redocly/redoc
```

The preview starts on port 8080, based on the port used in the command,
and can be accessed at `http://localhost:8080`.
To exit the preview, use `control+C`.

By default Redoc starts with a demo Swagger Petstore OpenAPI definition located at
http://petstore.swagger.io/v2/swagger.json. You can update this URL using
the environment variable `SPEC_URL`.

For example:

```bash
docker run -p 8080:80 -e SPEC_URL=https://api.example.com/openapi.json redocly/redoc
```

## Create a Dockerfile

You can also create a Dockerfile with some predefined environment variables. Check out
a sample [Dockerfile](https://github.com/Redocly/redoc/blob/main/config/docker/Dockerfile)
in our code repo.
