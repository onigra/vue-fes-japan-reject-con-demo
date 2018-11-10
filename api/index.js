const Keycloak = require('keycloak-connect')
const express = require('express')
const session = require('express-session')

const app = express()

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000')
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  )
  res.header('Access-Control-Allow-Methods', 'GET')
  next()
})

// session store settings
const memoryStore = new session.MemoryStore()
app.use(
  session({
    secret: 'mySecret',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
  })
)

// https://onigra.github.io/blog/2018/02/25/keycloak-nodejs-connect-with-bearer-only-client/
Keycloak.prototype.redirectToLogin = function(req) {
  const apiMatcher = /^\/api\/.*/i
  return !apiMatcher.test(req.originalUrl)
}

const kcConfig = {
  realm: 'demo',
  bearerOnly: true,
  authServerUrl: 'http://localhost:8080/auth',
  clientId: 'demo-server-client'
}

const keycloak = new Keycloak({ store: memoryStore }, kcConfig)
app.use(keycloak.middleware())

// 認証が不要なエンドポイント
app.get('/api/public', function(req, res) {
  res.json({ message: 'this is public endpoint.' })
})

// 認証が必要なエンドポイント
app.get('/api/protected', keycloak.protect(), function(req, res) {
  res.json({ message: 'this is protected endpoint.' })
})

app.listen(4000, () => console.log('api server start http://localhost:4000'))
