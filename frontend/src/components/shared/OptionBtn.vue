<template>
  <button type="button" :title="tooltip">
    <slot></slot>
  </button>
</template>

<script lang="ts">
export default {
  name: 'OptionBtn',
  props: {
    tooltip: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
button {
  background-color: var(--btn-background-color);
  border-radius: 0.35rem;
  border: 0px;
  box-shadow: var(--btn-shadow);
  height: 2rem;
  min-width: 2rem;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  padding: 0rem 0.5rem;

  &:hover {
    background-color: var(--btn-background-color-hover);
    box-shadow: var(--btn-shadow-hover);
  }

  &:active {
    position: relative;
    box-shadow: var(--btn-shadow-active);
  }
}
</style>
