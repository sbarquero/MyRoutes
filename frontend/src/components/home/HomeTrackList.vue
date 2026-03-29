<template>
  <div class="list-group">
    <HomeTrackListItem
      v-for="(track, index) in tracks"
      :key="track._id"
      :track="track"
      :index="index"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue';
import { storeToRefs } from 'pinia';

import { useAuthStore } from '@/stores/authStore';
import { useTrackStore } from '@/stores/trackStore';
import HomeTrackListItem from './HomeTrackListItem.vue';

const authStore = useAuthStore();
const trackStore = useTrackStore();

const { tracks } = storeToRefs(useTrackStore());
const { userId } = storeToRefs(useAuthStore());

onMounted(async () => {
  if (authStore.userId) {
    await trackStore.getTrackListByUserId(authStore.userId);
  } else {
    await trackStore.getAllPublic();
  }
});

watch(userId, async () => {
  if (userId.value) {
    await trackStore.getTrackListByUserId(authStore.userId);
  } else {
    await trackStore.getAllPublic();
  }
});
</script>

<style scoped>
.list-group {
  height: 66vh;
  overflow-y: auto;
}
</style>
