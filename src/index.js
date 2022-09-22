const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const app = new Koa()
const router = new Router()
const { requestLogger } = require('../utils/middleware')

// Middlewares
app.use(bodyParser())
if (process.env.NODE_ENV === 'dev') app.use(requestLogger)

let Users = []

router.get('/', async (ctx) => {
  ctx.body = `Seu servidor esta rodando em http://localhost:${PORT}`
})

// Routes must be in separate files, /src/controllers/userController.js for example

// HTTP requests
router.get('/users', async (ctx) => {
  ctx.body = { total: Users.length, count: 0, rows: Users }
  ctx.status = 200
})

router.post('/user', async (ctx) => {
  const newUser = ctx.request.body

  if (newUser || (newUser.age > 18)) {
    Users.push(newUser)
    ctx.body = newUser
    ctx.response.status = 201
  } else {
    ctx.body = 'Bad request'
    ctx.response.status = 400
  }
})

router.get('/user/:name', async (ctx) => {
  const name = ctx.params.name
  const user = Users.find(user => user.name === name)

  if (user) {
    ctx.body = user
    ctx.response.status = 200
  } else {
    ctx.body = { message: 'User not found' }
    ctx.response.status = 404
  }
})

router.delete('/user/:name', async (ctx) => {
  const name = ctx.params.name
  const user = Users.find(user => user.name === name)

  if (user) {
    ctx.body = user
    Users = Users.filter(user => user.name !== name)
    ctx.response.status = 200
  } else {
    ctx.response.status = 404
  }
})

router.put('/user/:name', async (ctx) => {
  const name = ctx.params.name
  const user = Users.find(user => user.name === name)

  const updateInfo = ctx.request.body
  const updatedUser = { ...user, ...updateInfo }

  if (user) {
    ctx.response.message = 'Updated'
    Users = Users.map(user => (user.name === name) ? updatedUser : user)
    ctx.response.status = 204
  } else {
    ctx.response.status = 404
  }
})

app
  .use(router.routes())
  .use(router.allowedMethods())

const PORT = process.env.PORT || 3000
const server = app.listen(PORT)

module.exports = server
