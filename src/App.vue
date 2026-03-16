<script setup lang="ts">
import MainMap from './components/MainMap.vue';
</script>

<template>
  <MainMap />
</template>

<style global>
:root {
  --color-body: #1c1c1c;
  --color-primary: #fed215;
  --color-fg: #fff;
  --color-bg: #2b2b2c;

  --border-radius: 0.25rem;
}

* {
  box-sizing: border-box;
}

html {
  font-size: 16px;
}

body {
  margin: 0;
  font-family: 'Barlow', sans-serif;
  font-weight: 400;
  font-style: normal;
  background-color: var(--color-bg);
}

button {
  width: 16ch;
  font-family: 'Barlow', sans-serif;
  font-weight: 400;
  font-style: normal;
  color: var(--color-fg);
  background-color: transparent;
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius);
  padding: 4px 8px;
  margin-right: 8px;
  cursor: pointer;
  transition:
    color 0.2s,
    background-color 0.2s;

  &:hover {
    color: var(--color-bg);
    background-color: var(--color-primary);
  }
}
</style>
