import type { Option } from '@/utils/validation';

export type Form = {
  title: string;
  url: string;
  genreId: number | null;
  hashTagIds: number[];
  hashTagNames: string[];
  note: string;
};

export const initialData: Form = {
  title: '',
  url: '',
  genreId: null,
  hashTagIds: [],
  hashTagNames: [],
  note: '',
};

export const validations: Record<string, Option[]> = {
  title: ['required', 'max:255'],
  url: ['required', 'max:255'],
  genreId: [],
  hashTagIds: [],
  hashTagNames: [],
  note: [],
};

export const names = {
  title: 'タイトル',
  url: 'URL',
  genreId: 'ジャンル',
  hashTagIds: 'ハッシュタグ',
  hashTagNames: 'ハッシュタグ',
  note: 'メモ',
};
