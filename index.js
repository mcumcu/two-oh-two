let restify = require('restify')
let server = restify.createServer()
var jobs = {foo: 'bar'}

server.get('/deferredjob', defer)

server.get('/monitor/:job_id', monitor)

server.get('/result/:job_id', result)

server.listen(8080, () => {
  console.log('%s listening at %s', server.name, server.url);
})

function defer(req, res, next) {
  const job_id = Math.random()
  jobs[job_id] = null
  res.header('Location', `/monitor/${job_id}`)
  res.send(202, {job_id: job_id})
  setTimeout(()=>{
    jobs[job_id] = `Result of long-running process ${job_id}.`
    // console.log(`Job ${job_id} completed.`);
  }, 2000)
  next()
}

function monitor(req, res, next) {
  if(jobs[req.params.job_id]) {
    res.header('Location', `/result/${req.params.job_id}`)
    res.send(201, {job_id: req.params.job_id})
  } else {
    res.send(200, {job_id: 'still working...'})
  }
  next()
}

function result(req, res, next) {
  if(jobs[req.params.job_id]) {
    res.send({result: jobs[req.params.job_id]})
  } else {
    res.send(422, {
      message: `Job ${req.params.job_id} failed to complete or was not found.`}
    )
  }
  next()
}

module.exports = server
