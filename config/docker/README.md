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

### Read-only root filesystem

Everything the container generates at start-up is written to `/tmp`, so mount a tmpfs there:

    docker run -it --rm -p 80:80 --read-only --tmpfs /tmp redocly/redoc

### Custom nginx configuration

`*.conf` files mounted into `/etc/nginx/conf.d/` are included after the Redoc server block, and
`*.template` files in `/etc/nginx/templates/` are rendered into `/etc/nginx/conf.d/` by the nginx
entrypoint as in the stock `nginx` image (that step needs a writable `/etc/nginx/conf.d`).

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

- `PAGE_TITLE` (default `"ReDoc"`) - page title (HTML-escaped)
- `PAGE_FAVICON` (default `"favicon.png"`) - favicon: a file name resolves next to the page assets (under `BASE_PATH`), an absolute URL (`https://…`, `//…`, `/…`, `data:…`) is used as given
- `BASE_PATH` (optional) - path prefix, e.g. `docs` serves the page at `/docs` and loads its assets from `/docs/`; leading and trailing slashes are ignored (`/docs`, `docs/` and `docs` are the same). The page is also served at `/`, so a reverse proxy that strips the prefix keeps working. Without `BASE_PATH` the asset URLs are relative (absolute with `router="history"`). Only a URL path is accepted: letters, digits, `.`, `_`, `~`, `-` and `/`, without `.` or `..` segments
- `SPEC_URL` (default `"https://cdn.redocly.com/redoc/museum-api.yaml"`) – URL to the API definition, required (the container exits when it is empty); a file mounted into `/usr/share/nginx/html` is served at `/<file>` and, with `BASE_PATH`, also at `/<BASE_PATH>/<file>`; with `BASE_PATH` or `router="history"` a relative `SPEC_URL` (`openapi.yaml`) resolves against `/<BASE_PATH>/` or `/`, not the page path, so deep links load it too
- `HOST` (default `localhost`) - nginx server_name
- `PORT` (default `80`) - nginx port (IPv4, and IPv6 when the container has it), or `address:port` to listen on one address only
- `REDOC_OPTIONS` (optional) - `<redoc>` tag attributes, inserted as-is, e.g. `router="history"` (routing is hash-based by default; with `router="history"` under `BASE_PATH` the image adds `base-path` for you)

## Migrating from the Redoc 2.x image

Switch the image tag; the 2.x environment variables, mount paths and start command keep working:

- `PAGE_TITLE`, `PAGE_FAVICON`, `BASE_PATH`, `SPEC_URL`, `PORT` and `REDOC_OPTIONS` have the same
  names. The default `SPEC_URL` is now the Museum sample instead of Petstore.
- Definitions mounted into `/usr/share/nginx/html` (a file or a directory) are served at the same
  URLs, and a relative `SPEC_URL` such as `swagger.yaml` still resolves.
- `BASE_PATH` still prefixes the favicon and bundle URLs, and the page is still served at `/` for
  a reverse proxy that strips the prefix; it is now also served under the prefix itself.
- `sh /usr/local/bin/docker-run.sh`, the 2.x start command, still starts the container, and the
  image still exposes port `80` (declared by the nginx base image).
- `PAGE_TITLE` and `SPEC_URL` are now HTML-escaped: write `&`, not `&amp;` or `\&`.
- `BASE_PATH` is now a path prefix only. A full URL (`https://cdn.example.com/redoc/`) is
  rejected at start-up, and a relative value such as `docs/` is the absolute prefix `/docs`.
- A page mounted over `/usr/share/nginx/html/index.html` is served as is, without the environment
  variables applied.
- `REDOC_OPTIONS` attributes are read by Redoc 3; see the Redoc 3 options for renamed or removed
  attributes.

## Build

    docker build -t redocly/redoc -f config/docker/Dockerfile .
