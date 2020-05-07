<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="http://maratona.fullcycle.com.br/public/img/logo-maratona.png"/></a>
</p>

## Descrição

Maratona FullCycle 2.0

Microsserviço de Chat com Nest.js + Socket.io + Redis

## Rodar a aplicação

#### Antes de começar

O microsserviço de chat necessita que os microsserviços de **Live-Manager** e **CodeBot** já esteja rodando antes de inicia-lo.
Se você não o tem, acesse-os aqui: 

[Live-Manager](https://github.com/codeedu/maratona-streaming/micro-live-manager)
[CodeBot](https://github.com/codeedu/maratona-streaming/maratona-codebot)

#### Para quem usar Docker Professional no Windows

As versões maiores que 2.2 estão apresentando problemas com compartilhamento de volumes, notificações de modificações entre
o container e a máquina, entre outros problemas.

Portanto, não recomendamos usar estas versões no momento, use a 2.1.0.5, baixe-a neste [link](https://t.co/wK5Ai3fTfn?amp=1).

#### Rodar o RabbitMQ

Clone o projeto de configuração Docker do RabbitMQ neste [link](https://github.com/codeedu/maratona-streaming/rabbitmq.git). Rode ```docker-compose up -d```.

#### Crie os containers com Docker

```bash
$ chmod +x ./.docker/entrypoint.sh # Somente para ambiente Unix

$ dos2unix ./.docker/entrypoint.sh # Somente para Windows (funciona somente no terminal Git Bash)

$ docker-compose up
```

### Importante

É necessário criar uma live no Live-Generator para gerar um link de acesso e abrir a live com o Live-Streaming 
para testar o chat.
