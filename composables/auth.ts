import type { UserResource } from '@/types/api/user';

interface AuthState {
  user: UserResource | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const authState = reactive<AuthState>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
});

export const useAuth = () => {
  const router = useRouter();
  const route = useRoute();

  /**
   * ユーザー情報を取得
   */
  const fetchUser = async (): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) {
      authState.isAuthenticated = false;
      authState.user = null;
      return;
    }

    try {
      authState.isLoading = true;
      const response = await fetcher('GET', '/me');
      authState.user = response.data;
      authState.isAuthenticated = true;
    } catch (error: any) {
      console.error('ユーザー情報の取得に失敗:', error);
      // 401エラーの場合はトークンを削除
      if (error.status === 401) {
        localStorage.removeItem('token');
        authState.isAuthenticated = false;
        authState.user = null;
      }
    } finally {
      authState.isLoading = false;
    }
  };

  /**
   * ログイン処理
   */
  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await fetcher('POST', '/login', { body: credentials });
      localStorage.setItem('token', response.token);
      await fetchUser();
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * ログアウト処理
   */
  const logout = async (): Promise<void> => {
    try {
      await fetcher('POST', '/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      authState.user = null;
      authState.isAuthenticated = false;
      router.push('/login');
    }
  };

  /**
   * 認証チェック（リダイレクト付き）
   */
  const requireAuth = async (): Promise<void> => {
    const token = localStorage.getItem('token');
    if (!token) {
      await router.push('/login');
      return;
    }

    if (!authState.user) {
      await fetchUser();
    }

    if (!authState.isAuthenticated) {
      await router.push('/login');
    }
  };

  /**
   * ログインページかどうかを判定
   */
  const isPublicPage = computed(() => {
    const publicPages = ['/login', '/signup', '/password-reset'];
    return publicPages.includes(route.path);
  });

  /**
   * ページ初期化時の認証チェック
   */
  const initAuth = async (): Promise<void> => {
    // パブリックページの場合は認証チェックをスキップ
    if (isPublicPage.value) {
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      await router.push('/login');
      return;
    }

    // ユーザー情報が未取得の場合は取得
    if (!authState.user && !authState.isLoading) {
      await fetchUser();

      // 認証に失敗した場合はログインページにリダイレクト
      if (!authState.isAuthenticated) {
        await router.push('/login');
      }
    }
  };

  return {
    // State
    user: readonly(toRef(authState, 'user')),
    isAuthenticated: readonly(toRef(authState, 'isAuthenticated')),
    isLoading: readonly(toRef(authState, 'isLoading')),
    isPublicPage,

    // Actions
    fetchUser,
    login,
    logout,
    requireAuth,
    initAuth,
  };
};
