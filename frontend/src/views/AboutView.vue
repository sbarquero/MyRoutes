<template>
  <DefaultContainer background-image="/assets/img/about.jpg">
    <template #title>{{ t('aboutView.title') }}</template>
    <template #content>
      <div class="card mb-4 p-4 fs-4">
        <div id="info" class="row">
          <div class="col-12 text-center m-3">
            <img src="/assets/img/logo-my-routes-text.svg" alt="logo" height="100" />
          </div>
          <div class="info-item col-12 col-xl-5">
            <b>{{ t('aboutView.developedBy') }}</b> {{ author }}
          </div>
          <div class="info-item col-12 col-xl-3">
            <b>{{ t('aboutView.license') }}:</b> {{ license }}
          </div>
          <div class="info-item col-12 col-xl-4">
            <b>{{ t('aboutView.version') }}:</b> {{ version }} (12/2022)
          </div>
          <div class="info-item col-12 mt-4">
            {{ t('aboutView.viewOn') }}
            <img id="github-icon" src="/assets/img/github.svg" alt="Github" title="Github" />
            GitHub
            <a
              class="btn btn-outline-primary mx-3 px-5"
              href="https://github.com/sbarquero/MyRoutes.Front"
              target="_blank"
            >
              Front
            </a>
            <a
              class="btn btn-outline-primary mx-3 px-5"
              href="https://github.com/sbarquero/MyRoutes.Back"
              target="_blank"
              >Back</a
            >
          </div>
        </div>
      </div>
      <!-- Tecnologies used -->
      <div class="card mb-4 p-4">
        <h3>{{ t('aboutView.tecnologies') }}</h3>
        <div class="row mx-2 d-flex">
          <a href="https://nodejs.org/" target="_blank" class="item col-4 col-sm-3 col-lg-2">
            <img src="/assets/img/nodejs.svg" alt="NodeJS" title="NodeJS" />
          </a>
          <a href="https://vuejs.org/" target="_blank" class="item col-4 col-sm-3 col-lg-2">
            <img src="/assets/img/vuejs.svg" alt="VueJS" title="VueJS" />
          </a>
          <a href="https://leafletjs.com/" target="_blank" class="item col-4 col-sm-3 col-lg-2">
            <img src="/assets/img/leaflet.svg" alt="Leaflet" title="Leaflet" />
          </a>
          <a href="https://getbootstrap.com/" target="_blank" class="item col-4 col-sm-3 col-lg-2">
            <img src="/assets/img/bootstrap.svg" alt="Bootstrap" title="Bootstrap" />
          </a>
          <a href="https://sass-lang.com/" target="_blank" class="item col-4 col-sm-3 col-lg-2">
            <img src="/assets/img/sass.svg" alt="Sass" title="Sass" />
          </a>
          <a href="https://www.npmjs.com/" target="_blank" class="item col-4 col-sm-3 col-lg-2">
            <img src="/assets/img/npm.svg" alt="NPM" title="NPM" />
          </a>
          <a href="https://mongoosejs.com/" target="_blank" class="item col-4 col-sm-3 col-lg-2">
            <img src="/assets/img/mongoose.svg" alt="Mongoose" title="Mongoose" />
          </a>
          <a
            href="https://www.typescriptlang.org/"
            target="_blank"
            class="item col-4 col-sm-3 col-lg-2"
          >
            <img src="/assets/img/typescript.svg" alt="Typescript" title="Typescript" />
          </a>
          <a href="https://www.mapbox.com/" target="_blank" class="item col-4 col-sm-3 col-lg-2">
            <img src="/assets/img/mapbox.svg" alt="Mapbox" title="Mapbox" />
          </a>
          <a href="https://expressjs.com/" target="_blank" class="item col-4 col-sm-3 col-lg-2">
            <img src="/assets/img/express.svg" alt="Express" title="Express" />
          </a>
          <a href="https://eslint.org/" target="_blank" class="item col-4 col-sm-3 col-lg-2">
            <img src="/assets/img/eslint.svg" alt="ESLint" title="ESLint" />
          </a>
          <a href="https://axios-http.com/" target="_blank" class="item col-4 col-sm-3 col-lg-2">
            <img src="/assets/img/axios.svg" alt="Axios" title="Axios" />
          </a>
          <a href="https://vitejs.dev/" target="_blank" class="item col-4 col-sm-3 col-lg-2">
            <img src="/assets/img/vitejs.svg" alt="Vite JS" title="Vite JS" />
          </a>
          <a href="https://nodemon.io/" target="_blank" class="item col-4 col-sm-3 col-lg-2">
            <img src="/assets/img/nodemon.svg" alt="Nodemon" title="Nodemon" />
          </a>
          <a href="https://pinia.vuejs.org/" target="_blank" class="item col-4 col-sm-3 col-lg-2">
            <img src="/assets/img/pinia.svg" alt="Pinia" title="Pinia" />
          </a>
          <a href="https://prettier.io/" target="_blank" class="item col-4 col-sm-3 col-lg-2">
            <img src="/assets/img/prettier.svg" alt="Prettier" title="Prettier" />
          </a>
          <a href="https://turfjs.org/" target="_blank" class="item col-4 col-sm-3 col-lg-2">
            <img src="/assets/img/turf.png" alt="Turf" title="Turf" />
          </a>
          <a
            href="https://sweetalert2.github.io/"
            target="_blank"
            class="item col-4 col-sm-3 col-lg-2"
          >
            <img
              src="/assets/img/sweetalert2.png"
              alt="Sweetalert2"
              title="Sweetalert2"
              class="pb-4"
            />
          </a>
          <a
            href="https://www.openstreetmap.org/"
            target="_blank"
            class="item col-4 col-sm-3 col-lg-2"
          >
            <img src="/assets/img/openstreetmap.svg" alt="OpenStreetMap" title="OpenStreetMap" />
          </a>
          <a href="https://nodemailer.com/" target="_blank" class="item col-4 col-sm-3 col-lg-2">
            <img src="/assets/img/nodemailer.png" alt="Nodemailer" title="Nodemailer" class="p-3" />
          </a>
          <a href="https://swagger.io/" target="_blank" class="item col-4 col-sm-3 col-lg-2">
            <img src="/assets/img/swagger.svg" alt="Swagger" title="Swagger" />
          </a>
          <a
            href="https://kazupon.github.io/vue-i18n/"
            target="_blank"
            class="item col-4 col-sm-3 col-lg-2"
          >
            <img src="/assets/img/vue-i18n.png" alt="Vue I18n" title="Vue I18n" class="py-3" />
          </a>
          <a
            href="https://vuelidate-next.netlify.app/"
            target="_blank"
            class="item col-4 col-sm-3 col-lg-2"
          >
            <img src="/assets/img/vuelidate.png" alt="Vuelidate" title="Vuelidate" />
          </a>
          <a href="https://jwt.io/" target="_blank" class="item col-4 col-sm-3 col-lg-2">
            <img src="/assets/img/jwt.svg" alt="Json Web Token" title="Json Web Token" />
          </a>
        </div>
      </div>
      <!-- Tools used -->
      <div class="card mb-4 p-4">
        <h3>{{ t('aboutView.tools') }}</h3>
        <div class="row">
          <a
            href="https://code.visualstudio.com/"
            target="_blank"
            class="item col-4 col-sm-3 col-lg-2"
          >
            <img
              src="/assets/img/visualstudio-code.svg"
              alt="Visual Studio Code"
              title="Visual Studio Code"
            />
          </a>
          <a href="https://git-scm.com/" target="_blank" class="item col-4 col-sm-3 col-lg-2">
            <img src="/assets/img/git.svg" alt="Git" title="Git" />
          </a>
          <a href="https://www.mongodb.com/" target="_blank" class="item col-4 col-sm-3 col-lg-2">
            <img src="/assets/img/mongodb.svg" alt="Mongo DB" title="Mongo DB" />
          </a>
          <a
            href="http://gitextensions.github.io/"
            target="_blank"
            class="item col-4 col-sm-3 col-lg-2"
            style=""
          >
            <img
              src="/assets/img/git-extensions.png"
              alt="Git Extensions"
              title="Git Extensions"
              class="py-3"
            />
          </a>
          <a
            href="https://www.postman.com/"
            target="_blank"
            class="item col-4 col-sm-3 col-lg-2"
            style=""
          >
            <img src="/assets/img/postman.svg" alt="Postman" title="Postman" />
          </a>
        </div>
      </div>
      <!-- Vite environment variables -->
      <div class="card p-4">
        <h3>{{ t('aboutView.viteEnvVarTitle') }}</h3>
        <ul class="mb-0 mt-3">
          <li>
            meta.env.MODE: <b>{{ MODE }}</b>
          </li>
          <li>
            meta.env.BASE_URL: <b>{{ BASE_URL }}</b>
          </li>
          <li>
            meta.env.DEV: <b>{{ DEV }}</b>
          </li>
          <li>
            meta.env.PROD: <b>{{ PROD }}</b> (opposite of meta.env.DEV)
          </li>
        </ul>
      </div>
    </template>
  </DefaultContainer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { author, license, version } from '../../package.json';
import DefaultContainer from '@/components/shared/DefaultContainer.vue';

const { t } = useI18n();

const MODE = import.meta.env.MODE;
const BASE_URL = import.meta.env.BASE_URL;
const DEV = import.meta.env.DEV;
const PROD = import.meta.env.PROD;
</script>

<style scoped>
#info {
  display: flex;
  justify-content: space-between;
}
.info-item {
  display: inline;
}
.item {
  margin: auto;
  padding: 0 0.5rem;
  text-align: center;
}
.item img {
  height: 6rem;
  width: 100%;
}
#github-icon {
  height: 2rem;
  width: 2rem;
}
</style>
