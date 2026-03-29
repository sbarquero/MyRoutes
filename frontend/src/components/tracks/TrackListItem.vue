<template>
  <div class="list-group-item list-group-item-action">
    <h5 id="track-name" class="text-capitalize">{{ props.track.name }}</h5>
    <div
      v-if="props.track.isPublic"
      class="pill pill-first"
      :title="t('trackView.trackList.public')"
    >
      <span>P</span>
    </div>
    <p id="track-description" class="fst-italic mb-0">
      <span v-if="props.track.description">{{ props.track.description }}</span>
      <span v-else>{{ t('trackView.trackList.noDescription') }}</span>
    </p>
    <div
      v-if="props.track.isPublic && props.track.userId !== userId"
      class="pill pill-second"
      :title="t('trackView.trackList.readOnly')"
    >
      <span>R</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { storeToRefs } from 'pinia';

import { useAuthStore } from '@/stores/authStore';

const { t } = useI18n();

const props = defineProps({
  track: { type: Object, required: true },
});

const { userId } = storeToRefs(useAuthStore());
</script>

<style lang="scss" scoped>
div.list-group-item {
  border-color: var(--primary-color-50);
  border-left-width: 8px;
  user-select: none;
}
div:hover {
  cursor: pointer;
  color: var(--color-text);
}
#track-name,
#track-description {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.pill {
  border-radius: 50%;
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  height: 1.1rem;
  padding-top: 0.0625rem;
  position: absolute;
  right: 0.1875rem;
  text-align: center;
  width: 1.1rem;
  &:hover {
    color: white;
  }
  &-first {
    background-color: var(--primary-color);
    top: 0.1875rem;
  }
  &-second {
    background-color: var(--secondary-color);
    top: 1.4rem;
  }
}
</style>
