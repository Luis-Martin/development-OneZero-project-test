const Router = require('koa-router')
const router = new Router()

let Users = []

router.get('/users', async (ctx) => {
  ctx.body = { total: Users.length, count: 0, rows: Users }
  ctx.status = 200
})

router.post('/users', async (ctx) => {
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

router.get('/users/:name', async (ctx) => {
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

router.delete('/users/:name', async (ctx) => {
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

router.put('/users/:name', async (ctx) => {
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

module.exports = router
