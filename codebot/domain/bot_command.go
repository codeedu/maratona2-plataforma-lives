package domain

import uuid "github.com/satori/go.uuid"

type CommandBot struct {
	ID      string `valid:"notnull,uuid" gorm:"type:uuid"`
	Command string `valid:"notnull" gorm:"type:varchar(255)"`
	Answer  string `valid:"notnull" gorm:"type:varchar(255)"`
	BotID   string `gorm:"column:bot_id;type:uuid;not null" valid:"-"`
	Bot     Bot    `valid:"-"`
}

func (c *CommandBot) Process() (string, error) {
	return c.Answer, nil
}

func NewCommandBot(command string, answer string, bot Bot) *CommandBot {
	commandBot := &CommandBot{}
	commandBot.ID = uuid.NewV4().String()
	commandBot.Command = command
	commandBot.Answer = answer
	commandBot.Bot = bot
	commandBot.BotID = bot.ID
	return commandBot
}
