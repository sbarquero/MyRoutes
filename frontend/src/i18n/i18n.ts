import { createI18n } from 'vue-i18n';
import en from './messages/en.json';
import es from './messages/es.json';

const i18n = createI18n({
  locale: 'es', // set locale
  fallbackLocale: 'en', // set fallback locale
  messages: { en, es }, // set locale messages
  datetimeFormats: {
    es: {
      short: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      },
      long: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      },
    },
    en: {
      short: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      },
      long: {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      },
    },
  },
});

export default i18n;
