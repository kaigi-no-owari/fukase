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

開発中にローカルのDBを手動でマイグレーションしたい場合は次の通り

```sh
$ npm run migrate:up
```

## Heroku実行

事前に Heroku Toolbelt を頑張ってインストール

```sh
$ brew install heroku
```

アプリケーションは別途作ってある前提でデプロイ

```sh
$ heroku login
$ heroku git:remote -a <アプリケーション名>
$ git push heroku master
$ heroku open
```

なお、開発中のブランチをデプロイする場合は次の通り

```sh
$ git push heroku <ブランチ名>:master
```

開発中にHerokuのDBを手動でマイグレーションしたい場合は次の通り。`PGSSLMODE` が必要なので注意

```sh
$ heroku config -s | grep DATABASE_URL
DATABASE_URL='postgres://user:password@host:port/<DB名>'
$ vi .env
DATABASE_URL=postgres://user:password@host:port/<DB名>
PGSSLMODE=require
$ npm run migrate:up
```
