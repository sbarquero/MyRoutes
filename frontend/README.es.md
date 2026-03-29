# MyRoutes.Front

## Traducciones

- [EN English](./README.md)

Esta es la aplicación **Vue.js** del proyecto **MyRoutes**.

## Requerimientos del proyecto

**Nota:** Funciona con `Node JS` versión **16.20.2**, **18.19.1**, **20.11.1**.

## Configuración del proyecto

### Instalacion de dependencias
Esto instala todos los paquetes necesarios.
```sh
npm install
```

### Configuración del entorno
Tenemos que configurar el archivo de entorno. Podemos ver un ejemplo en el archivo ```.env.example```.

```conf
# Environment file example

# Auth API
VITE_AUTH_BASE_URL=http://localhost:3000/auth

# User API
VITE_USER_BASE_URL=http://localhost:3000/user

# File API
VITE_FILE_BASE_URL=http://localhost:3000/file

# Track API
VITE_TRACK_BASE_URL=http://localhost:3000/track

# Configuration API
VITE_CONFIGURATION_BASE_URL=http://localhost:3000/Configuration

# MapBox Access token
# See: https://docs.mapbox.com/help/getting-started/access-tokens/
VITE_MAPBOX_ACCESS_TOKEN=Here_goes_your_MapBox_access_token

# Encryptation password
VITE_ENCRYPTATION_PASSWORD=Here_goes_your_encryptation_password
```
Para uso local en modo de desarrollo, el archivo se nombrará como `.env.local`.

### Compilación y recarga en caliente para el desarrollo

```sh
npm run dev
```

### Comprobación de tipo, compilación y minificación para producción

```sh
npm run build
```

### Lint con [ESLint](https://eslint.org/)

```sh
npm run lint
```

## Configuración IDE recomendada

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (y desactivar Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Soporte de tipos para importaciones `.vue` en TS

TypeScript no puede manejar la información de tipo para las importaciones `.vue` de forma predeterminada, por lo que reemplazamos el CLI `tsc` con `vue-tsc` para la verificación de tipo. En editores, necesitamos [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) para que el servicio de lenguaje TypeScript sea consciente en los tipos `.vue`.

Si el complemento TypeScript independiente no le parece lo suficientemente rápido, Volar también ha implementado un [Modo Take Over](https://github.com/johnsoncodehk/volar/discussions/471#discussioncomment-1361669) que es más eficaz. Puede habilitarlo siguiendo los siguientes pasos:

1. Deshabilitar la extensión integrada de TypeScript
    1) Ejecutar `Extensions: Show Built-in Extensions` desde la paleta de comandos de VSCode
    2) Encontrar `TypeScript and JavaScript Language Features`, clic derecho y seleccione `Disable (Workspace)`
2. Vuelva a cargar la ventana de VSCode ejecutando `Developer: Reload Window` desde la paleta de comandos.

## Personalizar configuración

Ver [Vite Configuration Reference](https://vitejs.dev/config/).

## Gestión con Docker

### Crear imagen Docker

Para crear la imagen Docker, se ha empleado el siguiente comando:

```
docker build -t sbarquero/myroutes.front:1.1.11 .
docker build -t sbarquero/myroutes.front:latest .
```

### Subir imagen al repositorio

Para subir la imagen a Docker, se empleado el siguiente comando:

```
docker push sbarquero/myroutes.front:1.1.11
docker push sbarquero/myroutes.front:latest
```

### Puesta en marcha del frontend en contenedor Docker

Ejecutando el siguiente comando, se levanta el contenedor necesario para poner en marcha el frontend.

El contenedor creado es:
  - `myroutes.front` - Frontend de Myroutes en contendor Nginx.

```
docker-compose up
```

### Puesta en marcha del back y front en contenedores Docker

Visite el proyecto [MyRoutes.Docker en Github](https://github.com/sbarquero/MyRoutes.Docker)
