<template>
  <div class="dropdown">
    <button
      class="col-12 btn btn-white dropdown-toggle form-control text-start"
      type="button"
      id="dropdownLanguage"
      data-bs-toggle="dropdown"
      aria-expanded="false"
    >
      <span class="icon" v-html="selectedLanguage.icon"></span>
      <span class="ps-3"> {{ selectedLanguage.language }} ({{ selectedLanguage.locale }}) </span>
    </button>
    <ul class="dropdown-menu col-12" aria-labelledby="dropdownLanguage">
      <li v-for="lang in languages" :key="`locale-${lang.locale}`" :value="locale">
        <div class="dropdown-item bi-cursor" @click="onSelectLanguage(lang)">
          <span v-html="lang.icon" />
          <span class="ps-3">{{ lang.language }} ({{ lang.locale }})</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import languages from '@/i18n/messages/languages.json';

const { locale } = useI18n();

interface Language {
  locale: string;
  language: string;
  icon: string;
}

const selectedLanguage: Language = reactive({
  locale: '',
  language: '',
  icon: '',
});

onMounted(() => {
  selectedLanguage.locale = locale.value;
  selectedLanguage.language = languages.find(x => x.locale == locale.value)?.language || 'es';
  selectedLanguage.icon = languages.find(x => x.locale == locale.value)?.icon || '';
});

function onSelectLanguage(lang: Language) {
  selectedLanguage.locale = lang.locale;
  selectedLanguage.language = lang.language;
  selectedLanguage.icon = lang.icon;
  locale.value = lang.locale;
  localStorage.setItem('locale', lang.locale);
}
</script>

<style scoped>
.pointer {
  cursor: pointer;
}

#dropdownLanguage {
  border: 1px solid var(--dropdown-border-color);
}
</style>
