import { localStg } from '@/utils/storage';

// TODO AuthStore
// authStore

// TODO fetchRefreshToken
// fetchRefreshToken

import type { RequestInstanceState } from './type';

export function getAuthorization() {
  const token = localStg.get('token');
  const Authorization = token ? `Bearer ${token}` : null;
  return Authorization;
}

// TODO handleRefreshToken
async function handleRefreshToken() {}

export async function handleExpireRequest(state: RequestInstanceState) {
  // TODO useRefreshToken
  // if (!state.refreshTokenFn) {
  //   state.refreshTokenFn = handleRefreshToken();
  // }
}

export function showErrorMsg(state: RequestInstanceState, message: string) {
  if (!state.errMsgStack?.length) {
    state.errMsgStack = [];
  }

  const isExist = state.errMsgStack.includes(message);
  if (!isExist) {
    state.errMsgStack.push(message);
    window.$message?.error(message, {
      onLeave: () => {
        state.errMsgStack = state.errMsgStack.filter((msg) => msg !== message);

        setTimeout(() => {
          state.errMsgStack = [];
        }, 5000);
      },
    });
  }
}
