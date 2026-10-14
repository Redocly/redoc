FROM rust:1-alpine AS build
WORKDIR /app
COPY . .
RUN cargo build --release

FROM alpine:3.21
COPY --from=build /app/target/release/redoc-example-rust /server
EXPOSE 8080
CMD ["/server"]
