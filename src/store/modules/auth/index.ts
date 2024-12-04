import { SetupStoreId } from '@/enum'
import { useRouterPush } from '@/hooks/common/router'
import { $t } from '@/locales'
import { fetchGetUserInfo, fetchLogin } from '@/service/api/auth'
import { localStg } from '@/utils/storage'
import { defineStore } from 'pinia'
import { computed, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useRouteStore } from '../route'
import { useTabStore } from '../tab'
import { clearAuthStorage, getToken } from './shared'

export const useAuthStore = defineStore(SetupStoreId.Auth, () => {
    const route = useRoute()
    const routeStore = useRouteStore()
    const tabStore = useTabStore()
    const { toLogin, redirectFromLogin } = useRouterPush(false)

    const token = ref(getToken())

    const userInfo: Api.Auth.UserInfo = reactive({
        userId: '',
        userName: '',
        roles: [],
        buttons: []
    })

    const isStaticSuper = computed(() => {
        const { VITE_AUTH_ROUTE_MODE, VITE_STATIC_SUPER_ROLE } = import.meta.env

        return VITE_AUTH_ROUTE_MODE === 'static' && userInfo.roles.includes(VITE_STATIC_SUPER_ROLE)
    })

    const isLogin = computed(() => Boolean(token.value))

    async function resetStore() {
        const authStore = useAuthStore()

        clearAuthStorage()

        authStore.$reset()

        if (!route.meta.constant) {
            await toLogin()
        }

        tabStore.cacheTabs()

        routeStore.resetStore()
    }

    async function login(username: string, passowrd: string, redirect = true) {
        const { data: loginToken, error } = await fetchLogin(username, passowrd)
        if (!error) {
            const pass = await loginByToken(loginToken)
            if (pass) {
                await routeStore.initAuthRoute()
                await redirectFromLogin(redirect)
                if (routeStore.isInitAuthRoute) {
                    window.$notification?.success({
                        title: $t('page.login.common.loginSuccess'),
                        content: $t('page.login.common.welcomeBack', {
                            userName: userInfo.userName
                        }),
                        duration: 4500
                    })
                }
            }
        }
    }

    async function loginByToken(loginToken: Api.Auth.LoginToken) {
        localStg.set('token', loginToken.token)
        localStg.set('refreshToken', loginToken.refreshToken)
        const pass = await getUserInfo()
        if (pass) {
            token.value = loginToken.token
            return true
        }

        return false
    }

    async function getUserInfo() {
        const { data: info, error } = await fetchGetUserInfo()
        if (!error) {
            Object.assign(userInfo, info)
            return true
        }
        return false
    }

    async function initUserInfo() {
        const hasToken = getToken()

        if (hasToken) {
            const pass = await getUserInfo()

            if (!pass) {
                resetStore()
            }
        }
    }

    return {
        token,
        userInfo,
        isStaticSuper,
        isLogin,
        // loginLoading,
        resetStore,
        login,
        initUserInfo
    }
})
