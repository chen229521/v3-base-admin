<script setup lang="ts">
  import { createTextVNode, defineComponent } from 'vue';
  import { useDialog, useLoadingBar, useMessage, useNotification } from 'naive-ui';

  defineOptions({
    name: 'AppProvider',
  });

  const ContextHolder = defineComponent({
    name: 'ContextHolder',
    setup() {
      function register() {
        window.$loadingBar = useLoadingBar();
        window.$dialog = useDialog();
        window.$message = useMessage();
        window.$notification = useNotification();
      }
      register();

      return () => createTextVNode();
    },
  });
</script>

<style scoped lang="scss"></style>

<template>
  <NLoadingBarProvider>
    <NDialogProvider>
      <NNotificationProvider>
        <NMessageProvider>
          <ContextHolder>
            <slot></slot>
          </ContextHolder>
        </NMessageProvider>
      </NNotificationProvider>
    </NDialogProvider>
  </NLoadingBarProvider>
</template>
