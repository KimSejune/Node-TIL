const fileType = require('file-type')
// fs는 내장 모듈이다.
const fs = require('fs')

const buffer = fs.readFileSync('photo.jpg')
console.log(fileType(buffer))
