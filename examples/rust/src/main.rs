use std::env;
use std::io::{BufRead, BufReader, Write};
use std::net::{TcpListener, TcpStream};
use std::time::Duration;

const DEFAULT_REDOC_URL: &str =
    "https://cdn.jsdelivr.net/npm/redoc@latest/bundles/redoc.standalone.js";

const CAFE: &str =
    "https://cdn.jsdelivr.net/gh/Redocly/redoc@1f67fe5ae769910c1144d76ac0786bcb5499d712/demo/cafe.yaml";

const PAGE: &str = r#"<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Cafe API - Redoc</title>
    <style>body { margin: 0; }</style>
  </head>
  <body>
    <redoc spec-url="{cafe}"></redoc>
    <script type="module" src="{redoc_url}"></script>
  </body>
</html>
"#;

fn main() {
    let redoc_url = env::var("REDOC_URL").unwrap_or_else(|_| DEFAULT_REDOC_URL.to_string());
    let page = PAGE.replace("{cafe}", CAFE).replace("{redoc_url}", &redoc_url);

    let listener = TcpListener::bind("0.0.0.0:8080").expect("port 8080 should be free");
    println!("Redoc at http://localhost:8080");
    for stream in listener.incoming().flatten() {
        respond(stream, &page);
    }
}

fn respond(mut stream: TcpStream, page: &str) {
    let _ = stream.set_read_timeout(Some(Duration::from_secs(5)));
    let mut lines = BufReader::new(&stream).lines();
    while let Some(Ok(line)) = lines.next() {
        if line.is_empty() {
            break;
        }
    }
    let response = format!(
        "HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=utf-8\r\nContent-Length: {}\r\nConnection: close\r\n\r\n{}",
        page.len(),
        page
    );
    let _ = stream.write_all(response.as_bytes());
}
