<?php
$redocUrl = getenv('REDOC_URL') ?: 'https://cdn.jsdelivr.net/npm/redoc@latest/bundles/redoc.standalone.js';

$cafe = 'https://cdn.jsdelivr.net/gh/Redocly/redoc@1f67fe5ae769910c1144d76ac0786bcb5499d712/demo/cafe.yaml';
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Cafe API - Redoc</title>
    <style>body { margin: 0; }</style>
  </head>
  <body>
    <redoc spec-url="<?= htmlspecialchars($cafe) ?>"></redoc>
    <script type="module" src="<?= htmlspecialchars($redocUrl) ?>"></script>
  </body>
</html>
