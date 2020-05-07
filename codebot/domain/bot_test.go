package domain_test

import (
	"github.com/codeedu/maratona2-codebot/domain"
	"testing"
	"github.com/stretchr/testify/require"
	"github.com/bxcodec/faker/v3"
)

func TestNewBot(t *testing.T) {

	botName := faker.Word()
	botDescription := faker.Sentence()

	bot, err := domain.NewBot(botName, botDescription)
	require.Nil(t, err)
	require.Equal(t, bot.Name, botName)
	require.Equal(t, bot.Description, botDescription)
	require.NotNil(t, bot.ID)
	require.NotNil(t, bot.CreatedAt)

}
