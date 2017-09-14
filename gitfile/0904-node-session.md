170904

# Node Session

## Session

### 사전적 의미
1. (특정한 활동을 위한) 시간
2. (의회 등의)회기; (법정의) 개정 (기간)

### 실질적 의미
`시작 조건`과 `종료조건`이 있는 시간, 또는 회기  
`정보 교환이 지속`되는 시간, 또는 회기

## 세션의 예

- [`HTTP session`](https://developer.mozilla.org/ko/docs/Web/HTTP/Session)
요청 - 응답  
  - 클라이언트가 TCP 연결을 수립합니다(또는 전송 계층이 TCP가 아닌 다른 적당한 연결로).  
  - 클라이언트는 요청을 전송한 뒤 응답을 기다립니다.  
  - 서버는 요청에 대해 처리하고 그에 대한 응답을 상태 코드 그리고 요청에 부합하는 데이터와 함께 돌려보냅니다.  

- [`로그인 세션`](https://en.wikipedia.org/wiki/Login_session)  
로그인 - 로그아웃  

- [`Google Analytics 세션`](https://support.google.com/analytics/answer/2731565?hl=ko)  
페이지 접속 - 30분간 접속이 없으면 종료로 간주 (커스터마이징 가능)  

## 웹 서비스를 위한 세션의 구현
1. 세션이 시작되면, `세션이 시작되었다는 사실을 쿠키에 저장`
2. 세션에 대한 정보를 여러 요청에 걸쳐서 지속시키기 위해, 정보를 `어딘가에 저장`
3. 세션이 만료되면, `세션이 만료되었다는 사실을 쿠키에 반영`  
* 위 방식은 널리 사용되는 방식일 뿐, 반드시 위와 같이 구현해야 하는 것은 아닙니다.

## 세션 스토어

세션에 대한 정보를 저장하는 어딘가

- 쿠키  
- 데이터베이스  
- 파일  
- 기타 정보를 저장할 수 있는 곳 어디든  

## 세션 스토어의 선택

`서비스의 요구사항`에 맞춰서 `적절한 저장소를 선택`하면 됨

- 정보의 형태가 간단하고 자주 바뀔 일이 없으면 `쿠키`  
- 저장해야 할 정보의 양이 많으면 `데이터베이스`  
- 정보가 굉장히 자주 변경되면 `메모리 기반 저장소`  

## 세션? 세션 스토어?

`'세션'`과 `'세션 스토어'`는 엄연히 다른 말이지만 혼용되는 경우가 많습니다.  

`'세션에 정보를 저장한다'`는 말은 `'세션 스토어에 정보를 저장한다'`는 말과 같은 뜻이라고 생각하면 됩니다.  

## Express + Session  
`cookie-session`  
- 쿠키에 모든 정보를 저장하는 세션 스토어.   
- 첫 방문시 무조건 세션 시작  
`express-session`
- 쿠키에는 세션 식별자만 저장하고 실제 정보의 저장은 외부 저장소(데이터베이스 등)를 이용하는 세션 스토어. 외부 저장소에 대한 별도의 설정 필요

## cookie-session 예제  
[Link](https://glitch.com/edit/#!/wpsn-cookie-session-example)  

cookie-session NPM 패키지는 쿠키를 세션 스토어로 사용할 수 있도록 해주며 세션 스토어를 쉽게 사용할 수 있는 방법을 제공합니다.  

server.js 파일과 앱을 열어 어떤 방식으로 동작하는 앱인지 확인하고, 크롬 개발자 도구를 이용해 쿠키가 전달되고 저장되는 모습을 확인하세요.  

## cookie-session 동작 방식  

1. cookie-session 미들웨어는 첫 요청이 일어났을 때 빈 세션 정보(빈 객체)를 req.session에 주입합니다.  
2. 프로그래머는 세션과 관련된 정보를 req.session에 저장합니다. `req.session은 보통의 자바스크립트 객체로, JSON으로 표현될 수 있는 자료라면 뭐든지 저장`할 수 있습니다.  
3. cookie-session 미들웨어는 응답이 일어나기 직전에 req.session 객체를 문자열로 바꾼 뒤(JSON & base64), 쿠키에 저장합니다.  
4. cookie-session 미들웨어는 다음 번 요청부터 쿠키에 저장된 정보를 자바스크립트 객체로 변환해 req.session에 주입합니다.  
5. 프로그래머는 req.session 객체를 이용해 세션 정보를 읽을 수 있습니다. 또한 `세션 정보를 통째로 삭제`하기 위해 미들웨어 또는 라우트 핸들러에서 `req.session = null`을 대입할 수 있습니다.  

## session.sig? 서명!

session 쿠키에 저장된 정보는 일반인은 알아볼 수 없지만 프로그래머라면 쉽게 복원하거나 변경할 수 있습니다. (base64 디코더로 session 쿠키를 변환해보세요) 만약에 세션에 `계정 정보`가 들어있고, 악의적인 해커가 쿠키의 값을 변경해서 세션 스토어를 `조작`할 수 있다면, 마치 다른 사람인 척 행세할 수 있고 그에 따라 정보를 탈취당할 수도 있을 것입니다.  

그래서, cookie-session 미들웨어는 보안 유지를 위해 서명(signature)을 활용하고 있습니다. 컴퓨터 분야에서의 서명이란, 비밀 키를 이용해 정보를 특별한 알고리즘(hashing)으로 변형시킨 것을 말합니다. 서명의 가장 중요한 성질은, 같은 비밀 키로 같은 정보를 서명했을 때 언제나 같은 결과가 나온다는 것, 그리고 비밀 키나 정보 중 어느 한 쪽만 바뀌어도 서명의 결과가 크게 달라진다는 것입니다.  

비밀 키와 서명을 활용하면 `정보가 조작되었는지의 여부를 알 수 있습니다.` 어떤 정보를 서명과 함께 공개하고 비밀 키는 숨기면, 누군가가 정보를 조작해서 올바른 정보인 척 흉내를 내려고 해도 비밀 키를 모르기 때문에 서명을 할 수 없어서 금방 조작인 것이 탄로가 나겠죠.  
  
cookie-session 미들웨어는 응답을 보낼 때 session 쿠키에 저장된 문자열을 비밀 키로 서명해서 그 결과를 session.sig 쿠키에 저장합니다. 만약에 요청에 포함된 session 쿠키를 다시 같은 비밀 키로 서명했는데 session.sig 쿠키와 일치하지 않는다면, 정보가 조작된 것을 알아채고 세션을 아예 삭제해버리는 방식으로 조작을 막습니다!  

서명을 활용할 때 주의할 점이 있습니다.  

1. 비밀 키는 당연히 공개되지 않도록 관리해야 합니다. 비밀 키와 서명 알고리즘이 공개되면 서명이 조작될 수 있습니다.  
2. 키의 길이를 충분히 길게 해야 합니다. 해커가 서명 알고리즘을 알고 있다면, 짧은 비밀 키는 어렵지 않게 계산해낼 수 있습니다.  
3. 서명은 정보의 조작을 막아주지만, 정보의 공개를 막아주지는 않습니다. session 쿠키만 하더라도 base64 디코딩만 거치면 어떤 정보가 들어있는지 바로 확인할 수 있죠. 따라서 비밀번호나 신용카드 번호 등은 cookie-session이 제공하는 세션 스토어에 저장하면 안 됩니다.  

참고로, 이전에 다뤘던 cookie-parser 미들웨어도 옵션을 활성화하면 서명을 사용하여 조작을 방지할 수 있습니다. 곧 배울 JWT도 보안을 위해 서명을 사용하고 있습니다.  

서명 과정을 직접 시험해보고 싶다면 [여기](://www.npmjs.com/package/keygrip)를 참고하세요.


```js
const express = require('express')
const cookieSession = require('cookie-session')

const app = express()

app.set('trust proxy', 1) 
app.set('view engine', 'ejs')

// cookie-session 설정
// name: 쿠키 이름으로 사용할 문자열
// secret: 세션 정보를 서명할 때 사용할 키
// 여러가지 옵션을
app.use(cookieSession({
  name: 'session',
  secret: process.env.SECRET
}))

// req.session.count를 처리하는 미들웨어
const countMiddleware = (req, res, next) => {
  if ('count' in req.session) {
    // count 속성이 있으면 1으.
    req.session.count += 1
  } else {
    // count 속성이 없으면 처음 방문한 것이므로 1로 설정한다.
    req.session.count = 1
  }
  next()
}

// 첫 방문 후, 쿠키 관련 헤더가 요청과 응답에 잘 포함되는지 살펴보고,
// 실제로 쿠키가 어떻게 저장되어있는지 살펴보세요.
app.get('/', countMiddleware, (req, res) => {
  res.render('index.ejs', {count: req.session.count})
})

app.post('/reset-count', (req, res) => {
  delete req.session.count
  res.redirect('/')
})

app.listen(3000, function() {
  console.log('listening...')
})


```
- req.session에다가 값을 저장하면 cookie value에 값이 저장된다.

```html
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
    <div>
      <%= count %>번 째 방문하셨습니다.
    </div>
    <form action="/reset-count" method="post">
      <button type="submit">
        초기화
      </button>
    </form>
  </body>
</html>
```

## 인증(Authentication)과 인가(Authorization)

인증(Authentication)은 클라이언트가 누구인지를 확인하는 과정입니다. 지금은 '인증과 로그인은 같은 말'이라고 생각하셔도 무방합니다.  

인가는 클라이언트가 하려고 하는 작업이 해당 클라이언트에게 허가된 작업인지를 확인하는 과정입니다. '권한 설정'이라고 생각하셔도 무방합니다. 예를 들어 다음 카페나 네이버 클럽에서는 관리자만이 게시판을 만들거나 없앨 수 있도록 인가됩니다.  

## 인증 구현 전략

인증은 여러가지 방식으로 구현될 수 있으며, 여기에서는 우리가 쓰고 있는 cookie-session 의 기능에 맞추어서 구현해보도록 하겠습니다.  

cookie-session이 제공하는 미들웨어는 첫 방문시 바로 세션을 시작하고 (이를 guest session이라 부릅니다) 쿠키에 빈 세션 정보(빈 객체)를 저장합니다. 그래서 첫 방문자에 대해서도 session 객체를 바로 쓸 수 있습니다.  

아래와 같은 규칙으로 인증을 구현해보도록 합니다.  

1. req.session.username === undefined이면 로그인된 사용자가 없는 것으로 간주합니다.  
2. 사용자가 로그인 폼을 전송하면 accounts 배열에 저장된 계정 정보 중에 일치하는 것이 있는지 확인하고, 있다면 req.session.username에 해당 사용자 이름을 저장합니다. 만약 일치하는 계정이 없으면 400 Bad Request 응답을 보냅니다.  
3. req.session.username에 저장된 값이 있다면 해당 사용자로 로그인이 되어 있다고 간주합니다.  
4. 로그아웃을 하기 위해 req.session = null와 같이 대입해서 세션을 초기화합니다.  

(인증이 된 뒤에는 req.user와 res.locals.user에 계정 객체를 주입해서 라우트 핸들러와 템플릿에서 편하게 접근할 수 있도록 미리 코드를 짜 두었습니다.) 


## 인가 구현 전략

관리자만이 비밀 정보(/secret)에 접근할 수 있도록 해 보겠습니다. 사용자가 관리자인지 아닌지의 여부는 계정 객체의 admin 속성에 저장되어 있습니다.  


## 로그인한 정보를 맞는지 확인하여서 값을 찾아낸다.
```js
//server.js
const express = require('express')
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')

const app = express()
const urlencodedMiddleware = bodyParser.urlencoded({extended: false})

app.set('trust proxy', 1) 
app.set('view engine', 'ejs')

const accounts = [
  {
    username: 'tpwns',
    password: 'kim',
    name: '김세준'
  },
  {
    username: 'fast',
    password: 'campus',
    name: '패스트캠퍼스',
    admin: true
  }
]

app.use(cookieSession({
  name: 'session',
  secret: process.env.SECRET
}))

app.use((req, res, next) => {
  if (req.session.username) {
    req.user = res.locals.user = accounts.find(acc => acc.username === req.session.username)
  } else {
    req.user = res.locals.user = null
  }
  next()
})

app.get('/', (req, res) => {
  res.render('index.ejs')
})

app.post('/login', urlencodedMiddleware, (req, res) => {
  const account = accounts.find(acc => acc.username === req.body.username && acc.password === req.body.password)
  // 인증 과정을 작성해주세요.
  if(account){
    req.session.username = account.username
    res.redirect('/')  
  }else {
    res.status(400)
    res.send('400 Bad Request')
    
  }
  
})

function onlyAdminMiddleware(req, res, next) {
  // `/secret`에 접속했을 때 이 미들웨어가 작동합니다.
  // 관리자가 아니면 403 Forbidden 응답을 보내도록 작성해주세요.

  // 위에서 req.session.username에 저장한 값을 통해 비교한다.
  const manage = accounts.find(acc => acc.username === req.session.username)
  
  if(manage.admin == true){
    // next를 통하여 전달한다.
    next()
  }else {
    res.status(403)
    res.send('403 Forbidden')
  }
}

app.get('/secret', onlyAdminMiddleware, (req, res) => {
  res.send('It is my secret')
})

app.post('/logout', urlencodedMiddleware, (req, res) => {
  req.session = null
  res.redirect('/')
})

app.listen(3000, function() {
  console.log('listening...')
})

```

> MiddleWare에서는 성공시 next로 보내줘야한다.

- session.sig을 통하여 session의 보안성이 지켜진다.
