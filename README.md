# Messaging App

A web app that allows users to send messages to each other.

## Technology Stack

Front End: ReactJS (from vite)

- Libraries: `react-router-dom axios`

Back End: ExpressJS

- Libraries: `express express-validator express-session bcryptjs jsonwebtoken
passport passport-jwt cors`

ORM: Prisma

- Libraries:
  - Development: `prisma`
  - Production: `@prisma/client`

DB: PostgreSQL

## Design

### Database

![Entity Relational Diagram](https://github.com/BradCodeCraft/odin-messaging-app/blob/main/designs/odin-messaging-app.png?raw=true)

### Pages

| URL                            | Description                              |
| ------------------------------ | ---------------------------------------- |
| /                              | Welcome Page                             |
| /signup                        | Sign Up Page                             |
| /login                         | Log In Page                              |
| /home                          | Home Page                                |
| /home/profile                  | Profile Page                             |
| /home/new                      | New Conversation Page                    |
| /home/:conversationId          | Conversation of id 'conversationId' Page |
| /home/:conversationId/messages | Messages in Conversation of id           |
|                                | 'conversationId' Page                    |

### Endpoints

> NOTE: **ALL** endpoints starts with `/api/v1`

| URL          | METHOD | DESCRIPTION                              |
| ------------ | ------ | ---------------------------------------- |
| /users       | GET    | Retrieves all users                      |
| /users       | POST   | Create new user                          |
| /users/login | POST   | Authenticates user and creates JWT token |

> NOTE: **ALL** endpoints requires a JWT token from authenticated user

| URL                           | METHOD | DESCRIPTION                   |
| ----------------------------- | ------ | ----------------------------- |
| /users/:userId                | GET    | Retrieves user of id 'userId' |
| /users/:userId                | PUT    | Updates user of id 'userId'   |
| /users/:userId/conversations  | GET    | Retrieves all conversations   |
|                               |        | by user of id 'userId'        |
| /users/:userId/conversations  | POST   | Creates new conversation      |
|                               |        | by user of id 'userId'        |
| /users/:userId/conversations/ | GET    | Retrieves conversation of id  |
| :conversationId               |        | 'conversationId' by user of   |
|                               |        | id 'userId'                   |
| /users/:userId/conversations/ | DELETE | Deletes conversation of id    |
| :conversationId               |        | 'conversationId' by user of   |
|                               |        | id 'userId'                   |
| /users/:userId/conversations/ | GET    | Retrieves all messages in     |
| :conversationId/messages      |        | conversation of id            |
|                               |        | 'conversationId' by user of   |
|                               |        | id 'userId'                   |
| /users/:userId/conversations/ | POST   | Creates messages in           |
| :conversationId/messages      |        | conversation of id            |
|                               |        | 'conversationId' by user of   |
|                               |        | id 'userId'                   |
| /users/:userId/conversations/ | GET    | Retrieves message of id       |
| :conversationId/messages/     |        | 'messageId' in conversation   |
| :messageId                    |        | of id 'conversationId' by     |
|                               |        | user of id 'userId'           |
| /users/:userId/conversations/ | PUT    | Updates message of id         |
| :conversationId/messages/     |        | 'messageId' in conversation   |
| :messageId                    |        | of id 'conversationId' by     |
|                               |        | user of id 'userId'           |
| /users/:userId/conversations/ | DELETE | Deletes message of id         |
| :conversationId/messages/     |        | 'messageId' in conversation   |
| :messageId                    |        | of id 'conversationId' by     |
|                               |        | user of id 'userId'           |
