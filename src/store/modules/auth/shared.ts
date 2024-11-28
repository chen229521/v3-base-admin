import { localStg } from '@/utils/storage';

export function getToken() {
  return localStg.get('token') || '';
}

export function clearToken() {
  localStg.remove('token');
  localStg.remove('refreshToken');
}
