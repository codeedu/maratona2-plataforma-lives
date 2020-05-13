<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="http://maratona.fullcycle.com.br/public/img/logo-maratona.png"/></a>
</p>

## Descrição

Maratona FullCycle 2.0

Microsserviço de administração de lives com Nest.js + Socket.io + Redis + gRPC + PeerServer + React.js

## Rodar a aplicação

#### Antes de começar

Este microsserviço deve ser o primeiro a ser iniciado com o Docker. Depois inicie os microsserviço Live-Chat e Live-Streaming respectivamente.
Se você não o tem, acesse-os aqui: 

[Live-Chat](https://github.com/codeedu/maratona-streaming/micro-live-chat)
[Live-Streaming](https://github.com/codeedu/maratona-streaming/micro-live-streaming)

#### Para quem usar Docker Professional no Windows

As versões maiores que 2.2 estão apresentando problemas com compartilhamento de volumes, notificações de modificações entre
o container e a máquina, entre outros problemas.

Portanto, não recomendamos usar estas versões no momento, use a 2.1.0.5, baixe-a neste [link](https://t.co/wK5Ai3fTfn?amp=1).

#### Crie os containers com Docker

```bash
$chmod +x ./backend/.docker/entrypoint.sh # Somente para ambiente Unix 
$chmod +x ./frontend/.docker/entrypoint.sh # Somente para ambiente Unix

$ dos2unix ./backend/.docker/entrypoint.sh # Somente para Windows (funciona somente no terminal Git Bash)
$ dos2unix ./frontend/.docker/entrypoint.sh # Somente para Windows (funciona somente no terminal Git Bash)

$ docker-compose up
```

#### Accesse no browser

```
http://localhost:3001
```


### Importante

Crie uma live para iniciar o processo de transmissão de uma live
