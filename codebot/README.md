<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="http://maratona.fullcycle.com.br/public/img/logo-maratona.png"/></a>
</p>

## Microsserviço CodeBot

Esse microsserviço tem o objetivo de responder comandos pontuais que serão encaminhados via chat através do microsserviço de streaming.

## Recursos utilizados

Esse microsserviço foi desenvolvido em Go Lang. O mesmo disponibiliza um servidor gRPC através da porta 50051.

## Rodar a aplicação

Para rodar a aplicação basta criar um volume externo para o postgres e executar o docket-compose.

```
docker volume create pgdata
docker-compose up -d
```

Aguarde alguns minutos para dar tempo do postgres ficar online. Caso queira checar o status rode:

```
docker logs micro-codebot
```

Onde micro-codebot é o nome do container do bot. Caso você veja as migrations sendo aplicadas é porque o bot está pronto para uso.

Para testar fazer chamadas gRPC recomendamos que baixe o [Evans](https://github.com/ktr0731/evans) e execute:

```
evans -r -p 50051
``` 