package repositories

import (
	"fmt"
	"github.com/codeedu/maratona2-codebot/domain"
	"github.com/jinzhu/gorm"
)

type BotRepository interface {
	Insert(bot *domain.Bot) (*domain.Bot, error)
	Find(id string) (*domain.Bot, error)
	FindByNameAndCommand(botName string, command string) (*domain.Bot, error)
}

type BotRepositoryDb struct {
	Db *gorm.DB
}

func (repo BotRepositoryDb) Insert(bot *domain.Bot) (*domain.Bot, error) {

	fmt.Println(bot.BotCommands)

	err := repo.Db.Create(bot).Error

	if err != nil {
		return nil, err
	}

	return bot, nil
}

func (repo BotRepositoryDb) Find(id string) (*domain.Bot, error) {

	var bot domain.Bot
	repo.Db.Preload("BotCommands").First(&bot, "id = ?", id)

	if bot.ID == "" {
		return nil, fmt.Errorf("Bot does not exist")
	}

	return &bot, nil
}

func (repo BotRepositoryDb) FindByNameAndCommand(botName string, command string) (*domain.Bot, error) {

	var bot domain.Bot
	repo.Db.Preload("BotCommands", "command=?",command).First(&bot, "name = ?", botName)

	if bot.ID == "" {
		return nil, fmt.Errorf("Bot or command does not exist")
	}

	return &bot, nil
}
