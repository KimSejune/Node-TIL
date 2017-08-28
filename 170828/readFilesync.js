const fs = require('fs')
try {
  const data = fs.readFileSync('./calc.js', 'utf-8')
  console.log(data)
} catch (e) {
  console.error(e)
}



console.log('done!')
