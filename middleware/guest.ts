export default defineNuxtRouteMiddleware(() => {
  // サーバーサイドでは何もしない
  if (process.server) return;

  const token = localStorage.getItem('token');

  // 既にログインしている場合はホームにリダイレクト
  if (token) {
    return navigateTo('/');
  }
});
