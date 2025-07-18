export default defineNuxtRouteMiddleware((to) => {
  // サーバーサイドでは何もしない
  if (process.server) return;

  const token = localStorage.getItem('token');

  // トークンがない場合はログインページにリダイレクト
  if (!token) {
    return navigateTo('/login');
  }

  // パブリックページへのアクセスの場合はホームにリダイレクト
  const publicPages = ['/login', '/signup', '/password-reset'];
  if (publicPages.includes(to.path) && token) {
    return navigateTo('/');
  }
});
