<template>
  <form class="px-4 py-3" style="min-width: 300px">
    <div class="form-floating mt-2">
      <!-- Email -->
      <input
        autocomplete="new-email"
        type="text"
        class="form-control"
        id="usrcorr"
        :placeholder="t('loginForm.emailPlaceholder')"
        v-model="userForm.email"
      />
      <label for="usrcorr" class="form-label">{{ t('loginForm.emailAddress') }}</label>
    </div>
    <!-- Password -->
    <div class="form-floating mt-4">
      <input
        autocomplete="new-password"
        type="password"
        class="form-control"
        id="passwordInput"
        :placeholder="t('loginForm.passwordPlaceholder')"
        v-model="userForm.password"
      />
      <label for="passwordInput" class="form-label">{{ t('loginForm.password') }}</label>
    </div>
    <!-- Remember me check -->
    <div class="form-check mt-2">
      <input
        class="form-check-input"
        id="rememberMe"
        type="checkbox"
        v-model="userForm.rememberMe"
      />
      <label for="rememberMe" class="form-check-label ms-0">
        {{ t('loginForm.rememberMe') }}
      </label>
    </div>
    <!-- Login button -->
    <button @click.prevent="onLogin" type="submit" class="btn btn-primary mt-3">
      {{ t('loginForm.loginButton') }}
    </button>
  </form>
  <div class="dropdown-divider"></div>
  <div class="dropdown-item" @click="auth.form = 'register'">{{ t('loginForm.registerLink') }}</div>
  <div class="dropdown-item" @click="auth.form = 'recover'">
    {{ t('loginForm.forgotPassword') }}
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import sjcl from 'sjcl';

import { showError, showOk } from '@/utils/dialog';
import { useAuthStore } from '@/stores/authStore';
import router from '@/router';

const encryptationPassword = import.meta.env.VITE_ENCRYPTATION_PASSWORD;

interface User {
  email: string;
  password: string;
}

const { t } = useI18n();
const auth = useAuthStore();

const userForm = reactive({
  email: '',
  password: '',
  rememberMe: false,
});

onMounted(() => {
  const rememberMe = localStorage.getItem('rememberMe');
  if (rememberMe && rememberMe === 'true') {
    userForm.rememberMe = true;
    userForm.email = localStorage.getItem('email') || '';
    const pwd = JSON.parse(atob(localStorage.getItem('password') || ''));
    userForm.password = sjcl.decrypt(encryptationPassword, pwd);
  } else {
    userForm.rememberMe = false;
    userForm.email = '';
    userForm.password = '';
  }
});

async function onLogin() {
  const user: User = {
    email: userForm.email,
    password: userForm.password,
  };
  const { ok, message } = await auth.login(user);

  if (!ok) {
    showError(t('loginForm.loginError'), message);
  } else {
    showOk(t('loginForm.loginOk'), message, 1500);
    if (userForm.rememberMe) {
      rememberUserCredentials();
    } else {
      forgetUserCredentials();
    }
  }

  const currentRoute = router.currentRoute.value.name;
  if (currentRoute === 'not-authorized') {
    router.push('/');
  }
}

function rememberUserCredentials() {
  localStorage.setItem('email', userForm.email);
  const pwd = sjcl.encrypt(encryptationPassword, userForm.password);
  localStorage.setItem('password', btoa(JSON.stringify(pwd)));
  localStorage.setItem('rememberMe', 'true');
}

function forgetUserCredentials() {
  localStorage.removeItem('email');
  localStorage.removeItem('password');
  localStorage.removeItem('rememberMe');
}
</script>

<style scoped></style>
