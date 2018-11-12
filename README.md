## What's this?

[Vue Fes Japan 2018 Reject Conference](https://vuejs-meetup.connpass.com/event/97557/) にて発表した、「Identiry Provider Keycloak の紹介と、それを用いた Nuxt.js での OpenID Connect 認証機能の実装」のデモ用アプリケーションです。

[Keycloak](https://www.keycloak.org/) を ID Provider に使用し、フロントエンドに[Nuxt.js](https://nuxtjs.org/)、バックエンドの API サーバに[Express](https://expressjs.com)を用いた Web アプリケーションのサンプル実装となっています。

発表内容および解説は[slide.md](slide.md)を見てください。

## Build Setup

### Required

- Node.js
- Yarn
- Docker

### Start keycloak server with MySQL

- http://localhost:8080
- http://localhost:8080/auth/admin/ にアクセスすると Administrator Console にアクセスできる
  - username: `admin`
  - password: `admin`
- Client
  - demo-browser-client
    - Nuxt.js アプリケーションの Client
  - demo-server-client
    - Express API Server の Client

```bash
$ docker-compose up
```

### Start Nuxt.js Application

- http://localhost:3000

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:3000
$ yarn run dev
```

- [トップページ](http://localhost:3000/)
  - Signup, Login, Logout のリンクがある
- [public-api](http://localhost:3000/public-api)
  - keycloak-nodejs-adapter で保護してない API エンドポイントを叩いてるページ
- [protected-api](http://localhost:3000/protected-api)
  - keycloak-nodejs-adapter で保護している API エンドポイントを叩いてるページ
- [protected](http://localhost:3000/protected-api)
  - リダイレクト問題のデモ用ページ

### Start API server

- http://localhost:4000

```bash
$ yarn api
```

- ソースは[`api/index.js`](api/index.js)
- [keycloak-nodejs-connect](https://github.com/keycloak/keycloak-nodejs-connect) でエンドポイントの保護をしている
- [/api/public](http://localhost:4000/api/public)
  - keycloak-nodejs-connect で保護してないエンドポイント
- [/api/protected](http://localhost:4000/api/protected)
  - keycloak-nodejs-connect で保護しているエンドポイント

# 注意点

- `mode: 'spa'` でしか動きません
- 通常 Implicit Flow は HTTPS 前提でしか動作しませんが、localhost で動かす前提で SSL を OFF にして動くようにしています
  - Keycloak の [`'sslRequired': 'none'`](keycloak-demo.json#L20) に設定
  - API サーバを [`NODE_TLS_REJECT_UNAUTHORIZED=0`](package.json#L14) にして起動
