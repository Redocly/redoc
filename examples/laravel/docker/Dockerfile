FROM composer:2
WORKDIR /app
RUN --mount=type=cache,target=/tmp/cache \
    composer create-project laravel/laravel . --no-interaction --prefer-dist
COPY routes/web.php routes/web.php
COPY resources/views/docs.blade.php resources/views/docs.blade.php
EXPOSE 8000
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000", "--no-reload"]
