<template>
  <div class="card">
    <div class="card-body pt-1 pb-0">
      <table class="table mb-0">
        <thead>
          <tr>
            <th scope="col">
              <b>{{ t('shared.userSession.sessionId') }}</b>
            </th>
            <th scope="col">
              <b>{{ t('shared.userSession.expireAt') }}</b>
            </th>
            <th scope="col" class="text-center">
              <b>{{ t('shared.userSession.reject') }}</b>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(session, index) in selectedUser.sessions" :key="session._id">
            <td>{{ session._id }}</td>
            <td>{{ d(session.expireAt, 'long') }}</td>
            <td class="button">
              <button
                type="button"
                class="btn btn-danger btn-sm"
                :title="t('shared.userSession.rejectButtonText')"
                :disabled="session._id === authStore.sessionId"
                @click="onRejectSession(session, index)"
              >
                <IconDelete />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import { showError, showOk } from '@/utils/dialog';
import { useAuthStore } from '@/stores/authStore';
import { useUserStore } from '@/stores/userStore';
import IconDelete from '../icons/IconDelete.vue';
import type { Session } from '@/interfaces/auth.interface';

const { t, d } = useI18n();

const authStore = useAuthStore();
const userStore = useUserStore();
const { selectedUser } = storeToRefs(userStore);

async function onRejectSession(session: Session, index: number) {
  const response = await authStore.rejectSession(userStore.selectedUser._id, session);
  if (response.ok) {
    showOk('Sesión cerrada', response.message);
    userStore.selectedUser.sessions.splice(index, 1);
  } else {
    showError('Error', response.message);
  }
}
</script>

<style scoped>
td {
  vertical-align: middle;
}
td.button {
  text-align: center;
}
</style>
