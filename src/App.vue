<script setup lang="ts">
  defineOptions({
    name: 'App',
  });
</script>

<template>
  <NConfigProvider class="h-full">
    <AppProvider>
      <RouterView class="bg-layout" />
    </AppProvider>
  </NConfigProvider>
</template>

<style scoped></style>
