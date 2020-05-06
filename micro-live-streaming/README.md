<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="http://maratona.fullcycle.com.br/public/img/logo-maratona.png"/></a>
</p>

## Descrição

Maratona FullCycle 2.0

Microsserviço de transmissão de lives construído com React.js + WebRTC + Socket.io + Peer.js

## Rodar a aplicação

#### Antes de começar

O microsserviço de transmissão de lives necessita que os microsserviços de Live-Manager e Live-Chat já estejam rodando antes de inicia-lo.
Se você não os tem, acesse-os aqui: 

[Live-Manager](https://github.com/codeedu/maratona-streaming/micro-live-manager)

[Live-Chat](https://github.com/codeedu/maratona-streaming/micro-live-chat)


#### Para quem usar Docker Professional no Windows

As versões maiores que 2.2 estão apresentando problemas com compartilhamento de volumes, notificações de modificações entre
o container e a máquina, entre outros problemas.

Portanto, não recomendamos usar estas versões no momento, use a 2.1.0.5, baixe-a neste [link](https://t.co/wK5Ai3fTfn?amp=1).  

#### Crie os containers com Docker

```bash
$ chmod +x ./.docker/entrypoint.sh # Somente para ambiente Unix

$ dos2unix ./.docker/entrypoint.sh # Somente para Windows (funciona somente no terminal Git Bash)

$ docker-compose up
```

#### Accesse no browser

```
http://localhost:3002
```

### Importante

É necessário criar uma live no Live-Manager para gerar um link de acesso
