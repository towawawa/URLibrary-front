export type Master = {
  id: number;
  name: string;
};

export const useMaster = () => {
  const hashTags = useState<Master[]>(() => []);
  const genres = useState<Master[]>(() => []);

  const getMasters = async (): Promise<void> => {
    await fetcher('GET', '/masters').then((res) => {
      hashTags.value = res.data.hashTags as Master[];
      genres.value = res.data.genres as Master[];
    });
  };

  // 呼び出されたタイミングで１回セットする
  getMasters();

  return {
    getMasters,
    hashTags,
    genres,
  };
};
