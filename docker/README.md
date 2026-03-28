# MyRoutes.Docker

## Translations

- [ES Español](./README.es.md)

## Introduction

This project allows you to quickly deploy the application using various Docker containers, with sample data.
The web application **MyRouter** consists of the [backend](https://github.com/sbarquero/MyRoutes.Back) and the [frontend](https://github.com/sbarquero/MyRoutes.Front). It requires a MongoDB database, which can also be run in a container.

## Requirements

- Have Docker Engine installed

  - [Docker Engine Installation](https://docs.docker.com/engine/install/)

## Steps

### Start up

The way to start the application is very simple. First we go to the directory where the `docker-compose.yml` file is located and then we start the containers.

The commands are:


```sh
cd <repository-directory>
docker compose up -d
```

This will start several containers for us:

![Docker containers](assets/containers.png)

#### Started containers

| Containers     | Description                 | Port  | Repository link |
|----------------|-----------------------------|:------:|-----------------------|
| myroutes.front | Aplication Frontend         | 8080  | [sbarquero/myroutes.front](https://hub.docker.com/r/sbarquero/myroutes.front) |
| myroutes.back  | API Backend of the app      | 3000  | [sbarquero/myroutes.back](https://hub.docker.com/r/sbarquero/myroutes.back) |
| mongodb        | MongoDB Server              | 27018 | [mongo](https://hub.docker.com/_/mongo) |
| mongo-express  | Web based MongoDB administration interface | 8081 | [mongo-express](https://hub.docker.com/_/mongo-express) |

### Insertion of the demo data to the database

If it is the first time we start the database will be without content. We can copy a backup that exists in the [mongobackups](./mongobackups/) directory.

The steps to follow are:

#### Change to the directory where `docker-compose.yml` is
```sh
cd <repository-directory>
```

#### Copy backup files to the `mongodb` container

Command:
```sh
docker container cp .\mongobackups\ mongodb:/var/backups/mongobackups
```

#### Open terminal in `mongodb` container.

Command:
```sh
docker exec -it mongodb bash
```

#### Restore backup to database.

In the terminal run the following command:
```sh
mongorestore --uri="mongodb://myUserAdmin:Mongo1234@localhost:27017/?authSource=admin&readPreference=primary&directConnection=true&ssl=false" --nsInclude=myroutes.* --drop /var/backups/mongobackups/
```

#### Database check

We can check the creation of the database by opening the `mongo-express` page in the browser with the following address:

```
http://localhost:8081
```

### Start the web application

```
http://localhost:8080
```

To log in we can use the data that appears in the following screenshot:

![User login](assets/login-en.png)
