package servers

import (
	"context"
	"fmt"
	"github.com/codeedu/maratona2-codebot/application/repositories"
	"github.com/codeedu/maratona2-codebot/domain"
	"github.com/codeedu/maratona2-codebot/framework/pb"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

type BotServer struct {
	BotRepository repositories.BotRepository
}

func NewBotServer(repository repositories.BotRepository) *BotServer {
	return &BotServer{BotRepository: repository}
}

func (b *BotServer) CreateBot(ctx context.Context, in *pb.NewBotRequest) (*pb.NewBotResponse, error) {

	bot, err := domain.NewBot(in.Bot.GetName(), in.Bot.GetDescription())

	if err != nil {
		return nil, status.Errorf(codes.InvalidArgument, "Error during the validation: %v", err)
	}

	var commands []*domain.CommandBot

	for _, command := range in.Bot.GetCommand() {
		newCmd := domain.NewCommandBot(command.Command, command.Answer, *bot)
		commands = append(commands, newCmd)
	}

	bot.BotCommands = commands

	newBot, err := b.BotRepository.Insert(bot)

	if err != nil {
		return nil, status.Errorf(codes.Internal, "Error persisting information: %v", err)
	}

	return &pb.NewBotResponse{
		BotId: newBot.ID,
	}, nil

}

func (b *BotServer) Answer(ctx context.Context, in *pb.AnswerRequest) (*pb.AnswerResponse, error) {

	fmt.Println(in.GetBotName(), in.GetCommand())

	bot, err := b.BotRepository.FindByNameAndCommand(in.BotName, in.Command)

	if err != nil {
		return nil, status.Errorf(codes.NotFound, "Bot or command does not exist: %v", err)
	}

	if len(bot.BotCommands) == 0 {
		return nil, status.Errorf(codes.NotFound, "Command does not exist: %v", err)
	}

	return &pb.AnswerResponse{
		Answer: bot.BotCommands[0].Answer,
	}, nil

}
