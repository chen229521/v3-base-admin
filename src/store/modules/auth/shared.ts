import { localStg } from '@/utils/storage'

export function getToken() {
    return localStg.get('token') || ''
}

export function clearAuthStorage() {
    localStg.remove('token')
    localStg.remove('refreshToken')
}
