import type { UserResource } from '@/types/api/user';

interface AuthState {
  user: UserResource | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isGuest: boolean;
  guestStatus: {
    expires_at: string | null;
    days_remaining: number | null;
    is_expired: boolean;
  } | null;
}

const authState = reactive<AuthState>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  isGuest: false,
  guestStatus: null,
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
      authState.isGuest = false;
      authState.guestStatus = null;
      return;
    }

    try {
      authState.isLoading = true;
      const response = await fetcher('GET', '/me');
      authState.user = response.data;
      authState.isAuthenticated = true;

      // ゲストステータスを確認
      await fetchGuestStatus();
    } catch (error: any) {
      console.error('ユーザー情報の取得に失敗:', error);
      // 401エラーの場合はトークンを削除
      if (error.status === 401) {
        localStorage.removeItem('token');
        authState.isAuthenticated = false;
        authState.user = null;
        authState.isGuest = false;
        authState.guestStatus = null;
      }
    } finally {
      authState.isLoading = false;
    }
  };

  /**
   * ゲストステータスを取得
   */
  const fetchGuestStatus = async (): Promise<void> => {
    try {
      const response = await fetcher('GET', '/guest/status');
      authState.isGuest = response.is_guest;
      authState.guestStatus = response.is_guest
        ? {
            expires_at: response.expires_at,
            days_remaining: response.days_remaining,
            is_expired: response.is_expired,
          }
        : null;
    } catch (error) {
      console.error('ゲストステータスの取得に失敗:', error);
      authState.isGuest = false;
      authState.guestStatus = null;
    }
  };

  /**
   * ゲストアカウントを作成
   */
  const createGuestAccount = async () => {
    try {
      const response = await fetcher('POST', '/guest/create');
      localStorage.setItem('token', response.token);
      await fetchUser();
      return response;
    } catch (error) {
      throw error;
    }
  };

  /**
   * ゲストアカウントを本登録に変換
   */
  const convertGuestToRegular = async (credentials: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => {
    try {
      const response = await fetcher('POST', '/guest/convert', {
        body: credentials,
      });
      localStorage.setItem('token', response.token);
      await fetchUser();
      return response;
    } catch (error) {
      throw error;
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
      authState.isGuest = false;
      authState.guestStatus = null;
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
   * 新規登録が必要かどうかを判定
   */
  const needsRegistration = computed(() => {
    return !authState.isAuthenticated && !authState.isGuest;
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
      // トークンがない場合は未ログイン状態
      // ゲストアカウント作成はミドルウェアで実行される
      authState.isAuthenticated = false;
      authState.user = null;
      authState.isGuest = false;
      authState.guestStatus = null;
      return;
    }

    // ユーザー情報が未取得の場合は取得
    if (!authState.user && !authState.isLoading) {
      await fetchUser();

      // 認証に失敗した場合は未ログイン状態
      if (!authState.isAuthenticated) {
        localStorage.removeItem('token');
        authState.user = null;
        authState.isGuest = false;
        authState.guestStatus = null;
      }
    }
  };

  return {
    // State
    user: readonly(toRef(authState, 'user')),
    isAuthenticated: readonly(toRef(authState, 'isAuthenticated')),
    isLoading: readonly(toRef(authState, 'isLoading')),
    isGuest: readonly(toRef(authState, 'isGuest')),
    guestStatus: readonly(toRef(authState, 'guestStatus')),
    isPublicPage,
    needsRegistration,

    // Actions
    fetchUser,
    fetchGuestStatus,
    createGuestAccount,
    convertGuestToRegular,
    login,
    logout,
    requireAuth,
    initAuth,
  };
};
