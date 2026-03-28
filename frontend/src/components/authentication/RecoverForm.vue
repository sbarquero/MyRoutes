<template>
  <form class="px-4 py-3" @submit.prevent novalidate style="min-width: 350px">
    <h5 class="mb-4">{{ t('recoverForm.title') }}</h5>
    <div class="form-floating mb-4 mt-2">
      <!-- Email -->
      <input
        type="email"
        class="form-control"
        :class="v$.email.$error ? 'is-invalid' : ''"
        id="email"
        :placeholder="t('recoverForm.emailPlaceholder')"
        v-model="userForm.email"
      />
      <label for="email" class="form-label">{{ t('recoverForm.emailAddress') }}</label>
      <div v-if="v$.email.$error" class="invalid-feedback">
        {{ v$.email.$errors[0].$message }}
      </div>
    </div>
    <div class="d-flex justify-content-between">
      <!-- Recover button -->
      <button @click.prevent="onRecover" class="btn btn-primary me-3">
        {{ t('recoverForm.recoverButton') }}
      </button>
      <!-- Cancel button -->
      <button @click.prevent="auth.form = 'login'" class="btn btn-light border-primary">
        {{ t('recoverForm.cancelButton') }}
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import useVuelidate from '@vuelidate/core';

import { showError, showOk } from '@/utils/dialog';
import { useAuthStore } from '@/stores/authStore';
import authApi from '@/api/authApi';
import { email, helpers, required } from '@vuelidate/validators';

const auth = useAuthStore();

const { t } = useI18n();
const userForm = ref({
  email: '',
});

const rules = {
  email: {
    required: helpers.withMessage(t('recoverForm.emailRequired'), required),
    email: helpers.withMessage(t('recoverForm.emailValid'), email),
  },
};

const v$ = useVuelidate(rules, userForm);

async function onRecover() {
  const validEmail = await v$.value.$validate();
  if (validEmail) {
    const { status, data } = await authApi.post('/recover', { email: userForm.value.email });
    if (status === 200) {
      showOk(t('recoverForm.instruction'));
    } else {
      showError(data.message);
    }
    auth.form = 'login';
  }
}
</script>

<style scoped></style>
