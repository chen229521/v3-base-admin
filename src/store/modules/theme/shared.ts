import { overrideThemeSettings, themeSettings } from '@/theme/settings'
import { themeVars } from '@/theme/vars'
import { toggleHtmlClass } from '@/utils/commons'
import { localStg } from '@/utils/storage'
import { GlobalThemeOverrides } from 'naive-ui'
import { addColorAlpha, getColorPalette, getPaletteColorByNumber, getRgb } from '@prb/color'

// 定义暗黑模式的CSS类名常量
const DARK_CLASS = 'drak'

/**
 * 初始化主题设置
 *
 * 该函数根据当前环境（生产/非生产）和本地存储中的主题设置来初始化主题配置
 * 在生产环境中，它会合并并覆盖主题设置，确保最新的主题配置被应用
 *
 * @returns {object} 初始化后的主题设置对象
 */
export function initThemeSettings() {
    const isProd = import.meta.env.PROD

    if (!isProd) {
        return themeSettings
    }

    const settings = localStg.get('themeSettings') || themeSettings

    const isOverride = localStg.get('overrideThemeFlag') === BUILD_TIME

    if (!isOverride) {
        Object.assign(settings, overrideThemeSettings)
        localStg.set('overrideThemeFlag', BUILD_TIME)
    }

    return settings
}

/**
 * 创建主题Token
 *
 * 根据提供的颜色方案和主题配置，生成主题相关的CSS变量
 * 这些变量用于定义主题的颜色和阴影等样式
 *
 * @param {object} colors 主题颜色对象
 * @param {object} tokens 主题配置的token部分
 * @param {boolean} recommended 是否使用推荐的颜色方案
 * @returns {object} 包含主题Token和暗黑主题Token的对象
 */
export function createThemeToken(
    colors: App.Theme.ThemeColor,
    tokens?: App.Theme.ThemeSetting['tokens'],
    recommended = false
) {
    const paletteColors = createThemePaletteColors(colors, recommended)

    const { light, dark } = tokens || themeSettings.tokens

    const themeTokens: App.Theme.ThemeTokenCSSVars = {
        colors: {
            ...paletteColors,
            nprogress: paletteColors.primary,
            ...light.colors
        },
        boxShadow: {
            ...light.boxShadow
        }
    }

    const darkThemeTokens: App.Theme.ThemeTokenCSSVars = {
        colors: {
            ...themeTokens.colors,
            ...dark?.colors
        },
        boxShadow: {
            ...themeTokens.boxShadow,
            ...dark?.boxShadow
        }
    }

    return {
        themeTokens,
        darkThemeTokens
    }
}

/**
 * 创建主题调色板颜色
 *
 * 根据提供的颜色方案，生成主题的调色板颜色
 * 这些颜色用于创建主题相关的CSS变量
 *
 * @param {object} colors 主题颜色对象
 * @param {boolean} recommended 是否使用推荐的颜色方案
 * @returns {object} 主题调色板颜色对象
 */
export function createThemePaletteColors(colors: App.Theme.ThemeColor, recommended = false) {
    const colorKeys = Object.keys(colors) as App.Theme.ThemeColorKey[]

    const colorPaletteVar = {} as App.Theme.ThemePaletteColor

    colorKeys.forEach((key) => {
        const colorMap = getColorPalette(colors[key], recommended)

        colorPaletteVar[key] = colorMap.get(500)!

        colorMap.forEach((hex, number) => {
            colorPaletteVar[`${key}-${number}`] = hex
        })
    })

    return colorPaletteVar
}

/**
 * 根据主题Token获取CSS变量字符串
 *
 * 该函数将主题Token转换为CSS变量字符串，这些变量定义了主题的颜色和阴影等样式
 *
 * @param {object} tokens 主题配置的token部分
 * @returns {string} CSS变量字符串
 */
function getCssVarByTokens(tokens: App.Theme.BaseToken) {
    const styles: string[] = []

    function removeVarPrefix(value: string) {
        return value.replace('var(', '').replace(')', '')
    }

    function removeRgbPrefix(value: string) {
        return value.replace('rgb(', '').replace(')', '')
    }

    for (const [key, tokenValues] of Object.entries(themeVars)) {
        for (const [tokenKey, tokenValue] of Object.entries(tokenValues)) {
            let cssVarsKey = removeVarPrefix(tokenValue)

            let cssValue = tokens[key][tokenKey]
            if (key === 'colors') {
                cssVarsKey = removeRgbPrefix(cssVarsKey)

                const { r, g, b } = getRgb(cssValue)

                cssValue = `${r} ${g} ${b}`
            }

            styles.push(`${cssVarsKey}: ${cssValue}`)
        }
    }

    const styleStr = styles.join(',')

    return styleStr
}

