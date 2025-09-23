# Messaging App

A web app that allows users to send messages to each other.

## Technology Stack

Front End: ReactJS (from vite)

- Libraries: `react-router-dom`

Back End: ExpressJS

- Libraries: `express express-validator express-session bcryptjs jsonwebtoken
passport passport-local passport-jwt pg cors`

ORM: Prisma

- Libraries:
  - Development: `prisma`
  - Production: `@prisma/client`

DB: PostgreSQL

## Design

### Database

![Entity Relational Diagram](https://github.com/BradCodeCraft/odin-messaging-app/blob/main/designs/odin-messaging-app.png?raw=true)

### Pages

| URL           | Description      |
| ------------- | ---------------- |
| /             | Welcome Page     |
| /signup       | Sign Up Page     |
| /login        | Log In Page      |
| /home         | Home Page        |
| /home/profile | Profile Page     |
| /home/new     | New Message Page |
| /home/edit    | New Message Page |

### Endpoints

> NOTE: **ALL** endpoints starts with `/api/v1`

| URL          | METHOD | DESCRIPTION         |
| ------------ | ------ | ------------------- |
| /users       | GET    | Retrieves all users |
| /users       | POST   | Create new user     |
| /users/login | POST   | Authenticates user  |

> NOTE: **ALL** endpoints requires authenticated user

| URL                                | METHOD | DESCRIPTION                   |
| ---------------------------------- | ------ | ----------------------------- |
| /users/:userId                     | GET    | Retrieves user of id 'userId' |
| /users/:userId                     | PUT    | Updates user of id 'userId'   |
| /users/:userId/                    | GET    | Retrieves user of id 'userId' |
| /users/:userId/received            | GET    | Retrieves received messages   |
|                                    |        | by user of id 'userId'        |
| /users/:userId/sent                | GET    | Retrieves sent messages by    |
|                                    |        | user of id 'userId'           |
| /users/:userId/messages            | GET    | Retrieves all messages by     |
|                                    |        | user of id 'userId'           |
| /users/:userId/messages            | POST   | Create new message of         |
|                                    |        | user of id 'userId'           |
| /users/:userId/messages/:messageId | GET    | Retrieves all messages of     |
|                                    |        | id 'messageId' by user of     |
|                                    |        | id 'userId'                   |
| /users/:userId/messages/:messageId | PUT    | Updates message of id         |
|                                    |        | 'messageId' by user of id     |
|                                    |        | 'userId'                      |
| /users/:userId/messages/:messageId | DELETE | Deletes message of id         |
|                                    |        | 'messageId' by user of id     |
|                                    |        | 'userId'                      |
