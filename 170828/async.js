const tenSec = require('./tenSec')

async function resolveAfterTenSec() {
  await tenSec()
  return 1
}

resolveAfterTenSec().then(value => {
  console.log(value)
})
