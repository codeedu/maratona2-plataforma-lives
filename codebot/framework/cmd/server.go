package main

import (
	"flag"
	"fmt"
	"github.com/codeedu/maratona2-codebot/application/repositories"
	"github.com/codeedu/maratona2-codebot/framework/pb"
	"github.com/codeedu/maratona2-codebot/framework/servers"
	"github.com/codeedu/maratona2-codebot/framework/utils"
	"github.com/jinzhu/gorm"
	"github.com/joho/godotenv"
	"google.golang.org/grpc"
	"google.golang.org/grpc/reflection"
	"log"
	"net"
	"os"
)

var db *gorm.DB

func init() {
	err := godotenv.Load()

	if err != nil {
		log.Fatalf("Error loading .env file")
	}
}

func main() {
	db = utils.ConnectDB(os.Getenv("env"))

	port := flag.Int("port", 0, "the server port")
	flag.Parse()
	log.Printf("start server on port %d", *port)

	botRepository := repositories.BotRepositoryDb{Db:db}
	botServer := servers.NewBotServer(botRepository)

	grpcServer := grpc.NewServer()
	pb.RegisterBotServiceServer(grpcServer, botServer)
	reflection.Register(grpcServer)

	address := fmt.Sprintf("0.0.0.0:%d", *port)
	listener, err := net.Listen("tcp", address)
	if err != nil {
		log.Fatal("cannot start server: ", err)
	}

	err = grpcServer.Serve(listener)
	if err != nil {
		log.Fatal("cannot start server: ", err)
	}
}