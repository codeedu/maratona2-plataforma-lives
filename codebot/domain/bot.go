package domain

import (
	"github.com/asaskevich/govalidator"
	uuid "github.com/satori/go.uuid"
	"time"
)

func init() {
	govalidator.SetFieldsRequiredByDefault(true)
}

type Bot struct {
	ID          string        `valid:"notnull,uuid" gorm:"type:uuid"`
	Name        string        `valid:"notnull" gorm:"type:varchar(255)"`
	Description string        `valid:"notnull" gorm:"type:varchar(255)"`
	BotCommands []*CommandBot `valid:"-" gorm:"ForeignKey:BotID`
	CreatedAt   time.Time     `valid:"-"`
}

func NewBot(name string, description string) (*Bot, error) {
	bot := &Bot{
		Name:        name,
		Description: description,
	}

	if err := bot.Prepare(); err != nil {
		return nil, err
	}

	return bot, nil
}

func (bot *Bot) Prepare() error {
	bot.ID = uuid.NewV4().String()
	bot.CreatedAt = time.Now()

	if err := bot.validate(); err != nil {
		return err
	}

	return nil
}

func (bot *Bot) validate() error {
	_, err := govalidator.ValidateStruct(bot)

	if err != nil {
		return err
	}

	return nil
}
