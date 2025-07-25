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

  // 認証が必要ないAPI（ゲスト作成、ログイン、登録）
  const publicAPIs = ['/guest/create', '/login', '/register'];
  const isPublicAPI = publicAPIs.some((api) => path === api);

  // 未ログインでも基本的にはAPIアクセス可能
  // ただし、認証必須のAPIは401エラーハンドリングで対応

  // @todo レスポンスの型定義
  const headers: Record<string, string> = {
    Accept: 'application/json',
  };

  // トークンがある場合のみAuthorizationヘッダーを追加
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return $fetch(path, {
    method,
    baseURL: useRuntimeConfig().public.apiBaseUrl,
    headers,
    ...options,
    onRequest() {},
    onResponse() {},
    onRequestError() {},
    onResponseError({ response }) {
      switch (response.status) {
        case 401: {
          // 認証エラーの場合の処理
          if (!nowLoginPage && !isPublicAPI) {
            // トークンが無効な場合はクリア
            localStorage.removeItem('token');

            // 未ログインでAPIアクセスした場合は静かに失敗
            // ゲストアカウント作成は ensureAuthenticated() で明示的に実行
            console.warn('API認証エラー: 未ログイン状態でのAPIアクセス');
          }

          break;
        }
        case 422: {
          throw response;
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
