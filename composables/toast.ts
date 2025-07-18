export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  persistent?: boolean;
}

interface ToastState {
  toasts: Toast[];
}

const toastState = reactive<ToastState>({
  toasts: [],
});

let toastIdCounter = 0;

export const useToast = () => {
  /**
   * トーストを追加
   */
  const addToast = (
    message: string,
    type: Toast['type'] = 'info',
    duration: number = 5000,
    persistent: boolean = false,
  ): string => {
    const id = `toast-${++toastIdCounter}`;
    const toast: Toast = {
      id,
      message,
      type,
      duration,
      persistent,
    };

    toastState.toasts.push(toast);

    // 自動削除（persistentでない場合）
    if (!persistent && duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  /**
   * 成功メッセージを表示
   */
  const showSuccess = (message: string, duration?: number): string => {
    return addToast(message, 'success', duration);
  };

  /**
   * エラーメッセージを表示
   */
  const showError = (message: string, duration?: number): string => {
    return addToast(message, 'error', duration);
  };

  /**
   * 警告メッセージを表示
   */
  const showWarning = (message: string, duration?: number): string => {
    return addToast(message, 'warning', duration);
  };

  /**
   * 情報メッセージを表示
   */
  const showInfo = (message: string, duration?: number): string => {
    return addToast(message, 'info', duration);
  };

  /**
   * トーストを削除
   */
  const removeToast = (id: string): void => {
    const index = toastState.toasts.findIndex((toast) => toast.id === id);
    if (index > -1) {
      toastState.toasts.splice(index, 1);
    }
  };

  /**
   * 全てのトーストを削除
   */
  const clearToasts = (): void => {
    toastState.toasts.length = 0;
  };

  return {
    // State
    toasts: readonly(toastState.toasts),

    // Actions
    addToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast,
    clearToasts,
  };
};
