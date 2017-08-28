const fs = require('fs')
fs.readFile('./calc.js', 'utf-8', (err, data) => {
  if(err){
    console.error(err);
  }else {
    console.log(data);
  }

})
console.log('done!')