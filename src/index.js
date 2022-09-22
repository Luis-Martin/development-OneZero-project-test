const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa()
const router = new Router()

router.get('/', async (ctx) => {
  ctx.body = `Seu servidor esta rodando em http://localhost:${PORT}`
})

// Routes must be in separate files, /src/controllers/userController.js for example
router.get('/users', async (ctx) => {
  ctx.status = 200
  ctx.body = { total: 0, count: 0, rows: [] }
})

app
  .use(router.routes())
  .use(router.allowedMethods())

const PORT = process.env.PORT || 3000
const server = app.listen(PORT)

module.exports = server
