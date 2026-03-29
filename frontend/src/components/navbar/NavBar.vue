<template>
  <nav class="navbar navbar-light bg-light" :class="globalStore.isEditing ? 'navbar-disabled' : ''">
    <div class="container-fluid">
      <RouterLink to="/" class="navbar-brand mb-0 h1">
        <img src="/assets/img/logo-my-routes-text.svg" alt="logo" height="30" />
      </RouterLink>
      <div class="d-flex">
        <div class="mt-1">{{ auth.userName }}</div>
        <!-- User Dropdown -->
        <div v-if="!auth.isAuthenticated" class="dropdown">
          <OptionBtn
            class="ms-3"
            id="dropdownLoginButton"
            data-bs-toggle="dropdown"
            data-bs-auto-close="outside"
            aria-expanded="false"
            :tooltip="t('navBar.tooltip.login')"
            @click="auth.form = 'login'"
          >
            <LoginIcon class="icon" />
          </OptionBtn>
          <div class="dropdown-menu dropdown-menu-end mt-1" aria-labelledby="dropdownLoginButton">
            <div v-if="auth.form === 'login'">
              <LoginForm />
            </div>
            <div v-else-if="auth.form === 'recover'">
              <RecoverForm />
            </div>
            <div v-else-if="auth.form === 'register'">
              <RegisterForm />
            </div>
          </div>
        </div>

        <!-- Logout Button -->
        <OptionBtn
          v-if="auth.isAuthenticated"
          class="ms-3"
          :tooltip="t('navBar.tooltip.logout')"
          @click="onLogout"
        >
          <LogoutIcon class="icon" />
        </OptionBtn>

        <!-- Menu Dropdown -->
        <div class="dropdown">
          <OptionBtn
            class="ms-3"
            id="dropdownMenuButton"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            :tooltip="t('navBar.tooltip.menu')"
            @click="$emit('selectedOptionLogin')"
          >
            <span class="navbar-toggler-icon icon"></span>
          </OptionBtn>
          <ul
            class="dropdown-menu dropdown-menu-end mt-1 pt-0"
            aria-labelledby="dropdownMenuButton"
          >
            <li>
              <h2 class="dropdown-header bg-primary bg-opacity-50 text-light">Menu</h2>
            </li>
            <li>
              <RouterLink :to="{ name: 'home' }" class="dropdown-item">
                <MapIcon class="icon" />
                <span class="menu-label">{{ t('navBar.home') }}</span>
              </RouterLink>
            </li>
            <li>
              <hr class="dropdown-divider" />
            </li>
            <li>
              <RouterLink :to="{ name: 'users' }" class="dropdown-item" v-if="auth.isAdmin">
                <PeopleIcon class="icon" />
                <span class="menu-label">{{ t('navBar.usersManagement') }}</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink
                :to="{ name: 'tracks' }"
                class="dropdown-item"
                :class="!auth.isAuthenticated ? 'disabled' : ''"
              >
                <MapIcon class="icon" />
                <span class="menu-label">{{ t('navBar.trackManagement') }}</span>
              </RouterLink>
            </li>
            <li>
              <RouterLink :to="{ name: 'configuration' }" class="dropdown-item">
                <GearIcon class="icon" />
                <span class="menu-label">{{ t('navBar.configuration') }}</span>
              </RouterLink>
            </li>
            <li>
              <hr class="dropdown-divider" />
            </li>
            <li>
              <RouterLink :to="{ name: 'about' }" class="dropdown-item">
                <InfoIcon class="icon" />
                <span class="menu-label">{{ t('navBar.about') }}</span>
              </RouterLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
  <!-- if there is an edit in progress, the navbar will be disabled -->
  <div v-if="globalStore.isEditing" class="navbar-filter-disabled"></div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
import { useI18n } from 'vue-i18n';

import { confirm, showError, showOk } from '@/utils/dialog';
import { useAuthStore } from '../../stores/authStore';
import { useGlobalStore } from '../../stores/globalStore';
import { useTrackStore } from '@/stores/trackStore';
import { useUserStore } from '@/stores/userStore';
import GearIcon from '../icons/IconGear.vue';
import InfoIcon from '../icons/IconInfo.vue';
import LoginForm from '../authentication/LoginForm.vue';
import LoginIcon from '../icons/IconLogin.vue';
import LogoutIcon from '../icons/IconLogout.vue';
import MapIcon from '../icons/IconMap.vue';
import OptionBtn from '../shared/OptionBtn.vue';
import PeopleIcon from '../icons/IconPeople.vue';
import RecoverForm from '../authentication/RecoverForm.vue';
import RegisterForm from '../authentication/RegisterForm.vue';
import router from '../../router';

const { t } = useI18n();
const auth = useAuthStore();
const globalStore = useGlobalStore();
const trackStore = useTrackStore();
const userStore = useUserStore();

async function onLogout() {
  const result = await confirm(
    t('navBar.onLogout.question.title'),
    t('navBar.onLogout.question.text'),
    t('navBar.onLogout.question.confirmButtonText'),
    t('navBar.onLogout.question.cancelButtonText'),
  );

  if (result.isConfirmed) {
    const result = await auth.logout();
    userStore.$reset();
    trackStore.$reset();
    if (result.ok) {
      showOk(t('navBar.onLogout.success.title'), '', 1000);
    } else {
      showError(result.message);
    }
    router.push('/');
  }
}
</script>

<style scoped>
.navbar {
  /* offset-x | offset-y | blur-radius | spread-radius | color */
  box-shadow: var(--navbar-shadow);
  height: 3rem;
  padding: 0.25rem;
  z-index: 3;
}
.navbar-disabled {
  opacity: 0.5;
}

.navbar-filter-disabled {
  background-color: var(--navbar-disabled-filter-background-color);
  cursor: not-allowed;
  height: 3rem;
  left: 0;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 4;
}

.icon {
  width: 1.2rem;
  height: 1.2rem;
}

.menu-label {
  align-items: center;
  margin-left: 1rem;
}

.dropdown-menu {
  background-color: var(--navbar-dropdown-menu-background-color);
}
</style>
