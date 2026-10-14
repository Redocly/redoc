var redocUrl = Environment.GetEnvironmentVariable("REDOC_URL")
    ?? "https://cdn.jsdelivr.net/npm/redoc@latest/bundles/redoc.standalone.js";

const string cafe = "https://cdn.jsdelivr.net/gh/Redocly/redoc@1f67fe5ae769910c1144d76ac0786bcb5499d712/demo/cafe.yaml";

var app = WebApplication.CreateBuilder(args).Build();

app.MapGet("/", () => Results.Content($$"""
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Cafe API - Redoc</title>
        <style>body { margin: 0; }</style>
      </head>
      <body>
        <redoc spec-url="{{cafe}}"></redoc>
        <script type="module" src="{{redocUrl}}"></script>
      </body>
    </html>
    """, "text/html; charset=utf-8"));

app.Run("http://0.0.0.0:8080");
