170921

# Kue

- file-type을 이용한 파일 형식 감지  
- Redis In-memory Database  
- [Kue](https://www.npmjs.com/package/kue)를 이용한 작업 큐 구현  
- aws-sdk를 통한 AWS S3 사용  
- Sharp를 이용한 이미지 처리  
  - 이미지 처리 라이브러리
- express.Router  
- multer를 이용한 multipart/form-data 처리  
  - 파일 업로드 지원
- JSDoc  
  - 주석을 통한 문서 생성


## file-type

`file-type`은 파일의 내용을 확인해서 그 파일이 어떤 형식의 파일인지를 탐지해주는 라이브러리입니다. 웹 브라우저와 Node.js 모두에서 동작합니다.  

Node.js의 경우 바이너리 파일을 담는 클래스인 `Buffer`의 인스턴스를 이용해 파일 형식을 탐지할 수 있습니다. `fs` 모듈의 `readFile` 혹은 `readFileSync` 메소드를 이용하면 Buffer 클래스를 사용해볼 수 있습니다.  
- fs는 내장 모듈로써 설치하지 않아도 바로 사용가능하다.

```js
const fs = require('fs')
const fileType = require('file-type')

const buffer = fs.readFileSync('image.png')
console.log(buffer instanceof Buffer)
// true
console.log(fileType(buffer))
// { ext: 'png', mime: 'image/png' }
```


## Redis

Redis는 대표적인 In-memory 데이터베이스입니다. 간단히 key-value 스토어로 사용하거나, 내장된 다양한 자료구조를 사용할 수 있습니다.  

### 설치

macOS의 경우 아래 명령을 통해 설치합니다.

```bash
brew install redis
brew services start redis
```

### Key-value store

`redis-cli`를 실행해서 아래 명령을 시험해보세요.  

```js
// redis-cli 시작
redis-cli

// key-value 추가
set mykey 'Hello Redis!'

// value 가져오기
get mykey

// value 1 증가시키기
incr mycount

// value 5 증가시키기
incrby mycount 5

// value 1 감소시키기
decr mycount

// key가 존재하는지 확인
exists mykey
exists yourkey

// key 삭제
del mykey

// 5초 뒤 key 삭제
expire mycount 5
```


### Data structures

Redis는 다양한 데이터 구조를 내장하고 있습니다.  

아래 list 관련 명령을 시험해보세요.  

```js
// 리스트 오른쪽에 요소 추가
rpush mylist 1
rpush mylist 2 3 4 5

// 범위 가져오기
lrange mylist 0 2

// 리스트 왼쪽에 요소 추가
lpush mylist 6 7 8 9

// 리스트 왼쪽 요소 제거
lpop mylist

// 리스트 오른쪽 요소 제거
rpop mylist
```

아래 hash 관련 명령을 시험해보세요.  

```js
// 해시 속성 추가
hmset user:1000 username fast password campus birthyear 2014

// 해시 속성 가져오기
hget user:1000 username

// 해시 속성 모두 가져오기
hgetall user:1000
```

아래 set 관련 명령을 시험해보세요.  

```js
// 집합에 요소 추가
sadd myset 1 2 3

// 모든 요소 가져오기
smembers myset

// 집합의 요소인지 확인
sismember myset 1

// 랜덤 뽑기
sadd deck 1 2 3 4 5
spop deck
spop deck
```
이 밖에 Redis는 sorted set, bitmap, hyperloglog 등의 자료 구조를 지원합니다. 자세한 내용은 [공식문서](https://redis.io/topics/data-types-intro)를 참고해주세요.  

## Pub/Sub

`Redis`는 데이터의 저장 외에 프로세스 간 `통신을` 위한 발행/구독 기능을 가지고 있습니다. 두 개의 `redis-cli`를 실행한 다음 한 쪽에서는 구독, 한 쪽에서는 발행 명령을 실행해보세요.  
- sub으로 채널을 생성한다.
- pub으로 sub로 생성된 채널에 메시지를 보낼 수 있다.


```js
// 채널 구독
subscribe mychannel

// 메시지 발행
publish mychannel 'Hello Redis!'
```

## Kue

`Kue는` Node.js 기반 비동기 작업 큐입니다. 데이터 저장과 통신을 위해 Redis를 사용합니다. 주로 CPU 부하가 큰 작업(멀티미디어 처리, PDF 생성 등)을 웹 서버와 분리된 다른 프로세스에서 실행시키기 위한 목적으로 사용됩니다.  
- `어떤 작업을 다른 서버로 넘기기위한 방법이다.`

다음과 같이 작업을 생성합니다.  

```js
const kue = require('kue')
const queue = kue.createQueue({
  /* 작업 큐 설정 */
  // 이곳에서 radis관련 설정을 할 수 있다.
})

const jobData = {
  imageUrl: 'https://example.com/image.png',
  type: 'png'
}

queue.createJob('make-thumbnail', jobData)
// 작업이 끝난 뒤에 꼭 지워주는 removeOnComplete 옵션을 써야한다.
  .removeOnComplete(true)
  .save(err => {
    if (err) { /* 에러 처리 */ }
  })
```
위에서 생성된 작업을 다음과 같이 받아서 실행합니다.  
```js
const kue = require('kue')
const queue = kue.createQueue({
  /* 작업 큐 설정 */
})

// 작업을 동시에 10개까지 실행 job 개겣를 받는다.
queue.process('make-thumbnail', 10, (job, done) => {
  processImage(job.imageUrl, job.type)
    .then(() => {
      done()
    })
    .catch(err => {
      done(err)
    })
})
```

## AWS S3

AWS S3는 클라우드 파일 저장소입니다. 여러 프로그래밍 언어로 된 API를 통해 파일을 관리할 수 있고, 저장소 용량에 제한이 없으며 사용한 만큼만 비용을 지불하면 됩니다. (프리 티어 계정이라면 본 실습에서 사용하는 사용량 정도로는 과금이 될 일이 없으니 안심하세요!)  

S3 사용을 위해서는 AWS 계정과 AWS CLI 설정이 필요합니다.  

## AWS CLI 설치

macOS 사용자는 터미널에서 아래의 명령을 차례대로 실행하세요.  

```js
brew install python3
pip3 install --user --upgrade awscli
echo 'PATH=$HOME/Library/Python/3.6/bin:$PATH' >> ~/.zshrc
aws --version
```
설치 후, `aws configure` 명령을 실행하여 계정 생성시에 부여받은 AWS access key ID와 secret key를 입력하세요.  

### 파일 업로드

Node.js에서는 `aws-sdk` npm 패키지를 통해 AWS의 모든 서비스를 사용할 수 있습니다. 아래와 같이 S3에 파일을 업로드할 수 있습니다.  

[aws sdk 참고 자료](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html)

```js
const aws = require('aws-sdk')
const s3 = new aws.S3({
  apiVersion: '2006-03-01'
})

const buffer = ... // 업로드 할 파일

s3.upload({
  ACL: 'public-read', // 익명의 사용자도 파일 경로만 알면 읽기 가능하도록 설정
  Body: buffer,
  Bucket: 'my-bucket-name',
  Key: 'my-file-name',
  ContentDisposition: ... // Content-Disposition 헤더
  ContentType: ... // Content-Type 헤더
}, (err, data) => {
  console.log(data.Location)
})
```

s3에서 버킷을 생성한다.  
- 버킷은 URL에 들어갈 수 있는 이름으로 작성해야한다.

## sharp

`sharp`는 Node.js에서 사용할 수 있는 고속 이미지 프로세싱 라이브러리입니다. 다양한 이미지 처리를 지원합니다. (크기 조정, 병합, 회전, 블러, 색조 변경 등) 자세한 사용법은 [공식 문서](http://sharp.dimens.io/en/stable/)를 참고하세요.  

이 프로젝트에서는 썸네일 이미지 생성을 위해 크기 조정 기능을 사용해보겠습니다. 아래와 같이 크기 조정을 할 수 있습니다.  

설치가 되지 않을 경우   
`1. xcode-select --install`   
`2. npm install node-gyp `

```js
sharp('image.png')
  .resize(200, 200) // 비율에 맞게 줄인다.
  .crop(sharp.gravity.center) // 중앙을 남기고 잘른다.
  .toFile('output.png', (err, info) => {
    console.log(info)
  })

```
Buffer를 사용하는 경우 아래와 같이 작성할 수도 있습니다.  

```js
sharp(inputBuffer)
  .resize(200, 200)
  .crop(sharp.gravity.center)
  .toBuffer()
  .then(buffer => {
    ...
  })
```

```js
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

```

## express.Router

`express.Router`를 사용하면 여러 라우트 핸들러를 묶어 모듈화시킬 수 있습니다. Router 인스턴스는 `app과` 비슷하게 사용하며, Router 인스턴스 자체도 미들웨어이므로 `app.use `메소드를 통해 사용할 수 있습니다.  

```js
const router = express.Router()

router.use(...)

router.get('/some-path', (req, res) => {
  ...
})

router.post('/other-path', (req, res) => {

})

```

```js
const express = require('express')

const app = express()

const router = express.Router()

router.get('/', (req, res) => {
  res.send('hello router')
})

const router2 = express.Router()

router2.get('/', (req, res) => {
  res.send('hello router2')
})


router2.use((req, res, next) => {
  res.status(404)
  res.end('Not Fount')
})

app.use(router)
app.use('/router2', router2)


app.listen('3000', (req, res) => {
  console.log('connect!!')
})

```

위와 같이 라우터 인스턴스를 정의한 이후 `app에` 마운트하여 사용합니다.  

```js
// 아래와 같이 마운트하면 됩니다.
app.use(router)

// 혹은 특정 경로에 마운트할 수도 있습니다.
// 이제부터 /api/some-path, /api/other-path 주소로 접속해야 합니다.
app.use('/api', router)
```  

> api경로를 사용하는 router들을 다른 .js파일로 만들어서 개발하면 좋다.

## multer

`multer는` body-parser와 유사하지만, application/x-www-form-urlencoded 대신 multipart/form-data 형태의 폼 데이터를 처리하기 위해 사용됩니다. multer를 이용해 폼 데이터가 처리되면, `파일을 나타내는 객체`는 `req.file` 혹은 `req.files`에 저장되고 나머지 폼 데이터는 body-parser와 비슷하게 req.body에 저장됩니다.  

```js
const multer = require('multer')
const upload = multer()

// 하나의 파일 처리
app.post('/photo', upload.single('photo'), (req, res) => {
  // req.file : 파일 객체
  // req.body : 나머지 폼 데이터
})

// 여러 개의 파일 처리 (파일 필드가 모두 같은 이름을 사용할 때)
app.post('/photos', upload.array('photo'), (req, res) => {
  // req.files : 파일 객체로 이루어진 배열
  // req.body : 나머지 폼 데이터
})

// 여러 개의 파일 처리 (각각 다른 필드 이름 사용 시)
const uploadMiddleware = upload.fields([
  { name: 'avatar', maxCount: 1 },
  { name: 'gallery', maxCount: 8 }
])
app.post('/photos', uploadMiddleware, (req, res) => {
  // req.files : 필드 이름을 속성 이름으로, 파일 객체로 이루어진 배열을 값으로 하는 객체
  // req.body : 나머지 폼 데이터
})
```

```js
// multer.js
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

```

## JSDoc

JSDoc은 특별한 형태의 주석을 소스코드에 작성하면 그에 따라 문서를 자동으로 생성해주는 문서 생성 도구입니다. JSDoc을 위한 주석을 아래와 같이 작성합니다.  

```js
// image.js

/** 를 치면 나온다.

/**
 * 썸네일 생성 작업을 작업 큐에 추가합니다.
 * @param queue - kue queue 인스턴스
 * @param {string} location - S3에 업로드된 파일의 public url
 * @returns {Promise}
 */
function createThumbnailJob(queue, id) {
  ...
}
```
jsdoc을 설치하고 아래 명령을 실행하면, out 폴더에 문서가 자동으로 생성됩니다.  
 
```js
npm install -g jsdoc
jsdoc image.js

// 문서가 생성된다.
open out/index.html
```
