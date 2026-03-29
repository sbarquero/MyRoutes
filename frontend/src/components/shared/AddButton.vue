<template>
  <button class="btn btn-primary round-btn" :title="tooltip">
    <AddIcon class="icon" />
  </button>
</template>

<script setup lang="ts">
import AddIcon from '../icons/IconAdd.vue';

defineProps<{
  tooltip: string;
}>();
</script>

<style lang="scss" scoped>
.round-btn {
  border-radius: 50%;
  box-shadow: var(--btn-shadow);
  padding: 6px;
  &:hover {
    box-shadow: var(--btn-shadow-hover);
  }
}
</style>
