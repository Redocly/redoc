package com.example.cafedocs;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RedocController {

  private static final String CAFE =
      "https://cdn.jsdelivr.net/gh/Redocly/redoc@1f67fe5ae769910c1144d76ac0786bcb5499d712/demo/cafe.yaml";

  @Value("${redoc.url}")
  private String redocUrl;

  @GetMapping(value = "/", produces = MediaType.TEXT_HTML_VALUE)
  public String docs() {
    return """
        <!doctype html>
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
        """.formatted(CAFE, redocUrl);
  }
}
