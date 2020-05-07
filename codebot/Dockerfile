FROM golang:1.14

COPY / /

WORKDIR /
COPY .env.example .env
RUN go build framework/cmd/server.go

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

EXPOSE 50051

CMD /wait && ./server -port 50051
#ENTRYPOINT ["./server","-port","50051"]
