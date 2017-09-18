170918

# CSRF

## CSRF 예제

CSRF(Cross-site Request Forgery, 사이트 간 요청 위조)는 사용자가 악의적인 웹 페이지에 접속했을 때 해당 웹 페이지에서 다른 서버로 요청을 보내어 정보를 조작하는 공격 기법입니다. 전통적인 웹 개발에서 자주 일어나는 보안 사고입니다. (2008년 옥션 개인정보 유출 사건을 참고하세요.)  

URL shotener 서버로 CSRF 공격을 시험해볼 수 있습니다. 로컬 서버를 켜고 상단의 Show 버튼으로 웹 페이지를 열어 요청을 보내보세요.  

CSRF 공격이 가능한 이유는 웹 서버로 오는 요청이 어떤 웹 페이지에서 출발했던 간에 `쿠키가 자동으로 포함`되어 오기 때문입니다. (Ajax 요청은 제외) 이렇게 쿠키는 편하긴 하지만 잘못 다루었을 경우에 보안에 심각한 위협이 될 수 있습니다.  

CSRF 공격을 방어하기 위해서는, `사용자가 우리 웹 페이지에 접속하지 않고는 데이터를 조작하는 요청(POST)을 보낼 수 없게 `만들어야 합니다. 이를 위해 우리 웹 페이지에 접속해야만 받을 수 있는 정보(이를 `CSRF 토큰`이라 부릅니다)를 요청에 포함시켜 보냄으로써 CSRF 공격을 방어할 수 있습니다.  

express 기반 웹 사이트에서는 csurf 미들웨어를 사용해 CSRF 공격을 방어할 수 있습니다.  

[CRURF](https://www.npmjs.com/package/csurf)  

```js
var cookieParser = require('cookie-parser')
var csrf = require('csurf')
var bodyParser = require('body-parser')
var express = require('express')
 
// setup route middlewares 
var csrfProtection = csrf({ cookie: true })
var parseForm = bodyParser.urlencoded({ extended: false })
 
// create express app 
var app = express()
 
// parse cookies 
// we need this because "cookie" is true in csrfProtection 
app.use(cookieParser())
 
app.get('/form', csrfProtection, function(req, res) {
  // pass the csrfToken to the view 
  res.render('send', { csrfToken: req.csrfToken() })
})
 
app.post('/process', parseForm, csrfProtection, function(req, res) {
  res.send('data is being processed')
})
```

```html
<form action="/process" method="POST">
  <input type="hidden" name="_csrf" value="<%= csrfToken %>">
  
  Favorite color: <input type="text" name="favoriteColor">
  <button type="submit">Submit</button>
</form>
```

csrf는 cookie session을 사용할때 문제가 된다.
    
jwt를 사용할때는 csrf는 필요가 없다.
