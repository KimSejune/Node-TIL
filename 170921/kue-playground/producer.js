const kue = require('kue')
// createQueue를 하면 생성된다.
const queue = kue.createQueue()

setInterval( () => {
  queue.create('my-job', {message: 'hello kue!'})
  .removeOnComplete(true)
  .save()
}, 1000)

