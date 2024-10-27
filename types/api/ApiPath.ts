type Response = {
  code: 200;
  message: 'ok';
};

interface IndexResponse<T> extends Response {
  data: T[];
}
interface GetResponse<T> extends Response {
  data: T;
}

export type ApiPath = {
  '/login': {
    POST: { token: string };
  };
  '/logout': {
    POST: Response;
  };
};
