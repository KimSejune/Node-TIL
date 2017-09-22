const fs = require('fs')
const aws = require('aws-sdk')
const s3 = new aws.S3({
  apiVersion: '2006-03-01'
})

// aws-cli에서 설정한 accesskey id, secret id를 자동으로 가져온다.
// 설정을 해두면 가져온다.
const buffer = fs.readFileSync('producer.js')
const buffer2 = fs.readFileSync('worker.js')
const buffer3 = fs.readFileSync('photo.jpg')
// ACL = AccessControl 파일의 권한 설정
// key = upload할때의 file이름
// ContentDisposition: inline(바로보여준다) or attachment(다운로드)  HTTP응답 헤더이다
// ContentType HTTP응답 헤더이다

// s3.upload({
//   ACL: 'public-read', // 익명의 사용자도 파일 경로만 알면 읽기 가능하도록 설정
//   Body: buffer,
//   Bucket: 'node-s3-pratice',
//   Key: 'producer.js',
//   ContentDisposition: 'attachement',
//   ContentType: 'text/javascript'
// }, (err, data) => {
//   console.log(data.Location)
// })

// s3.upload({
//   ACL: 'public-read', // 익명의 사용자도 파일 경로만 알면 읽기 가능하도록 설정
//   Body: buffer2,
//   Bucket: 'node-s3-pratice',
//   Key: 'worker.js',
//   ContentDisposition: 'inline',
//   ContentType: 'text/javascript'
// }, (err, data) => {
//   console.log(data.Location)
// })

s3.upload({
  ACL: 'public-read', // 익명의 사용자도 파일 경로만 알면 읽기 가능하도록 설정
  Body: buffer3,
  Bucket: 'node-s3-pratice',
  Key: 'photo.jpg',
  ContentDisposition: 'inline',
  ContentType: 'image/jpeg'
}, (err, data) => {
  console.log(data.Location)
})
