<template>
  <h3 class="mb-4 ms-1">{{ t('userView.userList.title') }}</h3>
  <div class="list-group">
    <UserListItem
      v-for="user in users"
      v-bind:key="user._id"
      @click="onUserSelect(user._id)"
      :class="
        user._id === userStore.selectedUser._id
          ? 'selected'
          : userStore.userEditing
          ? 'editing'
          : ''
      "
    >
      <template #name>{{ user.name }}</template>
      <template #email>{{ user.email }}</template>
    </UserListItem>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import { showError } from '@/utils/dialog';
import { useGlobalStore } from '@/stores/globalStore';
import { useUserStore } from '@/stores/userStore';
import UserListItem from './UserListItem.vue';

const { t } = useI18n();

const globalStore = useGlobalStore();
const userStore = useUserStore();
const { users } = storeToRefs(userStore);

onMounted(async () => {
  userStore.getUserList();
});

const onUserSelect = async (id: string) => {
  const response = await userStore.getUser(id);
  userStore.userEditing = true;
  globalStore.isEditing = true;
  if (!response.ok) {
    showError(response.message);
  }
};
</script>

<style scoped>
.list-group {
  border: solid 1px var(--list-group-border-color);
  height: calc(100vh - 19rem);
  overflow-y: auto;
}
.selected {
  border-color: var(--primary-color) !important;
  cursor: pointer;
  pointer-events: none;
}
.editing {
  opacity: 0.3;
  pointer-events: none;
}
</style>
