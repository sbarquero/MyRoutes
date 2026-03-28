<template>
  <NavBar />
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useI18n } from 'vue-i18n';
import NavBar from './components/navbar/NavBar.vue';

const { locale } = useI18n();
const auth = useAuthStore();

onMounted(async () => {
  auth.init();
  locale.value = localStorage.getItem('locale') || 'es';
});
</script>

<style>
#app {
  margin: 0;
  padding: 0;
  font-weight: normal;
  height: 100vh;
  width: 100vw;
}
</style>
