# MyRoutes

En este monorepositorio se reunen los distintos poyectos que existían anteriormente en repositorios por separado.

Consta de las siguientes carpetas:

| Carpetas ||
|----------|-----------|
| backend  | **API** en **Node.JS** |
| frontend | **Aplicación Vue.js** |
| docker   | Permite poner en marcha la aplicación utilizando distintos contenedores **Docker** |

## Arranque

Desde la raíz del repositorio se pueden usar los siguientes scripts:

```bash
npm install          # Instala las dependencias de la raíz (concurrently)
npm run install:all  # Instala las dependencias de backend y frontend
npm run dev          # Arranca backend y frontend simultáneamente (usa concurrently)
npm run dev:back     # Arranca solo el backend
npm run dev:front    # Arranca solo el frontend
```

> Para una primera puesta en marcha ejecutar `npm install` y `npm run install:all` antes de arrancar.
