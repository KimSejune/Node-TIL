170904

# Node Cookie

## 쿠키의 필요성
- `개별 클라이언트`의 `여러 요청`에 걸친 `정보의 유지`
  - 장바구니
  - 로그인/로그아웃
  - 방문 기록

## HTTP Cookie
- `서버가 응답을 통해 웹 브라우저에 저장하는` 이름+값 형태의 정보
- 웹 브라우저는 쿠키를 저장하기 위한 `저장소`를 가지고 있음
- 저장소는 `자료의 유효기간`과 `접근 권한`에 대한 `다양한 옵션`을 제공

## 쿠키 전송 절차

1. `서버는` 브라우저에 저장하고 싶은 `정보를 응답과 같이 실어 보낸다`(Set-Cookie 헤더)

```
HTTP/1.1 200 OK
Set-Cookie: cookieName=cookieValue; Secure; Max-Age=60000
```

2. 브라우저는 `같은 서버에 요청이 일어날 때마다` 해당 `정보를 요청에 같이 실어서` 서버에 보낸다 (Cookie 헤더)

```
GET / HTTP/1.1
Cookie: cookieName=cookieValue; anotherName=anotherValue
```

## Set-Cookie Options

`Expires, Max-Age`    
- 쿠키의 지속 시간 설정  

`Secure`  
- HTTPS를 통해서만 쿠키가 전송되도록 설정  

`HttpOnly`    
- 자바스크립트에서 쿠키를 읽지 못하도록 설정  

`Domain, Path`  
- 쿠키의 scope 설정 (쿠키가 전송되는 URL을 제한)  

## Express + Cookie

`쿠키 읽기 - req.cookies`
- 요청에 실려온 쿠키가 객체로 변환되어 req.cookies에 저장됨`(cookie-parser middleware 필요)` 

`쿠키 쓰기 - res.cookie(name, value)`
- 쿠키의 생성 혹은 수정

## 쿠키 예제

[Link](https://glitch.com/edit/#!/fog-guitar)

```js
const express = require('express')
const cookieParser = require('cookie-parser')

const app = express()

app.set('trust proxy', 1)
app.use(cookieParser())

app.get('/', (req, res) => {
  res.send(req.cookies)
})

app.get('/somePath', (req, res) => {
  res.send(req.cookies)
})

// 별다른 옵션 없이 쿠키를 저장하는 응답을 보냅니다.
app.get('/set', (req, res) => {
  res.cookie('cookieName', 'cookieValue')
  res.redirect('/')
})

// httpOnly 옵션은 해당 쿠키를 자바스크립트에서 접근할 수 없게 합니다. 즉 보안성이 향상
app.get('/httpOnly', (req, res) => {
  res.cookie('httpOnlyCookie', 'value', {
    httpOnly: true
  })
  res.redirect('/')
})

// secure 옵션은 http 프로토콜을 통한 요청에는 쿠키가 포함되지 않게 합니다. (https로 했을 때만 포함시킴)
app.get('/secure', (req, res) => {
  res.cookie('secureCookie', 'value', {
    secure: true
  })
  res.redirect('/')
})

// maxAge 옵션은 쿠키가 해당 시간이 지났을 때 삭제되도록 합니다.
app.get('/maxAge', (req, res) => {
  res.cookie('maxAgeCookie', 'value', {
    maxAge: 5000
  })
  res.redirect('/')
})

// domain 옵션은 해당 도메인 및 서브도메인으로 쿠키가 전송되도록 합니다.
app.get('/domain', (req, res) => {
  res.cookie('domainCookie', 'value', {
    domain: 'glitch.me'
  })
  res.redirect('/')
})

// path 옵션은 쿠키가 지정된 경로 및 그 하위 경로에 요청이 일어났을 때만 전송되도록 합니다.
// 루트에서는 안보이고 somePath에서는 보인다.
app.get('/path', (req, res) => {
  res.cookie('pathCookie', 'value', {
    path: '/somePath'
  })
  res.redirect('/')
})

// 여러 옵션을 한꺼번에 지정할 수도 있습니다.
app.get('/multiple-options', (req, res) => {
  res.cookie('multipleOption', 'value', {
    secure: true,
    httpOnly: true,
    maxAge: 5000
  })
  res.redirect('/')
})

app.listen(3000, function() {
  console.log('listening...')
})

```

## JavaScript + Cookie

`자바스크립트로도 쿠키를 읽고 쓰는 방법이 존재`하지만, 보안 상 문제를 일으킬 수 있으므로 이런 접근 방식은 거의 사용되지 않는다.

자바스크립트에서 쿠키에 접근하지 못하도록 `HttpOnly를 항상 설정하는 것이 best practice`


## 쿠키의 한계점

- US-ASCII 밖에 저장하지 못함. `보통 percent encoding을 사용`  
- `4000 바이트` 내외(영문 4000자, percent encoding 된 한글 444자 가량)밖에 저장하지 못함
- 브라우저에 저장됨. 즉, `여러 브라우저에 걸쳐 공유되어야 하는 정보`, 혹은 `웹 브라우저가 아닌 클라이언트`(모바일 앱)에 저장되어야 하는 정보를 다루기에는 부적절
