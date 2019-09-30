# Official ReDoc Docker Image

## Usage

Serve remote spec by URL:

    docker run -it --rm -p 80:80 \
      -e SPEC_URL='http://localhost:8000/swagger.yaml' redocly/redoc

Serve local file:

    docker run -it --rm -p 80:80 \
      -v $(pwd)/demo/swagger.yaml:/usr/share/nginx/html/swagger.yaml \
      -e SPEC_URL=swagger.yaml redocly/redoc

## Runtime configuration options

- `PAGE_TITLE` (default `"ReDoc"`) - page title
- `PAGE_FAVICON` (default `"favicon.png"`) - URL to page favicon
- `SPEC_URL` (default `"http://petstore.swagger.io/v2/swagger.json"`) - URL to spec
- `PORT` (default `80`) - nginx port
- `REDOC_OPTIONS` - [`<redoc>` tag attributes](https://github.com/Redocly/redoc#redoc-tag-attributes)

## Build

    docker build -t redocly/redoc .
