import com.sun.net.httpserver.HttpServer;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

public class Main {

  private static final String DEFAULT_REDOC_URL =
      "https://cdn.jsdelivr.net/npm/redoc@latest/bundles/redoc.standalone.js";

  private static final String CAFE =
      "https://cdn.jsdelivr.net/gh/Redocly/redoc@1f67fe5ae769910c1144d76ac0786bcb5499d712/demo/cafe.yaml";

  public static void main(String[] args) throws Exception {
    String redocUrl = System.getenv().getOrDefault("REDOC_URL", DEFAULT_REDOC_URL);
    byte[] page = docsPage(redocUrl).getBytes(StandardCharsets.UTF_8);

    HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
    server.createContext("/", exchange -> {
      exchange.getResponseHeaders().add("Content-Type", "text/html; charset=utf-8");
      exchange.sendResponseHeaders(200, page.length);
      try (OutputStream body = exchange.getResponseBody()) {
        body.write(page);
      }
    });
    server.start();
    System.out.println("Redoc at http://localhost:8080");
  }

  private static String docsPage(String redocUrl) {
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
