import { SetupStoreId } from '@/enum'
import { useRouterPush } from '@/hooks/common/router'
import { router } from '@/router'
import { localStg } from '@/utils/storage'
import { RouteKey } from '@elegant-router/types'
import { useEventListener } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouteStore } from '../route'
import { useThemeStore } from '../theme'
import {
    extractTabsByAllRoutes,
    filterTabsById,
    filterTabsByIds,
    findTabByRouteName,
    getAllTabs,
    getDefaultHomeTab,
    getFixedTabIds,
    getTabByRoute,
    getTabIdByRoute,
    isTabInTabs,
    updateTabByI18nKey,
    updateTabsByI18nKey
} from './shared'

export const useTabStore = defineStore(SetupStoreId.Tab, () => {
    const routeStore = useRouteStore()
    const themeSteore = useThemeStore()
    const { routerPush } = useRouterPush(false)

    const tabs = ref<App.Global.Tab[]>([])

    const homeTab = ref<App.Global.Tab>()

    function initHomeTab() {
        homeTab.value = getDefaultHomeTab(router, routeStore.routeHome)
    }

    const allTabs = computed(() => getAllTabs(tabs.value, homeTab.value))

    const activeTabId = ref<string>('')

    function setActiveTabId(id: string) {
        activeTabId.value = id
    }

    function initTabStore(currentRoute: App.Global.TabRoute) {
        const storageTab = localStg.get('globalTabs')

        if (themeSteore.tab.cache && storageTab) {
            const extractedTabs = extractTabsByAllRoutes(router, storageTab)
            tabs.value = updateTabsByI18nKey(extractedTabs)
        }

        addTab(currentRoute)
    }

    function addTab(route: App.Global.TabRoute, active = true) {
        const tab = getTabByRoute(route)
        const isHomeTab = tab.id === homeTab.value?.id
        if (!isHomeTab && !isTabInTabs(tab.id, tabs.value)) {
            tabs.value.push(tab)
        }
        if (active) {
            setActiveTabId(tab.id)
        }
    }

    async function removeTab(tabId: string) {
        const isRemoveActiveTab = activeTabId.value === tabId
        const updatedTabs = filterTabsById(tabId, tabs.value)

        function update() {
            tabs.value = updatedTabs
        }

        if (!isRemoveActiveTab) {
            update()
            return
        }

        const activeTab = updatedTabs.at(-1) || homeTab.value

        if (activeTab) {
            await switchRouteByTab(activeTab)
            update()
        }
    }

    async function removeActiveTab() {
        await removeTab(activeTabId.value)
    }

    async function removeTabByRouteName(routeName: RouteKey) {
        const tab = findTabByRouteName(routeName, tabs.value)
        if (!tab) {
            return
        }

        await removeTab(tab.id)
    }

    async function clearTabs(excludes: string[] = []) {
        const remainTabIds = { ...getFixedTabIds(tabs.value), ...excludes }
        const removedTabsIds = tabs.value
            .map((tab) => tab.id)
            .filter((id) => !remainTabIds.includes(id))
        const isRemoveActiveTab = removedTabsIds.includes(activeTabId.value)
        const updatedTabs = filterTabsByIds(removedTabsIds, tabs.value)
        function update() {
            tabs.value = updatedTabs
        }

        if (!isRemoveActiveTab) {
            update()
            return
        }

        const activeTab = updatedTabs[updatedTabs.length - 1] || homeTab.value
        await switchRouteByTab(activeTab)
        update()
    }

    async function clearLeftTabs(tabId: string) {
        const tabIds = tabs.value.map((tab) => tab.id)
        const index = tabIds.indexOf(tabId)
        if (index === -1) {
            return
        }
        const excludes = tabIds.slice(index)
        await clearTabs(excludes)
    }

    async function clearRightTabs(tabId: string) {
        const isHomeTab = tabId === homeTab.value?.id
        if (!isHomeTab) {
            clearTabs()
            return
        }

        const tabIds = tabs.value.map((tab) => tab.id)
        const index = tabIds.indexOf(tabId)
        if (index === -1) {
            return
        }
        const excludes = tabIds.slice(0, index + 1)
        await clearTabs(excludes)
    }

    function setTabLabel(label: string, tabId?: string) {
        const id = tabId || activeTabId.value
        const tab = tabs.value.find((tab) => tab.id === id)
        if (!tab) {
            return
        }
        tab.oldLabel = tab.label
        tab.newLabel = label
    }

    function resetTabLabel(tabId?: string) {
        const id = tabId || activeTabId.value
        const tab = tabs.value.find((tab) => tab.id === id)
        if (!tab) {
            return
        }
        tab.newLabel = undefined
    }

    function isTabRetain(tabId: string) {
        if (tabId === homeTab.value?.id) {
            return true
        }

        const fixedTabIds = getFixedTabIds(tabs.value)
        return fixedTabIds.includes(tabId)
    }

    function updateTabsByLocale() {
        tabs.value = updateTabsByI18nKey(tabs.value)
        if (homeTab.value) {
            homeTab.value = updateTabByI18nKey(homeTab.value)
        }
    }

    function cacheTabs() {
        if (!themeSteore.tab.cache) {
            return
        }

        localStg.set('globalTabs', tabs.value)
    }

    useEventListener(window, 'beforeunload', () => {
        cacheTabs()
    })

    async function switchRouteByTab(tab: App.Global.Tab) {
        const fail = await routerPush(tab.fullPath)
        if (!fail) {
            setActiveTabId(tab.id)
        }
    }

    return {
        /** All tabs */
        tabs: allTabs,
        activeTabId,
        initHomeTab,
        initTabStore,
        addTab,
        removeTab,
        removeActiveTab,
        removeTabByRouteName,
        clearTabs,
        clearLeftTabs,
        clearRightTabs,
        switchRouteByTab,
        setTabLabel,
        resetTabLabel,
        isTabRetain,
        updateTabsByLocale,
        getTabIdByRoute,
        cacheTabs
    }
})
