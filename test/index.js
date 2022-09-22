const userSchema = require('./userSchema')
const app = require('../src/index.js')

const assert = require('assert')
const chai = require('chai')
const chaiHttp = require('chai-http')
const chaiJson = require('chai-json-schema')

chai.use(chaiHttp)
chai.use(chaiJson)

const expect = chai.expect

// Start Test
describe('A simple test suite', function () {
  it('deveria retornar -1 quando o valor não esta presente', function () {
    assert.equal([1, 2, 3].indexOf(4), -1)
  })
})

// application tests
describe('Application tests', () => {
  it('the server is online', function (done) {
    chai
      .request(app)
      .get('/')
      .end(function (err, res) {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        done()
      })
  })

  it('should be an empty list of users', function (done) {
    chai
      .request(app)
      .get('/users')
      .end(function (err, res) {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body.rows).to.eql([])
        done()
      })
  })

  it('should create user raupp', function (done) {
    chai
      .request(app)
      .post('/user')
      .send({ nome: 'raupp', email: 'jose.raupp@devoz.com.br', idade: 35 })
      .end(function (err, res) {
        expect(err).to.be.null
        expect(res).to.have.status(201)
        done()
      })
  })
  // ...add at least 5 more users. if you add a minor user, it should give an error. Ps: do not create the user does not exist

  it('the user "naoExiste" exist does not exist in the system', function (done) {
    chai
      .request(app)
      .get('/user/naoExiste')
      .end(function (err, res) {
        expect(err.response.body.error).to.be.equal('User not found') // possibly wrong way to check error message
        expect(res).to.have.status(404)
        expect(res.body).to.be.jsonSchema(userSchema)
        done()
      })
  })

  it('the user raupp exists and is valid', function (done) {
    chai
      .request(app)
      .get('/user/raupp')
      .end(function (err, res) {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body).to.be.jsonSchema(userSchema)
        done()
      })
  })

  it('should delete user raupp', function (done) {
    chai
      .request(app)
      .delete('/user/raupp')
      .end(function (err, res) {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body).to.be.jsonSchema(userSchema)
        done()
      })
  })

  it('the user raupp should no longer exist in the system', function (done) {
    chai
      .request(app)
      .get('/user/raupp')
      .end(function (err, res) {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body).to.be.jsonSchema(userSchema)
        done()
      })
  })

  it.skip('should be a list with at least 5 users', function (done) {
    chai
      .request(app)
      .get('/users')
      .end(function (err, res) {
        expect(err).to.be.null
        expect(res).to.have.status(200)
        expect(res.body.total).to.be.at.least(5)
        done()
      })
  })
})
