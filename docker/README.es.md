# MyRoutes.Docker

## Traducciones

- [EN English](./README.md)

## Introducción

Este proyecto permite poner en marcha la aplicación utilizando distintos contenedores Docker, de una forma rápida y con unos datos de demostración.
La aplicación web **MyRouter** consta del [backend](https://github.com/sbarquero/MyRoutes.Back) y del [frontend](https://github.com/sbarquero/MyRoutes.Front) de la aplicación. Para su funcionamiento necesita de una base de datos sobre **MongoDB** que también se puede levantar en un contenedor.

## Requisitos

- Tener instalado Docker Engine

  - [Instalación de Docker Engine](https://docs.docker.com/engine/install/)

## Pasos

### Puesta en marcha

La forma de poner la aplicación en marcha es muy sencilla. Primero nos situamos en el directorio donde se encuentra el fichero `docker-compose.yml` y después arrancamos los contenedores.

Los comandos son:


```sh
cd <directorio-repositorio>
docker compose up -d
```

Esto nos arrancará varios contendores:

![Docker containers](assets/containers.png)

#### Contenedores arrancados

| Contenedor     | Descripción                 | Puerto | Enlace al repositorio |
|----------------|-----------------------------|:------:|-----------------------|
| myroutes.front | Frontend de la aplicación   | 8080   | [sbarquero/myroutes.front](https://hub.docker.com/r/sbarquero/myroutes.front) |
| myroutes.back  | Backend de la API de la app | 3000   | [sbarquero/myroutes.back](https://hub.docker.com/r/sbarquero/myroutes.back)   |
| mongodb        | Servidor MongoDB            | 27018  | [mongo](https://hub.docker.com/_/mongo)                                       |
| mongo-express  | Interfaz de administración MongoDB basada en web | 8081 | [mongo-express](https://hub.docker.com/_/mongo-express)    |

### Inserción de datos de demostración a la base de datos

Si es la primera vez de arrancamos la base de datos estará sin contenido. Podemos copiar un backup que existe en el directorio [mongobackups](./mongobackups/).

Los pasos a seguir son:

#### Cambiar al directorio donde esta `docker-compose.yml`
```sh
cd <directorio-repositorio>
```

#### Copiar ficheros backup al contenedor de `mongodb`

Comando:
```sh
docker container cp .\mongobackups\ mongodb:/var/backups/mongobackups
```

#### Abrir terminal en el contenedor `mongodb`.

Comando:
```sh
docker exec -it mongodb bash
```

#### Restaurar backup a la base de datos.

En el terminal ejecutar el siguiente comando:
```sh
mongorestore --uri="mongodb://myUserAdmin:Mongo1234@localhost:27017/?authSource=admin&readPreference=primary&directConnection=true&ssl=false" --nsInclude=myroutes.* --drop /var/backups/mongobackups/
```

#### Comprobación de la base de datos

Podemos comprobar la creación de la base de datos abriendo en el navegador la página de `mongo-express` con la siguiente dirección:

```
http://localhost:8081
```

### Iniciar la aplicación web

```
http://localhost:8080
```

Para iniciar sesión podemos utilizar los datos que nos aparece en la siguiente captura:

![User login](assets/login-es.png)
