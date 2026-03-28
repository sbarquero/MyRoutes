<template>
  <div class="list-group-item list-group-item-action">
    <h5 id="user-name" class="ms-1 text-capitalize">
      <slot name="name"></slot>
    </h5>
    <h6 id="user-email" class="ms-1 text-lowercase fst-italic">
      <slot name="email"></slot>
    </h6>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
div.list-group-item {
  border-color: var(--primary-color-50);
  border-left-width: 8px;
  user-select: none;
}
div:hover {
  cursor: pointer;
  color: var(--color-text);
}
#user-name,
#user-email {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
