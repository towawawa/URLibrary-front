export type Form = {
  name: string;
};

export const initialData: Form = {
  name: '',
};

import type { Option } from '@/utils/validation';

export const validations: Record<string, Option[]> = {
  name: ['required', 'max:255'],
};

export const names = {
  name: 'ジャンル名',
};
