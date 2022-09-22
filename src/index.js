const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const app = new Koa()
const userRouter = require('../controllers/userController')
const { requestLogger } = require('../utils/middleware')

// Middlewares
app.use(bodyParser())
if (process.env.NODE_ENV === 'dev') app.use(requestLogger)

userRouter.get('/', async (ctx) => {
  ctx.body = `Seu servidor esta rodando em http://localhost:${PORT}`
})

app
  .use(userRouter.routes())
  .use(userRouter.allowedMethods())

const PORT = process.env.PORT || 3000
const server = app.listen(PORT)

module.exports = server
