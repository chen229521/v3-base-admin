import { $t } from '@/locales'
import { getRoutePath } from '@/router/elegant/transform'
import { LastLevelRouteKey, RouteKey, RouteMap } from '@elegant-router/types'
import { Router } from 'vue-router'

/**
 * 获取所有标签页
 * @param tabs 标签页数组
 * @param homeTab 主页标签页，可选
 * @returns 过滤并排序后的标签页数组
 */
export function getAllTabs(tabs: App.Global.Tab[], homeTab?: App.Global.Tab) {
    if (!homeTab) {
        return []
    }

    // 过滤掉主页标签页
    const filterHomeTabs = tabs.filter((tab) => tab.id !== homeTab.id)

    // 过滤并按固定索引排序固定标签页
    const fixedTabs = filterHomeTabs
        .filter(isFixedTab)
        .sort((a, b) => a.fixedIndex! - b.fixedIndex!)

    // 过滤掉固定标签页
    const remainTabs = filterHomeTabs.filter((tab) => !isFixedTab(tab))

    // 合并主页、固定和剩余标签页
    const allTabs = [homeTab, ...fixedTabs, ...remainTabs]

    // 更新标签页标签
    return updateTabsLabel(allTabs)
}

/**
 * 检查标签页是否为固定标签页
 * @param tab 标签页
 * @returns 如果标签页是固定的，则返回true
 */
function isFixedTab(tab: App.Global.Tab) {
    return tab.fixedIndex !== undefined && tab.fixedIndex !== null
}

/**
 * 根据路由获取标签页ID
 * @param route 路由
 * @returns 标签页ID
 */
export function getTabIdByRoute(route: App.Global.TabRoute) {
    const { path, query = {}, meta } = route

    let id = path

    // 如果是多标签页，将查询字符串作为ID的一部分
    if (meta.multiTab) {
        const queryKeys = Object.keys(query).sort()
        const qs = queryKeys.map((key) => `${key}=${query[key]}`).join('&')
        id = `${path}?${qs}`
    }

    return id
}

/**
 * 根据路由获取标签页
 * @param route 路由
 * @returns 标签页对象
 */
export function getTabByRoute(route: App.Global.TabRoute) {
    const { name, path, fullPath = path, meta } = route
    const { title, i18nKey, fixedIndexInTab } = meta

    // 获取路由图标
    const { icon, localIcon } = getRouteIcons(route)

    // 根据国际化键或标题获取标签页标签
    const label = i18nKey ? $t(i18nKey) : title

    // 创建并返回标签页对象
    const tab: App.Global.Tab = {
        id: getTabIdByRoute(route),
        label,
        routeKey: name as LastLevelRouteKey,
        routePath: path as RouteMap[LastLevelRouteKey],
        fullPath,
        fixedIndex: fixedIndexInTab,
        icon,
        localIcon,
        i18nKey
    }

    return tab
}

/**
 * 获取默认主页标签页
 * @param router 路由器
 * @param homeRouteName 主页路由名称
 * @returns 主页标签页
 */
export function getDefaultHomeTab(router: Router, homeRouteName: LastLevelRouteKey) {
    const homeRoutePath = getRoutePath(homeRouteName)
    const i18nLabel = $t(`route.${homeRouteName}`)
    let homeTab: App.Global.Tab = {
        id: getRoutePath(homeRouteName),
        label: i18nLabel || homeRouteName,
        routeKey: homeRouteName,
        routePath: homeRoutePath,
        fullPath: homeRoutePath
    }
    const routes = router.getRoutes()
    const homeRoute = routes.find((route) => route.name === homeRouteName)
    if (homeRoute) {
        homeTab = getTabByRoute(homeRoute)
    }

    return homeTab
}

/**
 * 检查标签页是否在标签页数组中
 * @param tabId 标签页ID
 * @param tabs 标签页数组
 * @returns 如果找到标签页，则返回true
 */
export function isTabInTabs(tabId: string, tabs: App.Global.Tab[]) {
    return tabs.some((tab) => tab.id === tabId)
}

/**
 * 根据ID过滤标签页
 * @param tabId 标签页ID
 * @param tabs 标签页数组
 * @returns 过滤后的标签页数组
 */
export function filterTabsById(tabId: string, tabs: App.Global.Tab[]) {
    return tabs.filter((tab) => tab.id! == tabId)
}

/**
 * 根据多个ID过滤标签页
 * @param tabIds 标签页ID数组
 * @param tabs 标签页数组
 * @returns 过滤后的标签页数组
 */
export function filterTabsByIds(tabIds: string[], tabs: App.Global.Tab[]) {
    return tabs.filter((tab) => !tabIds.includes(tab.id))
}

/**
 * 根据所有路由过滤标签页
 * @param router 路由器
 * @param tabs 标签页数组
 * @returns 过滤后的标签页数组
 */
export function extractTabsByAllRoutes(router: Router, tabs: App.Global.Tab[]) {
    const routes = router.getRoutes()
    const routeNames = routes.map((route) => route.name)
    return tabs.filter((tab) => routeNames.includes(tab.routeKey))
}

/**
 * 获取固定标签页
 * @param tabs 标签页数组
 * @returns 固定标签页数组
 */
export function getFixedTabs(tabs: App.Global.Tab[]) {
    return tabs.filter(isFixedTab)
}

/**
 * 获取固定标签页ID
 * @param tabs 标签页数组
 * @returns 固定标签页ID数组
 */
export function getFixedTabIds(tabs: App.Global.Tab[]) {
    const fixedTabs = getFixedTabs(tabs)
    return fixedTabs.map((tab) => tab.id)
}

/**
 * 根据国际化键更新标签页
 * @param tab 标签页
 * @returns 更新后的标签页
 */
export function updateTabByI18nKey(tab: App.Global.Tab) {
    const { i18nKey, label } = tab
    return {
        ...tab,
        label: i18nKey ? $t(i18nKey) : label
    }
}

/**
 * 根据国际化键更新所有标签页
 * @param tabs 标签页数组
 * @returns 更新后的标签页数组
 */
export function updateTabsByI18nKey(tabs: App.Global.Tab[]) {
    return tabs.map((tab) => updateTabByI18nKey(tab))
}

/**
 * 根据路由名称查找标签页
 * @param name 路由名称
 * @param tabs 标签页数组
 * @returns 找到的标签页，如果没有找到则返回undefined
 */
export function findTabByRouteName(name: RouteKey, tabs: App.Global.Tab[]) {
    const routePath = getRoutePath(name)
    const tabId = routePath
    const multiTabId = `${routePath}?`

    return tabs.find((tab) => tab.id === tabId || tab.id.startsWith(multiTabId))
}

/**
 * 获取路由图标
 * @param route 路由
 * @returns 图标对象，包含全局和本地图标
 */
export function getRouteIcons(route: App.Global.TabRoute) {
    let icon: string = route?.meta?.icon || import.meta.env.VITE_MENU_ICON
    let localIcon: string | undefined = route?.meta?.localIcon
    if (route.matched) {
        const currentRoute = route.matched.find((r) => r.name === route.name)
        icon = currentRoute?.meta?.icon || icon
        localIcon = currentRoute?.meta?.localIcon
    }

    return { icon, localIcon }
}

/**
 * 更新标签页标签
 * @param tabs 标签页数组
 * @returns 更新后的标签页数组
 */
function updateTabsLabel(tabs: App.Global.Tab[]) {
    const updated = tabs.map((tab) => ({
        ...tab,
        label: tab.newLabel || tab.oldLabel || tab.label
    }))

    return updated
}
