<template>
  <div>
    123
    <component :is="activeModule.component"></component>
  </div>
</template>

<script setup lang="ts">
  import type { Component } from 'vue';
  import { loginModuleRecord } from '@/constants/app';
  import PwdLogin from './modules/pwd-login.vue';
  import CodeLogin from './modules/code-login.vue';
  import Register from './modules/register.vue';
  import ResetPwd from './modules/reset-pwd.vue';
  import BindWechat from './modules/bind-wechat.vue';
  import { computed } from 'vue';

  interface LoginModule {
    label: string;
    component: Component;
  }

  const moduleMap: Record<UnionKey.LoginModule, LoginModule> = {
    'pwd-login': { label: loginModuleRecord['pwd-login'], component: PwdLogin },
    'code-login': { label: loginModuleRecord['code-login'], component: CodeLogin },
    register: { label: loginModuleRecord.register, component: Register },
    'reset-pwd': { label: loginModuleRecord['reset-pwd'], component: ResetPwd },
    'bind-wechat': { label: loginModuleRecord['bind-wechat'], component: BindWechat },
  };

  const activeModule = computed(() => moduleMap['pwd-login']);
</script>

<style scoped lang="scss"></style>
