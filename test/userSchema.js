const userSchema = {
  title: 'User Schema',
  type: 'object',
  required: ['name', 'email', 'age'],
  properties: {
    nome: {
      type: 'string'
    },
    email: {
      type: 'string'
    },
    idade: {
      type: 'number',
      minimum: 18
    }
  }
}

module.exports = userSchema
