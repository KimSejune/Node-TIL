170829

# Node Express

## 실습환경
[Glitch Tutorial](https://glitch.com/edit/#!/wpsn-glitch-tutorial)

[나의 Glitch](https://glitch-sejune-pratice.glitch.me/)

## Express
- Node.js 생태계에서 `가장 널리 쓰이는 웹 프레임워크`
- 내장하고 있는 기능은 매우 적으나, `미들웨어를` 주입하는 방식으로 기능을 확장하는 `생태계`를 가지고 있음
- [공식 매뉴얼 한국어 번역](https://expressjs.com/ko/)

## Express 앱의 기본 구조

```js
// Express Instance 생성
const app = express()

// 미들웨어 주입
app.use(sessionMiddleware())
app.use(authenticationMiddleware())

// router handler register
app.get('/', (request, response) => {
  response.send('Hello express!')
})

// Server Start
app.listen(3000, ()=>{
  console.log('Example app listening on port 3000!')
})
```

## Routing

```js

const app = express()

// HTTP Request Method (GET, POST, DELETE, PUT, ...)
app.get('/articles', (req, res) => {
  res.send('Hello Routing!')
})

// 특정 경로에만 미들웨어를 주입하는 것도 가능
app.post('/articles', bodyParserMiddleware(), (req, res) => {
  database.articles.create(req.body)  // 요청한 body를 넣어둔다.
  .then(() => {
    res.send({ok: true})
  })
})

// 경로의 특정 부분을 함수의 인자처럼 입력받을 수 있음
app.get('/articles/:id', (req, res)=> {
  database.articles.find(req.params.id) // 'req.params.id'에 요청한 사람의 id가 저장된다.
    .then(article => {
      res.send(article)
    })
})
```

## Request 객체

`req.body`  
- requset.body를 적절한 형태의 자바스크립트 객체로 변환하여 이곳에 저장 (`body-parser 미들웨어`에 의해 처리됨)

`req.ip`  
- 요청한 쪽의 IP  

`req.params`  
- route parameter 

`req.query`  
-  query string이 객체로 저장됨  

## Response 객체
`res.status(...)`    
- 응답의 상태 코드를 지정하는 메소드

`res.append(...)`  
- 응답의 헤더를 지정하는 메소드  

`res.send(...)`
- 응답의 바디를 지정하는 메소드 인자가 `텍스트면 text/html`, `객체면 application/json `타입으로 응답

> 숫자를 send에 넣으면 error가 발생한다.