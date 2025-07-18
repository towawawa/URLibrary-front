export type Form = {
  name: string;
  image: File | null;
};

export const initialData: Form = {
  name: '',
  image: null,
};

import type { Option } from '@/utils/validation';

export const validations: Record<string, Option[]> = {
  name: ['required', 'max:255'],
  image: ['max:5120'],
};

export const names = {
  name: 'ジャンル名',
  image: '画像',
};
