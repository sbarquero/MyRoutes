<template>
  <MapView />
  <SliderBox :visible="false">
    <!-- Title -->
    <h4 class="title py-1 px-3 mb-4">{{ t('homeView.routes') }}</h4>
    <!-- Accordion -->
    <div class="accordion" id="accordionRoute">
      <!-- Upload file accordion element -->
      <div class="accordion-item" v-if="authStore.isAuthenticated">
        <h2 class="accordion-header" id="headingOne">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseOne"
            aria-expanded="false"
            aria-controls="collapseOne"
          >
            <IconUpload class="icon" />
            <h5 class="ms-3">{{ t('homeView.trackUpload') }}</h5>
          </button>
        </h2>
        <div
          id="collapseOne"
          class="accordion-collapse collapse"
          aria-labelledby="headingOne"
          data-bs-parent="#accordionRoute"
        >
          <div class="accordion-body p-0 m-0">
            <TrackUploadForm />
          </div>
        </div>
      </div>
      <!-- Track list accordion element -->
      <div class="accordion-item">
        <h2 class="accordion-header" id="headingTwo">
          <button
            class="accordion-button collapsed"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#collapseTwo"
            aria-expanded="true"
            aria-controls="collapseTwo"
          >
            <IconList class="icon" />
            <h5 class="ms-3">{{ t('homeView.trackList') }}</h5>
          </button>
        </h2>
        <div
          id="collapseTwo"
          class="accordion-collapse collapse show"
          aria-labelledby="headingTwo"
          data-bs-parent="#accordionRoute"
        >
          <div class="accordion-body p-0 m-0">
            <HomeTrackList />
          </div>
        </div>
      </div>
    </div>
  </SliderBox>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import { useAuthStore } from '@/stores/authStore';
import IconList from '../components/icons/IconList.vue';
import IconUpload from '../components/icons/IconUpload.vue';
import MapView from '@/components/home/MapView.vue';
import SliderBox from '@/components/home/SliderBox.vue';
import HomeTrackList from '../components/home/HomeTrackList.vue';
import TrackUploadForm from '../components/home/TrackUploadForm.vue';

const { t } = useI18n();

const authStore = useAuthStore();
</script>

<style lang="scss" scoped>
.icon {
  height: 24px;
  width: 24px;
}
.title {
  background-color: rgba($color: #fff, $alpha: 0.75) !important;
  border-radius: 0.25rem;
}
.accordion {
  border-radius: 0.25rem !important;
}
.accordion-item {
  background-color: #fff;
  border: solid 1px var(--primary-color-50);
  color: var(--primary-color);
}
.accordion-button {
  background-color: var(--primary-color-15);
}
.list-group {
  border: 0;
  border-radius: 0rem;
}
</style>
