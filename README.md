# kaigi-no-owari-server
スケジュール情報を配信するAPIサーバー

[![Build Status](https://travis-ci.org/kaigi-no-owari/kaigi-no-owari-server.svg?branch=master)](https://travis-ci.org/kaigi-no-owari/kaigi-no-owari-server)

## ローカル実行

事前に PostgreSQL を頑張ってインストール

```sh
$ brew install postgresql
$ postgres -D /usr/local/var/postgres &
$ createdb <DB名>
```

環境変数を定義した `.env` ファイルを作ってから `npm` で実行

```sh
$ vi .env
DATABASE_URL=postgres://user:password@localhost:5432/<DB名>
$ npm install
$ npm start
```
