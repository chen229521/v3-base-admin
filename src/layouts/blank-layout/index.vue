<template>
  <div class="text-red-800">123</div>
  <SvgIcon local-icon="activity" class="text-30px text-primary"></SvgIcon>
  <icon-local-activity class="text-30px text-primary" />
  <h3 class="text-28px text-primary font-500 lt-sm:text-22px">{{ $t('system.title') }}</h3>
</template>

<script setup lang="ts">
  import { $t } from '@/locales';
</script>

<style scoped lang="scss"></style>
