export type Form = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export const initialData: Form = {
  name: '',
  email: '',
  password: '',
  password_confirmation: '',
};

export const validations = {
  name: ['required', 'max:255'],
  email: ['required', 'email', 'max:255'],
  password: ['required', 'min:8'],
  password_confirmation: ['required', 'min:8', 'same:password'],
};

export const names = {
  name: 'お名前',
  email: 'メールアドレス',
  password: 'パスワード',
  password_confirmation: 'パスワード確認',
}; 