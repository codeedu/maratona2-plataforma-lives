package repositories_test

import (
	"github.com/asaskevich/govalidator"
	"github.com/bxcodec/faker/v3"
	"github.com/codeedu/maratona2-codebot/application/repositories"
	"github.com/codeedu/maratona2-codebot/domain"
	"github.com/codeedu/maratona2-codebot/framework/utils"
	"github.com/stretchr/testify/require"
	"log"
	"testing"
)

func TestBotRepositoryDb_Find(t *testing.T) {
	db := utils.ConnectDB("test")
	defer db.Close()

	repo := repositories.BotRepositoryDb{Db: db}
	newBot, err := domain.NewBot(faker.Word(), faker.Sentence())

	if err != nil {
		log.Fatalf("%v", err)
	}

	repo.Insert(newBot)

	res, _ := repo.Find(newBot.ID)

	require.NotEmpty(t, res.Name)
	require.True(t, govalidator.IsUUIDv4(res.ID))
}

func TestBotRepositoryDb_FindByNameAndCommand(t *testing.T) {
	db := utils.ConnectDB("test")
	defer db.Close()

	repo := repositories.BotRepositoryDb{Db: db}
	newBot, err := domain.NewBot(faker.Word(), faker.Sentence())

	command := domain.NewCommandBot("hello", "world", *newBot)
	commands := []*domain.CommandBot{}
	commands = append(commands, command)
	newBot.BotCommands = commands

	if err != nil {
		log.Fatalf("%v", err)
	}

	repo.Insert(newBot)

	res, _ := repo.Find(newBot.ID)

	require.NotEmpty(t, res.Name)
	require.True(t, govalidator.IsUUIDv4(res.ID))

	require.Equal(t, res.BotCommands[0].Answer, "world")
}
