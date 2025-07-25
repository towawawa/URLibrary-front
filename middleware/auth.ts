export default defineNuxtRouteMiddleware((to) => {
  // サーバーサイドでは何もしない
  if (process.server) return;

  const token = localStorage.getItem('token');

  // トークンがない場合でも、ゲストとして利用可能
  // 認証が必要なページは個別に制御

  // パブリックページへのアクセスの場合はホームにリダイレクト
  const publicPages = ['/login', '/signup', '/password-reset'];
  if (publicPages.includes(to.path) && token) {
    return navigateTo('/');
  }
});
