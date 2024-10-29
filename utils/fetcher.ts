import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack';

/**
 * $fetchラッパー
 */
export const fetcher = (
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  path: string,
  options?: NitroFetchOptions<NitroFetchRequest>,
): Promise<any> => {
  // ローカルストレージのトークンをヘッダーにセット
  const token = localStorage.getItem('token');
  const nowLoginPage = useRoute().path === '/login';

  // トークンがない場合はログインページへリダイレクト
  if (!token && !nowLoginPage) {
    useRouter().push('/login');
  }

  // @todo レスポンスの型定義
  return $fetch(path, {
    method,
    baseURL: useRuntimeConfig().public.apiBaseUrl,
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...options,
    onRequest() {},
    onResponse() {},
    onRequestError() {},
    onResponseError({ response }) {
      switch (response.status) {
        case 401: {
          // 認証エラーの場合はログインページへリダイレクト
          if (!nowLoginPage) {
            useRouter().push('/login');
          }

          break;
        }
        default: {
          // その他のエラーはエラーページへリダイレクト
          showError({
            statusCode: response.status,
          });

          break;
        }
      }
    },
  });
};
