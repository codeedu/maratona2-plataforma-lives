<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="http://maratona.fullcycle.com.br/public/img/logo-maratona.png"/></a>
</p>

## Descrição

Maratona FullCycle 2.0

Microsserviço de transmissão de lives

## Rodar a aplicação

#### Antes de começar

A aplicação foi construída utilizando os conceitos de microsserviços e arquitetada com Docker. 

Para roda-la será necessário basicamente rodar o comando **docker-compose up**.

Acesse cada microsserviço respectivamente e leia o README.md para ver mais detalhes de como rodar o microsserviço.

[Live-Manager](https://github.com/codeedu/maratona-streaming/micro-live-manager)
[CodeBot](https://github.com/codeedu/maratona-streaming/codebot)
[Live-Chat](https://github.com/codeedu/maratona-streaming/micro-live-chat)
[Live-Streaming](https://github.com/codeedu/maratona-streaming/micro-live-streaming)

#### Para quem usar Docker Professional no Windows

As versões maiores que 2.2 estão apresentando problemas com compartilhamento de volumes, notificações de modificações entre
o container e a máquina, entre outros problemas.

Portanto, não recomendamos usar estas versões no momento, use a 2.1.0.5, baixe-a neste [link](https://t.co/wK5Ai3fTfn?amp=1).
