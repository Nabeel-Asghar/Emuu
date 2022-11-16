#BUILDER STAGE 1
FROM golang:1.19-alpine as builder

ENV APP emuu
ENV CMD_MAIN main/main.go

WORKDIR $GOPATH/src/${APP}
COPY . .

# Get dependancies - will also be cached if we won't change mod/sum
RUN go mod tidy
RUN go mod verify
RUN go mod vendor

# Build
RUN go build -o /${APP} $GOPATH/src/${APP}/${CMD_MAIN}

#BUILDER STAGE 2
FROM alpine:3.9

ENV APP emuu
ENV FB_CONFIG_FILE serviceAccountKey.json
ENV GO_CONFIG ./${FB_CONFIG_FILE}

COPY --from=builder /${APP} ./cmd/
COPY --from=builder /go/src/${APP}/${FB_CONFIG_FILE} ./${FB_CONFIG_FILE}

EXPOSE 8080

CMD ./cmd/${APP}