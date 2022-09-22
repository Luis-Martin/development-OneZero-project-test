const requestLogger = (ctx, next) => {
  console.log('---------------------------')
  console.log('Method:', ctx.method)
  console.log('Path:  ', ctx.url)
  console.log('Body:  ', ctx.request.body)
  console.log('---------------------------')
  next()
}

module.exports = { requestLogger }
