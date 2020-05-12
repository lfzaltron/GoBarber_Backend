# GoBarber Backend

Go Barber is an app made for barbers's clients.

The goal of this app is give a way to clients make appointments with specific barbers.



The full project is made using NodeJS, ReactJS and ReactNative.

This is the backend's repository. The frontend and mobile app will be in different repositories

Feel free to give me suggestions.


# Requisitos:

## Recuperação de senha

**RF**

- O usuário deve poder recuperar sua senha informando o seu e-mail;
- O usuário deve receber instruções de recuperação de senha;
- O usuário deve poder resetar sua senha;

**RNF**

- Utilizar Mailtrap para testar envios de email em ambiente DEV;
- Utilizar Amazon SES para envios em produção;
- O envio de e-mails deve acontecer em segundo plano (background job);

**RN**

- O link enviado por e-mail para resetar a senha, deve expirar em 2h;
- O usuário precisa digitar duas vezes a nova senha;

## Atualização do perfil

**RF**

- O usuário deve poder atualizar seu nome, e-mail e senha;

**RN**

- O usuário não pode alterar o e-mail para um e-mail já utilizado;
- Para atualizar a senha, o usuário deve informar a senha antiga;
- Para atualizar a senha, o usuário precisa confirmar a nova senha;

## Painel do prestador

**RF**

- O usuário deve poder listar seus agendamentos por de um dia;
- O prestador deve receber uma notificação quando houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas;

**RNF**

- Os agendamentos do prestador no dia devem ser armazenados em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadas em tempo-real utilizando Socket.io

**RN**

- A notificação deve ter status de lida/não-lida;

## Agendamento de serviços

**RF**

- O usuário deve poder listar todos os prestadores cadastrados;
- O usuário deve poder listar os dias do mês com horários disponíveis de um prestador;
- O usuário deve poder listar horários disponíveis de um prestador em um dia;
- O usuário deve poder realizar um novo agendamento com um prestador;

**RNF**

- A listagem de prestadores deve ser armazenada em cache;

**RN**

- Cada agendamento deve ter duração de 1h;
- Os agendamentos devem estar disponíveis entre 8h e 18h (Primeiro às 8h e último às 17h);
- O usuário não pode agendar em um horário já ocupado;
- O usuário não pode agendar para horários passados;
- O usuário não pode agendar com ele mesmo como prestador;