/**
 * 将主题变量添加到全局样式
 *
 * 该函数将主题相关的CSS变量添加到全局样式中，确保这些变量可以在整个应用中使用
 *
 * @param {object} tokens 主题配置的token部分
 * @param {object} darkTokens 暗黑主题配置的token部分
 */
export function addThemeVarsToGlobal(tokens: App.Theme.BaseToken, darkTokens: App.Theme.BaseToken) {
    const cssVarStr = getCssVarByTokens(tokens)
    const darkCssVarStr = getCssVarByTokens(darkTokens)

    const css = `
  :root {
    ${cssVarStr}
  }
  `

    const darkCss = `
  html.${DARK_CLASS} {
    ${darkCssVarStr}
  }
  `

    const styleId = 'theme-vars'

    const style = document.querySelector(`#${styleId}`) || document.createElement('style')

    style.id = styleId

    style.textContent = css + darkCss

    document.head.appendChild(style)
}

/**
 * 切换暗黑模式的CSS类
 *
 * 该函数通过添加或移除HTML元素上的暗黑模式类来切换暗黑模式
 *
 * @param {boolean} darkMode 是否启用暗黑模式
 */
export function toggleCssDarkMode(darkMode = false) {
    const { add, remove } = toggleHtmlClass(DARK_CLASS)

    if (darkMode) {
        add()
    } else {
        remove()
    }
}

/**
 * 切换辅助色彩模式
 *
 * 该函数通过修改HTML元素的样式来切换灰度模式和色弱模式
 *
 * @param {boolean} grayscaleMode 是否启用灰度模式
 * @param {boolean} colourWeakness 是否启用色弱模式
 */
export function toggleAuxiliaryColorModes(grayscaleMode = false, colourWeakness = false) {
    const htmlElement = document.documentElement

    htmlElement.style.filter = [
        grayscaleMode ? 'grayscale(100%)' : '',
        colourWeakness ? 'invert(100%)' : ''
    ]
        .filter(Boolean)
        .join(' ')
}

// 定义Naive UI颜色场景和颜色键的类型
type NaiveColorScene = '' | 'Suppl' | 'Hover' | 'Pressed' | 'Active'
type NaiveColorKey = `${App.Theme.ThemeColorKey}Color${NaiveColorScene}`
type NaiveThemeColor = Partial<Record<NaiveColorKey, string>>

// 定义Naive UI颜色操作的接口
interface NaiveColorAction {
    scene: NaiveColorScene
    handler: (color: string) => string
}

/**
 * 获取Naive UI主题颜色
 *
 * 根据提供的颜色方案，生成Naive UI的主题颜色
 * 这些颜色用于创建Naive UI的主题配置
 *
 * @param {object} colors 主题颜色对象
 * @param {boolean} recommended 是否使用推荐的颜色方案
 * @returns {object} Naive UI主题颜色对象
 */
function getNaiveThemeColors(colors: App.Theme.ThemeColor, recommended = false) {
    const colorActions: NaiveColorAction[] = [
        { scene: '', handler: (color) => color },
        { scene: 'Suppl', handler: (color) => color },
        { scene: 'Hover', handler: (color) => getPaletteColorByNumber(color, 500, recommended) },
        { scene: 'Pressed', handler: (color) => getPaletteColorByNumber(color, 500, recommended) },
        { scene: 'Active', handler: (color) => addColorAlpha(color, 0.1) }
    ]

    const themeColors: NaiveThemeColor = {}

    const colorEntries = Object.entries(colors) as [App.Theme.ThemeColorKey, string][]

    colorEntries.forEach((color) => {
        colorActions.forEach((action) => {
            const [colorType, colorValue] = color
            const colorKey: NaiveColorKey = `${colorType}Color${action.scene}`
            themeColors[colorKey] = action.handler(colorValue)
        })
    })

    return themeColors
}

/**
 * 获取Naive UI主题配置
 *
 * 根据提供的颜色方案，生成Naive UI的全局主题配置
 * 这个配置用于定制Naive UI组件的颜色和样式
 *
 * @param {object} colors 主题颜色对象
 * @param {boolean} recommended 是否使用推荐的颜色方案
 * @returns {object} Naive UI全局主题配置对象
 */
export function getNaiveTheme(colors: App.Theme.ThemeColor, recommended = false) {
    const { primary: colorLoading } = colors

    const theme: GlobalThemeOverrides = {
        common: {
            ...getNaiveThemeColors(colors, recommended),
            borderRadius: '6px'
        },
        LoadingBar: {
            colorLoading
        },
        Tag: {
            borderRadius: '6px'
        }
    }

    return theme
}
