FROM golang:1-alpine AS build
WORKDIR /app
COPY . .
RUN CGO_ENABLED=0 go build -o /server .

FROM alpine:3.21
COPY --from=build /server /server
EXPOSE 8080
CMD ["/server"]
