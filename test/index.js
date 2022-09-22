const userSchema = require('./userSchema')
const { usersList } = require('./test_helpers')
const app = require('../src/index.js')

const assert = require('assert')
const chai = require('chai')
const chaiHttp = require('chai-http')
const chaiJson = require('chai-json-schema')

chai.use(chaiHttp)
chai.use(chaiJson)

const expect = chai.expect

// Start Test
describe('A simple test suite', () => {
  it('deveria retornar -1 quando o valor não esta presente', () => {
    assert.equal([1, 2, 3].indexOf(4), -1)
  })
})

// application tests
describe('Application tests whit 0 users in the initial state', () => {
  it('the server is online', (done) => {
    chai
      .request(app)
      .get('/')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        done()
      })
  })

  it('should be an empty list of users', (done) => {
    chai
      .request(app)
      .get('/users')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body.rows).to.eql([])
        done()
      })
  })

  it('should create user raupp', (done) => {
    chai
      .request(app)
      .post('/users')
      .send({ name: 'raupp', email: 'jose.raupp@devoz.com.br', age: 35 })
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(201)
        done()
      })
  })
})

// ...add at least 5 more users. if you add a minor user, it should give an error. Ps: do not create the user does not exist
describe('tests with many useres in the initial state', () => {
  // Add 6 new users
  beforeEach(() => {
    usersList.forEach(user => {
      chai
        .request(app)
        .post('/users')
        .send(user)
        .end()
    })
  })

  it('the user "naoExiste" does not exist in the system', (done) => {
    chai
      .request(app)
      .get('/users/naoExiste')
      .end((err, res) => {
        expect(err).to.be.null // error was handled and only one message was sent
        expect(res.body.message).to.be.equal('User not found') // possibly wrong way to check error message
        expect(res).to.have.status(404)
        done()
      })
  })

  it('the user raupp exists and is valid', (done) => {
    chai
      .request(app)
      .get('/users/raupp')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body).to.be.jsonSchema(userSchema)
        done()
      })
  })

  it('should delete user raupp', (done) => {
    chai
      .request(app)
      .delete('/users/raupp')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body).to.be.jsonSchema(userSchema)
        done()
      })
  })

  it('the user raupp should no longer exist in the system', (done) => {
    chai
      .request(app)
      .get('/users/raupp')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(404)
        expect(res.body).to.not.be.jsonSchema(userSchema)
        done()
      })
  })

  it('should be a list with at least 5 users', (done) => {
    chai
      .request(app)
      .get('/users')
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body.total).to.be.at.least(5)
        done()
      })
  })

  it('update user', (done) => {
    const user = usersList[2]
    const name = user.name
    const infoToUpdate = { email: 'newemail@example.com', age: user.age + 1 }

    chai
      .request(app)
      .put(`/users/${name}`)
      .send(infoToUpdate)
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(204)
      })

    chai
      .request(app)
      .get(`/users/${name}`)
      .end((err, res) => {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body.email).to.be.equal(infoToUpdate.email)
        expect(res.body.age).to.be.equal(infoToUpdate.age)
        done()
      })
  })
})
