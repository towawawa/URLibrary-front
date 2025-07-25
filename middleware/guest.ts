export default defineNuxtRouteMiddleware(() => {
  // サーバーサイドでは何もしない
  if (process.server) return;

  // 何もしない（リダイレクト処理削除）
});
