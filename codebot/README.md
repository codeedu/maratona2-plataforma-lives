<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="http://maratona.fullcycle.com.br/public/img/logo-maratona.png"/></a>
</p>

## Microsserviço CodeBot

Esse microsserviço tem o objetivo de responder comandos pontuais que serão encaminhados via chat através do microsserviço de streaming.

## Recursos utilizados

Esse microsserviço foi desenvolvido em Go Lang. O mesmo disponibiliza um servidor gRPC através da porta 50051.

## Rodar a aplicação

Para rodar a aplicação basta utilizar o docket-compose.

```
docker-compose up -d
```

Para testar fazer chamadas gRPC recomendamos que baixe o [Evans](https://github.com/ktr0731/evans) e execute:

```
evans -r -p 50051
``` 