# Nuxt環境構築手順

## 手順

1.  `.env.example`をコピーして、`.env`を作成
    必要に応じて、書き換えてください
2.  作業フォルダに移動

```
$ cd "nuxt作業フォルダへのパス"
```

3.  イメージをビルドし、コンテナを起動する

```
$ docker compose up -d
```

4.  コンテナへ入る

```
$ docker exec -it urlibrary-front sh
```

5.  パッケージのインストール

```
$ yarn install
```

6.  開発サーバーの起動

```
$ yarn dev
```

7.  ブラウザで`http://localhost:3000/`へアクセスし、ページが表示されれば完了
