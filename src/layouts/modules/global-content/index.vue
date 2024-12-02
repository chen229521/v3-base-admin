<script setup lang="ts">
  defineOptions({
    name: 'GlobalContent',
  });
  import { useRouteStore } from '@/store/modules/route';

  const routeStote = useRouteStore();
</script>
<template>
  <RouterView v-slot="{ Component, route }">
    <Transition>
      <KeepAlive :include="routeStote.cacheRoutes" :exclude="routeStote.excludeCacheRoutes">
        <component :is="Component" class="flex-grow bg-layout transition-300"></component>
      </KeepAlive>
    </Transition>
  </RouterView>
</template>

<style scoped lang="scss"></style>
