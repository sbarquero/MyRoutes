<template>
  <DefaultContainer backgroundImage="/assets/img/tracks.jpg">
    <template #title>{{ t('trackView.title') }}</template>
    <template #content>
      <div class="row">
        <div class="col-12 col-md-4">
          <TrackList />
        </div>
        <div class="col-12 col-md-8 mt-5 mt-md-0">
          <TrackCard />
        </div>
      </div>
      <AddButton
        v-if="!trackStore.trackEditing && !trackStore.isNewTrack"
        :tooltip="t('trackView.addButton.tooltip')"
        @click="onAddTrack"
        class="add-button"
      />
    </template>
  </DefaultContainer>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

import { useTrackStore } from '@/stores/trackStore';
import AddButton from '../components/shared/AddButton.vue';
import DefaultContainer from '../components/shared/DefaultContainer.vue';
import TrackCard from '../components/tracks/TrackCard.vue';
import TrackList from '../components/tracks/TrackList.vue';

const { t } = useI18n();
const trackStore = useTrackStore();

onMounted(() => {
  trackStore.$reset();
});

const onAddTrack = async () => {
  trackStore.newTrack();
};
</script>

<style scoped>
.add-button {
  bottom: 1.25rem;
  right: 1.5rem;
  position: absolute;
}
</style>
