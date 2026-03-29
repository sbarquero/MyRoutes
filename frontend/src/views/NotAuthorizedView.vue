<template>
  <DefaultContainer background-image="/assets/img/not-authorized.jpg">
    <template #content>
      <div class="row h-100 d-flex justify-content-center align-content-center">
        <h1 class="col-12 display-1 text-center mb-5">
          {{ t('notAuthorized.message') }}
        </h1>
        <router-link :to="{ name: 'home' }" class="col-6 btn btn-primary btn-lg mt-5">
          {{ t('notAuthorized.goHomePage') }}
        </router-link>
      </div>
    </template>
  </DefaultContainer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import DefaultContainer from '@/components/shared/DefaultContainer.vue';

const { t } = useI18n();
</script>

<style lang="scss" scoped></style>
