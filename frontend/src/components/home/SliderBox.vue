<!-- Slider Box Component -->
<template>
  <div class="slider-box" :class="isVisible ? 'show-list' : 'hide-list'">
    <!-- Contain of the slider box  -->
    <div class="slider-box_content">
      <slot />
    </div>
    <!-- Toggle switch for show or hide the slider box -->
    <div
      class="slider-box_toggle"
      @click="switchVisibility()"
      :title="
        isVisible
          ? t('homeView.sliderBox.hideToggleButtonTitle')
          : t('homeView.sliderBox.showToggleButtonTitle')
      "
    >
      <IconArrowLeft v-if="isVisible" />
      <IconArrowRight v-else />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';

import IconArrowLeft from '../icons/IconArrowLeft.vue';
import IconArrowRight from '../icons/IconArrowRight.vue';

const { t } = useI18n();

const isVisible = ref(true);

const props = defineProps({
  visible: { type: Boolean, default: true },
});

onMounted(() => {
  isVisible.value = props.visible;
});

const switchVisibility = () => (isVisible.value = !isVisible.value);
</script>

<style lang="scss" scoped>
.show-list {
  left: 0px;
}
.hide-list {
  left: -350px;
}
.slider-box {
  height: 90vh;
  position: fixed;
  top: 4.5rem;
  transition-duration: 0.5s;
  z-index: 3;
  &_content {
    background-color: rgba($color: var(--slider-box-background-color), $alpha: 0.75);
    border-radius: 0 5px 5px 0;
    box-shadow: 0 0 3px 4px rgba($color: #000000, $alpha: 0.3);
    float: left;
    height: 100%;
    overflow: hidden;
    padding: 10px;
    width: 350px;
  }
  &_toggle {
    background-color: rgba($color: var(--slider-box-background-color), $alpha: 1);
    border-radius: 0 5px 5px 0;
    box-shadow: 4px 0 2px 2px rgba($color: #000000, $alpha: 0.3);
    cursor: pointer;
    float: left;
    height: 4rem;
    left: 0px;
    padding: 10px 10px 10px 0;
    position: relative;
    top: 40%;
    width: 24px;
    svg {
      height: 3rem;
      width: 1.5rem;
    }
  }
}
</style>
