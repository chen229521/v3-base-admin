<script setup lang="ts">
    import { WatermarkProps, darkTheme } from 'naive-ui';
import { computed } from 'vue';
import { useThemeStore } from './store/modules/theme';

    defineOptions({
        name: 'App'
    })

    const themeStore = useThemeStore()

    const naiveDarkTheme = computed(() => (themeStore.darkMode ? darkTheme : undefined))

    const watermarkProps = computed<WatermarkProps>(() => {
        return {
            content: themeStore.watermark?.text || 'prbAdmin',
            cross: true,
            fullscreen: true,
            fontSize: 16,
            lineHeight: 16,
            width: 384,
            height: 384,
            xOffset: 12,
            yOffset: 60,
            rotate: -15,
            zIndex: 9999
        }
    })
</script>

<template>
    <NConfigProvider
        class="h-full"
        :theme="naiveDarkTheme"
        :theme-overrides="themeStore.naiveTheme"
    >
        <AppProvider>
            <RouterView class="bg-layout" />
            <NWatermark v-if="themeStore.watermark?.visible" v-bind="watermarkProps" />
        </AppProvider>
    </NConfigProvider>
</template>

<style scoped></style>
