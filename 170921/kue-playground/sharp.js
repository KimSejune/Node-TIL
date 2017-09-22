const sharp = require('sharp')
const fs = require('fs')
sharp('photo.jpg')
  .resize(200, 200)
  .crop(sharp.gravity.center)
  .toFile('output.png', (err, info) => {
    console.log(info)
  })


const buffer = fs.readFileSync('photo.jpg')
sharp(buffer)
  .resize(200, 200)
  .crop(sharp.gravity.center)
  .toFile('output2.png', (err, info) => {
    console.log(info)
  })
