<template>
  <DefaultContainer backgroundImage="/assets/img/configuration.jpg">
    <template #title>{{ t('configurationView.title') }}</template>
    <template #content>
      <!-- Language -->
      <div class="card p-4">
        <div class="row">
          <h5 class="col-3 col-sm-2 my-auto">
            <label for="languageSelect"> {{ t('configurationView.language') }} </label>
          </h5>
          <div class="col-9 col-sm-6 col-md-4 col-lg-3">
            <LanguageSelector />
          </div>
        </div>
      </div>
      <div v-if="authStore.userId" class="col-12 mt-4">
        <UserConfiguration />
      </div>
    </template>
  </DefaultContainer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { useAuthStore } from '@/stores/authStore';
import DefaultContainer from '@/components/shared/DefaultContainer.vue';
import LanguageSelector from '@/components/configuration/LanguageSelector.vue';
import UserConfiguration from '@/components/configuration/UserConfiguration.vue';

const { t } = useI18n();

const authStore = useAuthStore();
</script>
