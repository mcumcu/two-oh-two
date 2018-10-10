//During the test the env variable is set to test
process.env.NODE_ENV = 'test';

//Require the dev-dependencies
let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../index.js')
let should = chai.should()
var job_id = null

chai.use(chaiHttp);
//Our parent block
describe('Deferred Job', () => {

  /*
  * Test the /GET deferredjob route
  */
  describe('/GET deferredjob', () => {
    it('it should start a deferred job, load the monitor, and fetch the results', (done) => {

      let requester = chai.request(server).keepOpen()

      requester.get('/deferredjob')
      .end((err, res) => {
        monitor_id = res.header.location
        res.should.have.status(202)
        res.should.have.header('location')
        res.header['location'].should.contain(monitor_id)

        requester.get(monitor_id)
        .end((err, res) => {
          result_id = res.header.location
          res.should.have.status(200)

          setTimeout(() => {
            requester.get(monitor_id)
            .end((err, res) => {
              result_id = res.header.location
              res.should.have.status(201)

              requester.get(monitor_id)
              .end((err, res) => {
                request_id = res.header.location
                res.should.have.status(201)
                res.should.have.header('location')
                res.header['location'].should.contain(request_id)

                requester.get(request_id)
                .end((err, res) => {
                  request_id = res.header.location
                  res.should.have.status(201)
                  res.should.have.header('location')
                  res.header['location'].should.contain(request_id)
                })
              })
              done()
            })
          }, 2000)
        })
      })
    })
  })
})
