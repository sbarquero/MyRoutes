<template>
  <div class="background" :style="{ background: `url(${props.backgroundImage}) no-repeat center` }">
    <div class="filter">
      <div class="container-fluid container-lg mt-0">
        <h1 class="pt-3">
          <div v-if="!!$slots.title" class="title show"><slot name="title"></slot></div>
          <div v-else class="title hide"></div>
        </h1>
        <div class="card p-4 mt-4">
          <slot name="content"></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  backgroundImage: String,
});
</script>

<style scoped>
.background {
  background-color: var(--default-container-background-color);
  background-size: cover !important;
  height: calc(100% - 3rem);
}

.filter {
  background-color: var(--default-container-filter-background-color);
  position: relative;
  height: 100%;
}

.card {
  background-color: var(--default-container-card-background-color);
  border-radius: 10px;
  border-radius: 0.35rem;
  height: calc(100vh - 12rem);
  overflow-y: auto;
  overflow-x: hidden;
}

.title {
  border-radius: 10px;
  border-radius: 0.35rem;
  display: inline-block;
  margin-top: 1rem;
  padding: 0.1rem 1rem 0.35rem 1rem;
}

.show {
  background-color: var(--default-container-title-background-color);
}

.hide {
  background-color: transparent;
}
</style>
