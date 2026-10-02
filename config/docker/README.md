# Official Redoc Docker Image

## Usage

### Docker

Serve remote spec by URL:

    docker run -it --rm -p 80:80 \
      -e SPEC_URL='http://localhost:8000/openapi.yaml' redocly/redoc

Serve local file:

    docker run -it --rm -p 80:80 \
      -v $(pwd)/openapi.yaml:/usr/share/nginx/html/openapi.yaml \
      -e SPEC_URL=openapi.yaml redocly/redoc

Serve local file and watch for updates:

    docker run -it --rm -p 80:80 \
      -v $(pwd)/specs/:/usr/share/nginx/html/specs/ \
      -e SPEC_URL=specs/openapi.yaml redocly/redoc

Serve an AsyncAPI or GraphQL definition (Redoc renders OpenAPI, AsyncAPI, and GraphQL).

    docker run -it --rm -p 80:80 \
      -e SPEC_URL='http://localhost:8000/asyncapi.yaml' redocly/redoc

### OpenShift

To quote [OpenShift Container Platform-Specific Guidelines](https://docs.openshift.com/container-platform/3.11/creating_images/guidelines.html#openshift-specific-guidelines):

> Support Arbitrary User IDs
>
> By default, OpenShift Container Platform runs containers using an arbitrarily assigned user ID. This provides additional security against processes escaping the container due to a container engine vulnerability and thereby achieving escalated permissions on the host node.
>
> For an image to support running as an arbitrary user, directories and files that may be written to by processes in the image should be owned by the root group and be read/writable by that group. Files to be executed should also have group execute permissions.

To comply with those requirements the `Dockerfile` contains instructions to adapt the rights for the folders:

- `/etc/nginx` because the `docker-run.sh` script modifies it at startup time
- `/usr/share/nginx/html` because the `docker-run.sh` script modifies it at startup time
- `/var/cache/nginx` because the Nginx process writes to it
- `/var/log/nginx` because the Nginx process writes to it
- `/var/run` because the Nginx process writes to it

Another issue with OpenShift is that the default exposed port `80` cannot be used as it is restricted. So one needs to use another port like `8080` (using the `PORT` configuration as described below), and then to configure the `container spec` accordingly.

## Runtime configuration options

- `PAGE_TITLE` (default `"ReDoc"`) - page title
- `PAGE_FAVICON` (default `"favicon.png"`) - URL to page favicon
- `BASE_PATH` (optional) - path prefix, e.g. `docs` serves the page at `/docs`
- `SPEC_URL` (default `"https://cdn.redocly.com/redoc/museum-api.yaml"`) – URL to the API definition (if mounted as a file inside the container and `BASE_PATH` is used, the URL should contain the prefix, e.g. `"/v1/openapi.yaml"`)
- `HOST` (default `localhost`) - nginx server_name
- `PORT` (default `80`) - nginx port
- `REDOC_OPTIONS` (optional) - `<redoc>` tag attributes, e.g. `router="history"` (routing is hash-based by default; with `router="history"` under `BASE_PATH` the image adds `base-path` for you)

## Build

    docker build -t redocly/redoc -f config/docker/Dockerfile .
