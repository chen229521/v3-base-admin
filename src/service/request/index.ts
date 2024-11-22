import type { AxiosResponse } from 'axios';
import { BACKEND_ERROR_CODE, createFlatRequest, createRequest } from '@prb/axios';
// TODO Auth
// import {}

import { $t } from '@/locales';
import { localStg } from '@/utils/storage';
import { getAuthorization, handleExpireRequest, showErrorMsg } from './shared';
import type { RequestInstanceState } from './type';
import { getServiceBaseURL } from '@/utils/service';

const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
const { baseURL, otherBaseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

export const request = createFlatRequest<App.Service.Response, RequestInstanceState>(
  {
    baseURL,
    headers: {
      apifoxToken: 'XL299LiMEDZ0H5h3A29PxwQXdMJqWyY2',
    },
  },
  {
    async onRequest(config) {
      const Authorization = getAuthorization();
      Object.assign(config.headers, { Authorization });
      return config;
    },
    isBackendSuccess(response) {
      return String(response.data.code) === import.meta.env.VITE_SERVICE_SUCCESS_CODE;
    },

    async onBackendFail(response, instance) {
      // TODO handleBackendFail
      return null;
    },

    transformBackendResponse(response) {
      return response.data.data;
    },

    onError(error) {
      let message = error.message;
      let backendErrorCode = '';

      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.msg || message;
        backendErrorCode = String(error.response?.data?.code || '');
      }

      const modalLogoutCodes = import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(',') || [];
      if (modalLogoutCodes.includes(backendErrorCode)) {
        return;
      }

      const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
      if (expiredTokenCodes.includes(backendErrorCode)) {
        return;
      }

      showErrorMsg(request.state, message);
    },
  },
);

export const demoRequest = createRequest<App.Service.DemoResponse>(
  {
    baseURL: otherBaseURL.demo,
  },
  {
    async onRequest(config) {
      const { headers } = config;

      const token = localStg.get('token');

      const Authorization = token ? `Bearer ${token}` : null;
      Object.assign(headers, { Authorization });
      return config;
    },
    isBackendSuccess(response) {
      return response.data.status === '200';
    },
    async onBackendFail(_response) {},
    transformBackendResponse(response) {
      return response.data.result;
    },
    onError(error) {
      let message = error.message;
      if (error.code === BACKEND_ERROR_CODE) {
        message = error.response?.data?.message || message;
      }

      window.$message?.error(message);
    },
  },
);
