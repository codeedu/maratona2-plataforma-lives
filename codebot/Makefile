gen:
	protoc --proto_path=proto proto/*.proto --go_out=plugins=grpc:framework/pb

clean:
	rm framework/pb/*.go

server:
	go run framework/cmd/server.go -port 8080

client:
	go run framework/cmd/client/main.go -address 0.0.0.0:8080

test:
	go test -race ./...

.PHONY: gen clean server client test