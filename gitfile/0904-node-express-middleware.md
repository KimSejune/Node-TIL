170904

# Node Express Middleware

## Middleware?

```js
// 미들웨어 = 함수
function helloMiddleware(res, req, next) {
  console.log('hello')
  next()
}

app.use(helloMiddleware)
```
- 요청이 발생할 때 마다 console.log('hello')가 나타난다.


## Middleware

- `함수,` 즉 안에서 어떤 작업이든 가능
- request 객체, response 객체, `next 함수`를 인자로 받음
- request 객체, response 객체를 조작해서 기능 구현
- `다음 미들웨어`를 동작시키기 위해 `next 함수를 인자 없이 호출`
  - 미들웨어는 등록된 `순서가 중요하다` 먼저 등록된 것이 먼저 시작되기 때문이다.
- `등록된 순서대로` 실행됨

## app.use

미들웨어를 앱 전체에서 동작하도록 주입
```js
app.use(helloMiddleware)
```

특정 경로에서만 동작하도록 주입
```js
app.use('/some-path', helloMiddleware)\
```

한번에 여러 개 주입

```js
app.use(middleware1, middleware2, middleware3, ...)
```

## 미들웨어로 하는 일
- 로깅
- HTTP body를 객체로 변환
- 사용자 인증
- 권한 관리

## Why middleware?
미들웨어로 할 수 있는 모든 일은 라우트 핸들러에서도 할 수 있으나, 여러 라우터에서 사용해야 하는 기능을 중복 작성하는 불편을 덜고 `코드를 재사용`하기 위해 미들웨어를 사용하는 것


## 미들웨어 생태계
[Express resource](https://expressjs.com/ko/resources/middleware.html)  
[NPM search](https://www.npmjs.com/search?q=express+middleware)

## 미들웨어 예제
[Link](https://glitch.com/edit/#!/wpsn-middleware-example)

### Express 미들웨어 예제

- middlewares.js 파일에서 작성한 미들웨어를 server.js에서 불러와 사용하고 있습니다. 각각 어떤 방식으로 미들웨어를 사용하고 있는지 확인해보세요.

### next?

- 미들웨어는 req, res에 더해서 next라는 함수를 추가로 인자로 받습니다. next 함수를 호출하면 다음 미들웨어로 처리를 넘기는 효과가 있습니다. `만약에 미들웨어가 next 함수를 호출하지도 않고, 응답도 보내지 않으면 클라이언트는 응답을 받지 못하게 되므로 주의하세요!`

### App Local, Response Local

- app.locals와 res.locals는 특별한 객체를 담고 있습니다. 템플릿에서는 res.render를 통해 명시적으로 주입받지 않아도 저 두 객체의 속성에 바로 접근할 수 있습니다.

- 템플릿을 가리지 않고 사용되는 정보들, 예를 들어 '현재 로그인 중인 사용자 정보' 같은 것을 res.render에 매번 인자로 넘기는 것은 귀찮을 뿐더러 빠뜨리기도 쉽습니다. 그런 정보들을 템플릿에서 쉽게 사용하기 위해, app.locals나 res.locals에 우리가 원하는 이름으로 속성을 주입할 수 있습니다.

- app.locals는 앱 단위로 공통적으로 쓰이는 정보를 담는 목적으로 사용됩니다. res.locals는 각 요청마다 달라지는 정보를 담는 목적으로 사용됩니다.

- app.local 객체를 조작하는 것은 매우 쉽습니다. res 객체는 매 요청마다 새로 생성되어 미들웨어 바깥에서 접근할 수 있는 방법이 없으므로, res.locals를 조작하려면 미들웨어를 사용해야 합니다.

- 미들웨어에서도 `직접 res.send를 통해서 값을 보낼 수 도있다 next or res.send 둘중하나는 꼭 해줘야한다.`

- `app.locals`는 `변하지 않는 값`을 쓸때 사용하고 `res.locals`는 `변경가능한 값`을 쓸때 사용한다.


```js
function makeAdder(x) {
    return function(y) {
        return x + y
    }
}
undefined
add1 = makeAdder(1)
ƒ (y) {
        return x + y
    }
add1(2)
3

// 값이 이렇게 사용해도되는데 이것을 currying이라고 한다.
makeAdder(3)(4)
7 

// 위의 함수와 같은 역할을 한다.
makeAdder2 = x => y => x+y
x => y => x+y
makeAdder2(4)(4)
8

```
- closure를 사용하여서 함수를 2가지를 사용한다 currying이라고도 불린다.

```js
//server.js

const express = require('express')
const {
  ipLoggingMiddleware, 
  urlLoggingMiddleware, 
  resLocalMiddleware,
  lock
} = require('./middlewares')

const app = express()

app.set('view engine', 'ejs')

// 앱 단위 미들웨어는 모든 라우트 핸들러에서 실행됩니다.
// 미들웨어는 등록된 순서대로 실행됩니다.
// 아래 미들웨어 적용 순서를 바꿔보세요.
app.use(urlLoggingMiddleware)
app.use(ipLoggingMiddleware)

// 라우트 단위 미들웨어는 적용된 라우트에서만 실행됩니다.
app.get('/', resLocalMiddleware, (req, res) => {
  res.render('index.ejs')
})

app.get('/secret', lock('thisisthekey'), (req, res) => {
  res.send('my secret is...')
})

// 요청이 라우트 핸들러가 등록된 어떤 경로와도 일치하지 않을 때,
// 맨 마지막 미들웨어를 실행시킬 수 있습니다. 이를 이용해 우리만의 404 페이지를 보여줄 수 있습니다.
// 아래에 작성해보세요. (참고: http://expressjs.com/ko/starter/faq.html)

app.use((req, res, next) => {
  res.render('404.ejs')
})

app.listen(3000, function() {
  console.log('listening...')
})

```


```js
//middlewares.js

exports.ipLoggingMiddleware = (req, res, next) => {
  console.log(`request ip: ${req.ip}`)
  next()
}

exports.urlLoggingMiddleware = (req, res, next) => {
  console.log(`request url: ${req.originalUrl}`)
  next()
}

exports.resLocalMiddleware = (req, res, next) => {
  res.locals.myVar = 'FASTCAMPUS!'
  next()
}

exports.lock = key => (req, res, next) => {
  if (req.query.key === key) {
    next()
  } else {
    res.status(403)
    res.send('403 Forbidden')
  }
}
```

- 404관련 페이지는 가장 밑에서 실행해야한다.

```html
<!DOCTYPE html>
<html>
  <head>
  </head>
  <body>
    <div>
      <%= myVar %>
    </div>
  </body>
</html>
```


## 미들웨어 vs 라우트 핸들러
- 라우트 핸들러도 미들웨어
- 즉, `next함수`를 인자로 받는 것이 가능

```js
app.get('/', (req, res, next) => {
  if (!someCondition) {
    next() // 요청을 처리를 하지 않고 다른 핸들러로 넘김
  } else {
    res.send('hello')
  }
})

```

## 오류 핸들러를 설정하는 방법

- 오류 처리 미들웨어는 다른 미들웨어와 동일한 방식으로 정의할 수 있지만, 다음과 같이 오류 처리 함수는 3개가 아닌 4개의 인수, 구체적으로 말하면 (err, req, res, next) 시그니처를 갖는다는 점이 다릅니다.

- [bugsnag](https://www.bugsnag.com/)

- [sentry](https://sentry.io/welcome/)

```js
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

```





```js

```


```js

```


```js

```


```js

```


```js

```


```js

```


```js

```