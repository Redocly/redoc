package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

const defaultRedocURL = "https://cdn.jsdelivr.net/npm/redoc@latest/bundles/redoc.standalone.js"

const cafe = "https://cdn.jsdelivr.net/gh/Redocly/redoc@1f67fe5ae769910c1144d76ac0786bcb5499d712/demo/cafe.yaml"

const pageTemplate = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Cafe API - Redoc</title>
    <style>body { margin: 0; }</style>
  </head>
  <body>
    <redoc spec-url="%s"></redoc>
    <script type="module" src="%s"></script>
  </body>
</html>
`

func main() {
	redocURL := os.Getenv("REDOC_URL")
	if redocURL == "" {
		redocURL = defaultRedocURL
	}
	page := fmt.Sprintf(pageTemplate, cafe, redocURL)

	http.HandleFunc("/", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "text/html; charset=utf-8")
		fmt.Fprint(w, page)
	})
	log.Println("Redoc at http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
