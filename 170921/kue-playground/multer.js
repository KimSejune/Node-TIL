const express = require('express')
const multer = require('multer')
const sharp = require('sharp')

const app = express()
const upload = multer()

app.set('view engine', 'pug')

app.get('/', (req, res) => {
  res.render('index.pug')
})

app.post('/', upload.single('photo'), (req, res) => {
  // 들어오는 photo가 buffer에 들어온다.
  sharp(req.file.buffer)
    .resize(200, 200)
    .crop(sharp.gravity.center)
    .toFile('output3.png', (err, info) => {
      console.log(info)
      res.redirect('/')
    })

})


app.listen('3000', (req, res) => {
  console.log('connect!!')
})
