<script setup lang="ts">
import MainMap from './components/MainMap.vue';
</script>

<template>
  <MainMap />
</template>

<style global>
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
  background-color: #345;
}

button {
  font-family: 'Barlow', sans-serif;
  font-weight: 400;
  font-style: normal;
  background-color: #678;
  color: #fff;
  border: none;
  padding: 4px 8px;
  margin-right: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #89a;
  }
}
</style>
