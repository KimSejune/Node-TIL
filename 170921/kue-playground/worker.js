const kue = require('kue')
// createQueue를 하면 생성된다.
const queue = kue.createQueue()

queue.process('my-job', 4, (job, done) => {
  // job.data 에 값이 들어온다.
  console.log(job.data.message)
  done()
})
