<template>
  <h3 class="mb-4 ms-1">{{ t('trackView.trackList.title') }}</h3>
  <div class="list-group">
    <TrackListItem
      v-for="track in tracks"
      :key="track._id"
      :track="track"
      @click="onTrackSelect(track._id)"
      :class="
        track._id === trackStore.selectedTrack._id
          ? 'selected'
          : trackStore.trackEditing || trackStore.isNewTrack
          ? 'editing'
          : ''
      "
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useI18n } from 'vue-i18n';

import { onMounted } from 'vue';
import { showError } from '@/utils/dialog';
import { useAuthStore } from '@/stores/authStore';
import { useGlobalStore } from '@/stores/globalStore';
import { useTrackStore } from '@/stores/trackStore';
import TrackListItem from './TrackListItem.vue';

const { t } = useI18n();

const authStore = useAuthStore();
const globalStore = useGlobalStore();
const trackStore = useTrackStore();
const { tracks } = storeToRefs(trackStore);

onMounted(async () => {
  trackStore.getTrackListByUserId(authStore.userId);
});

const onTrackSelect = async (id: string) => {
  const response = await trackStore.getTrackById(id);
  trackStore.trackEditing = true;
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
