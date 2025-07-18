import type { Option } from '@/utils/validation';

export type Form = {
  email: string;
  password: string;
};

export const initialData: Form = {
  email: '',
  password: '',
};

export const validations: Record<string, Option[]> = {
  email: ['required', 'email'],
  password: ['required'],
};

export const names = {
  email: 'メールアドレス',
  password: 'パスワード',
};
