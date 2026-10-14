<?php

use Illuminate\Support\Facades\Route;

const CAFE = 'https://cdn.jsdelivr.net/gh/Redocly/redoc@1f67fe5ae769910c1144d76ac0786bcb5499d712/demo/cafe.yaml';

Route::get('/', fn () => view('docs', [
    'cafe' => CAFE,
    'redocUrl' => env('REDOC_URL', 'https://cdn.jsdelivr.net/npm/redoc@latest/bundles/redoc.standalone.js'),
]));
