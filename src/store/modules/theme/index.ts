import { SetupStoreId } from '@/enum'
import { localStg } from '@/utils/storage'
import { getPaletteColorByNumber } from '@prb/color'
import { useEventListener, usePreferredColorScheme } from '@vueuse/core'
import { defineStore } from 'pinia'
import { Ref, computed, effectScope, onScopeDispose, ref, toRefs, watch } from 'vue'
import {
  addThemeVarsToGlobal,
  createThemeToken,
  getNaiveTheme,
  initThemeSettings,
  toggleAuxiliaryColorModes,
  toggleCssDarkMode
} from './shared'

/**
 * 定义并返回一个用于管理主题的Pinia store
 *
 * 该store负责处理主题相关的各种设置和操作，包括暗黑模式、灰度模式、色弱模式的管理，
 * 主题颜色的设置，以及布局模式的控制等
 */
export const useThemeStore = defineStore(SetupStoreId.Theme, () => {
    // 创建一个效应作用域，用于管理副作用
    const scope = effectScope()
    // 获取系统的主题方案
    const osTheme = usePreferredColorScheme()
    // 存储主题设置的Ref对象
    const settings: Ref<App.Theme.ThemeSetting> = ref(initThemeSettings())

    // 计算暗黑模式的状态
    const darkMode = computed(() => {
        if (settings.value.themeScheme === 'auto') {
            return osTheme.value === 'dark'
        }
        return settings.value.themeScheme === 'dark'
    })

    // 计算灰度模式的状态
    const grayscaleMode = computed(() => {
        return settings.value.grayscale
    })

    // 计算色弱模式的状态
    const colourWeaknessMode = computed(() => settings.value.colourWeakness)

    // 计算主题颜色
    const themeColors = computed(() => {
        const { themeColor, otherColor, isInfoFollowPrimary } = settings.value
        const colors: App.Theme.ThemeColor = {
            primary: themeColor,
            ...otherColor,
            info: isInfoFollowPrimary ? themeColor : otherColor.info
        }
        return colors
    })
    // 计算Naive UI的主题
    const naiveTheme = computed(() =>
        getNaiveTheme(themeColors.value, settings.value.recommendColor)
    )
    // 计算主题设置的JSON字符串
    const settingsJson = computed(() => JSON.stringify(settings.value))

    /**
     * 重置store到初始状态
     */
    function resetStore() {
        const themeStore = useThemeStore()
        themeStore.$reset()
    }

    /**
     * 设置主题方案
     * @param themeScheme 主题方案，可以是'auto'、'light'或'dark'
     */
    function setThemeScheme(themeScheme: UnionKey.ThemeScheme) {
        settings.value.themeScheme = themeScheme
    }

    /**
     * 设置灰度模式
     * @param isGrayscale 是否启用灰度模式
     */
    function setGrayscale(isGrayscale: boolean) {
        settings.value.grayscale = isGrayscale
    }

    /**
     * 设置色弱模式
     * @param isColourWeakness 是否启用色弱模式
     */
    function setColourWeakness(isColourWeakness: boolean) {
        settings.value.colourWeakness = isColourWeakness
    }

    /**
     * 切换主题方案
     */
    function toggleThemeScheme() {
        const themeSchemes: UnionKey.ThemeScheme[] = ['auto', 'light', 'dark']

        const index = themeSchemes.findIndex((item) => item === settings.value.themeScheme)

        const nextIndex = index === themeSchemes.length - 1 ? 0 : index + 1

        const nextThemeSchema = themeSchemes[nextIndex]

        setThemeScheme(nextThemeSchema)
    }

    /**
     * 更新主题颜色
     * @param key 颜色键，表示要更新的颜色类型
     * @param color 颜色值
     */
    function updateThemeColors(key: App.Theme.ThemeColorKey, color: string) {
        let colorValue = color

        if (settings.value.recommendColor) {
            colorValue = getPaletteColorByNumber(color, 500, true)
        }

        if (key === 'primary') {
            settings.value.themeColor = colorValue
        } else {
            settings.value.otherColor[key] = colorValue
        }
    }

    /**
     * 设置主题布局模式
     * @param mode 布局模式
     */
    function setThemeLayout(mode: UnionKey.ThemeLayoutMode) {
        settings.value.layout.mode = mode
    }

    /**
     * 将主题变量设置到全局
     */
    function setupThemeVarsToGlobal() {
        const { themeTokens, darkThemeTokens } = createThemeToken(
            themeColors.value,
            settings.value.tokens,
            settings.value.recommendColor
        )
        addThemeVarsToGlobal(themeTokens, darkThemeTokens)
    }

    /**
     * 设置布局的水平反转状态
     * @param revers 是否反转
     */
    function setLayoutReverseHorizontalMix(revers: boolean) {
        settings.value.layout.reverseHorizontalMix = revers
    }

    /**
     * 缓存主题设置到本地存储
     */
    function cacheThemeSettings() {
        const isProd = import.meta.env.PROD

        if (!isProd) {
            return
        }

        localStg.set('themeSettings', settings.value)
    }

    // 监听窗口的beforeunload事件，缓存主题设置
    useEventListener(window, 'beforeunload', () => {
        cacheThemeSettings()
    })

    // 在效应作用域中运行副作用
    scope.run(() => {
        watch(
            darkMode,
            (val) => {
                toggleCssDarkMode(val)
            },
            { immediate: true }
        )

        watch(
            [grayscaleMode, colourWeaknessMode],
            (val) => {
                toggleAuxiliaryColorModes(val[0], val[1])
            },
            { immediate: true }
        )

        watch(
            themeColors,
            (val) => {
                setupThemeVarsToGlobal()
                localStg.set('themeColor', val.primary)
            },
            { immediate: true }
        )
    })

    // 当作用域被销毁时，停止效应作用域
    onScopeDispose(() => {
        scope.stop()
    })
    // 返回主题相关的设置和操作函数
    return {
        ...toRefs(settings.value),
        darkMode,
        themeColors,
        naiveTheme,
        settingsJson,
        setGrayscale,
        setColourWeakness,
        resetStore,
        setThemeScheme,
        toggleThemeScheme,
        updateThemeColors,
        setThemeLayout,
        setLayoutReverseHorizontalMix
    }
})
