export default defineNuxtRouteMiddleware(async (to) => {
  // サーバーサイドでは何もしない
  if (process.server) return;

  // パブリックページ（ログイン・登録画面）の場合はスキップ
  const publicPages = ['/login', '/signup', '/password-reset'];
  if (publicPages.includes(to.path)) {
    return;
  }

  const token = localStorage.getItem('token');

  // トークンがない場合（完全未ログイン）はゲストアカウントを作成
  if (!token) {
    try {
      console.log('🎯 未ログイン状態を検出: ゲストアカウントを作成します');

      const response = await $fetch('/guest/create', {
        method: 'POST',
        baseURL: useRuntimeConfig().public.apiBaseUrl,
        headers: {
          Accept: 'application/json',
        },
      });

      // トークンを保存
      localStorage.setItem('token', response.token);

      console.log('✅ ゲストアカウント作成完了:', response.guest_session_id);
    } catch (error) {
      console.error('❌ ゲストアカウント作成に失敗:', error);
      // エラーの場合もページアクセスは継続（最悪の場合は未ログインのまま）
    }
  }
});
