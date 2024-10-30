import type { Option } from '@/utils/validation';

export type Form = {
  title: string;
  url: string;
  genreId: number | null;
  hashTagIds: number[];
  note: string;
};

export const initialData: Form = {
  title: '',
  url: '',
  genreId: null,
  hashTagIds: [],
  note: '',
};

export const validations: Record<string, Option[]> = {
  title: ['required', 'max:255'],
  url: ['required', 'max:255'],
};

export const names = {
  title: 'タイトル',
  url: 'URL',
};
