170828

# Node Rest API 실습

## PostMan
- REST API를 시험해볼 수 있는 도구
- 다양한 편의기능 제공

## Github Rest API
- https://api.github.com/users/KimSejune
  - 나의 정보를 받아올수있다.
[Rest API link](https://developer.github.com/v3/)

- HTTP의 전송
  - GET/user/repo
  - Authorization은 Basic, Digest, Bearer 3가지로 이루어져있다.

## Node.js
- NVM을 통하여 새로운 노드를 추가적으로 설치한다.
- nvm 설치방법
`curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash`
  - 터미널을 종료한 후에 
  
```
  export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion
```

```
# 주석: `#`으로 시작하는 명령은 bash에서 무시됩니다.
# 아래 명령을 한 줄씩 차례대로 입력하세요
$ nvm install 8.4
$ nvm use 8.4
$ nvm alias default 8.4 # nvm-windows는 필요없음
```


- 다시 돌아가는 방법
  - `nvm ls`를 하고 `nvm use system`을 하면 원래사용하던 node로 돌아온다. 
  - `nvm use default`를 통해서 nvm으로 돌아온다.

```js
// 여러 줄에 나눠서 입력하기
> function factorial2(n) {
... return n < 1 ? 1 : n * factorial(n-1)
... }
undefined

> factorial2(4)
24

// `.exit`를 입력하거나 `Ctrl+C`를 두 번 입력해서 나가기
> .exit
```

- node.js module을 사용한다.

```js
// Node.js module 사용하기
> const os = require('os') // 급할땐 `os = ...`
undefined

> os.platform()
'darwin'

> os.freemem()
658300928
```

- 운영체제에 상관없이 경로를 사용할 수 있게 해준다.
[node.js path api](https://nodejs.org/dist/latest-v8.x/docs/api/path.html)


## Node.js로 파일 실행시키기

```bash
$ node (파일 경로)
```

## Node js의 이론

- node.js 는 `js의 runtime`이며 `chrome의 Javascript V8 engine`을 사용한다.
- `event-drive, non-blocking I/O model`을 사용한다.

## JavaSCript runtime
- js는 언어
- `js runtime은` js를 구동하기 위해 필요한 `실행 환경 `
- 프로그래머는 런타임이 제공하는 도구를 응용해서 프로그램을 개발
- 웹 브라우저(chrome, edge)나 Node.js도 JavaScript 런타임의 일종
  - Chrome이 제공하는 웹 브라우저용 런타임
  - Node.js가 제공하는 서버용 런타임
  - MongoDB가 제공하는 데이터 처리용 런타임
  - Photoshop이 제공하는 전용 런타임

## V8 JavaScript Engine
- JIT(Just-In-Time) compilation
- Code Optimization
- Used in
  - Google Chrome
  - Node.js
  - MongoDB
  - ...
- js가 V8 js engine을 통하여 속도가 대폭 향상되었다.

## Event-driven Programming
- `프로그램의 흐름`이 외부 요인에 의해 일어나는 `사건`에 의해 결정되는 프로그래밍 양식
- 약속된 방식으로 `이벤트 핸들러를 작성`함으로써 외부 이벤트가 일어났을 때 코드를 실행  
  - 마우스 입력
  - 키보드 입력
  - `다른 프로그램/컴퓨터로부터의 통신`

```js
// DOM 이벤트 핸들러 등록 (웹 브라우저)
domElement.addEventListener('click', function(e) {
  e.stopPropagation()
  alert('hello')
})

// 서버도 똑같이 합니다.
// (단, 프레임워크를 쓸 때는 직접 이벤트를 다룰 일이 별로 없음)
// HTTP 응답 이벤트 핸들러 등록 (Node.js)
httpResponse.on('data', data => {
  console.log(data)
})
```
- node.js를 할 때 직접적으로 이벤트를 다룰 일은 별로 없다.

## Non-blocking I/O
- Blocking I/O는 스레드가 입력/출력이 완료될 때까지 기다렸다가 다음 코드를 실행
- Non-blocking I/O는 스레드가 입력/출력을 기다리지 않고 코드를 계속 실행
  - I/O 성능 향상 & 복잡한 코드

## Node.js Module

```js
// name.js

// `module.exports`에 저장한 값은 다른 모듈에서 불러올 수 있음
module.exports = {
  familyName: '김',
  givenName: '승하',
  fullName: function() {
    return this.familyName + this.givenName
  }
}
// calc.js

// `exports`로도 참조 가능
exports.add = (x, y) => x + y
exports.sub = (x, y) => x - y
```

- name.js에서 저장한 module.exports의 값들을 다른 파일에서 사용할 수 있게한다.
  - module.exports 안에는 빈객체가 들어있어서 exports. ~~ 를해도 코드가 작동한다.
  - module를 생략해도된다. `단) 객체를 통째로 생성할때는 module을 붙여준다.`

```js
> const name = require('./name.js')
undefined
> name
{ familyName: '김',
  givenName: '세준',
  fullName: [Function: fullName] }
> name.familyName
'김'
> name.givenName
'세준'
> name.fullName
[Function: fullName]
> name.fullName()
'김세준'
> 

```

- 객체를 내가원하는 함수에다가 바로 넘길수도 있다 `ReceiveObjsct(require('./name.js'))`
- node.js는 module마다 각각의 scope가 존재한다. 그래서 전역에다가 저장이 안되고 module scope에다가 저장을 한다.
  - `다른 module에서 사용하려면 무조건 export안에 들어있어야한다.`

## REPL에서 불러오기
- Node.js 패키지 관리 도구 + 클라우드 패키지 저장소
  - 의존 패키지 관리
  - 스크립트 실행
  - 패키지 설정
  - NPM에 패키지 배포
  - Node.js 종합 작업 도구

## Hello NPM

```bash
$ mkdir hello-npm
$ cd hello-npm
$ npm init -y
$ code .
// package.json
{
  "name": "hello-npm",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}

```

## package.json
- 패키지 정보를 담고 있는 파일

- `dependencies`
  - `npm install --save` 명령으로 설치한 패키지가 기록됨

- `scripts`
  - 원래 목적은 패키지 생명주기마다 자동으로 실행되는 명령을 등록하기 위함이나, 개발자 편의를 위해 자주 사용되는 명령을 등록하는 용도로 더 많이 사용됨

```js
$ npm install --save randomstring # node_modules에 저장됨
// index.js
const randomstring = require('randomstring')
console.log(randomstring.generate())
// package.json
...
  "scripts": {
    "start": "node index.js"
  }
...
$ npm start // start라는 이름으로 script에 등록을 하여서 실행시킬수있다.

```

## Concurrency(동시성)

## Concurrency Model(동시성 모델)
- 프로그램이 생애 주기가 겹치는 여러 실행 과정을 통해 실행된다 하더라도 프로그램의 결과에는 영향을 미치지 않는 성질
- 생애 주기가 겹치는 `여러 실행 과정`이 자원을 공유할 때 어떻게 `충돌`이 생기지 않도록 할 것인가?


## Resources
- CPU
- Memory
- Network

## thread
- 코드 실행의 가장 작은 단위 프로그램은 하나 이상의 스레드로 이루어짐
- CPU 코어 하나는 한 번에 하나의 스레드를 실행

- thread 확인방법

```bash
$ sysctl -n hw.ncpu  // 시스템의 코어개수
```

## 운영체제 차원의 도구
- Process
- Thread
- Mutex (Mutual Exclusion)

## 언어 차원의 도구
- Python - asyncio
- Go - goroutine
- Erlang - actor
- JavaScript - ...?

## 자바스크립트의 동시성(Single-Threaded Event Loop)
- 자바스크립트를 실행시키는 스레드가 하나 뿐임
- 실행 과정(보통 콜백 연쇄)의 `생애 주기가 겹칠 수는 있지만` 어떤 경우에도 두 자바스크립트 실행과정이 `동시에 실행되는 경우는 없음`
- 내부적으로 `메시지 큐를` 활용하고 있으나, 모든 처리가 자동으로 이루어짐
[MDN](https://developer.mozilla.org/ko/docs/Web/JavaScript/EventLoop)

### 장점
- 프로그래머가 동시성에 대해 신경쓸 필요가 없어짐
- 프로그램 작성이 쉬워짐

### 단점
- CPU를 많이 쓰는 작업에 부적절
- 오래 걸리는 자바스크립트 코드가 실행되면 전체 프로그램에 영향을 미침

### 전략
- 오래 걸리는 일은 `외부에 위임`하고 넘어간 뒤, 나중에 결과를 받아 처리하기
  - Database
  - Node.js-External libraries
  - Web browser - webAssembly

- 긴 실행과정을 `여러개의 함수로 쪼개서 `한 번의 함수 실행이 금방 끝나게 만들기

## Ascynchronous JavaScript
- non-blocking하고 비슷한 개념이다.
- 코드의 작성법에 대한 개념이다.

## Ascynchronous Callback
- 함수를 호출할 떄, 콜백까지 같이 인자에 넣어서 호출하는 비동기 프로그래밍 양식
- 콜백에서 에러 인자를 받는 방식으로 에러 처리를 함
- Node.js 내장 모듈 전체가 이 방식을 사용하도록 만들어져 있음
  - 모든 콜백이 비동기인 것은 아님  
```js
> [1,2,3].map(x => x*x)
[ 1, 4, 9 ]
```
- 계산을 기다렸다가 바로 출력한다.

- readFile
  - fs라는 file에 내장되어있다.
- 첫번째 인자를 err로 받는다.

```js
// readFile.js 비동기식 코드
const fs = require('fs') // Node.js 내장 모듈
fs.readFile('./calc.js', 'utf8', (err, data) => {
  console.log(data)
})
console.log('done!')

// readFileSync.js 동기식 코드
const fs = require('fs') // Node.js 내장 모듈
const data = fs.readFileSync('./calc.js', 'utf8')
console.log(data)
console.log('done!')
```
- `try, catch는 동기식에서만` 에러처리를 할 수 있다. 

## request 설치

```bash
$ # hello-npm 폴더 안에서 실행
$ npm install --save request
```

## Github REST API 호출

```js
// 유저 이름, 저장소, 할당된 이슈 갯수 출력하기
const request = require('request')
const apiUrl = 'https://api.github.com'
const option = {
  json: true,
  auth: {
    'user': 'username',
    'pass': 'password',
  },
  headers: {
    'User-Agent': 'request'
  }
}
request.get(`${apiUrl}/user`, option, function (error, response, body) {
  const name = body.name
  if (error) console.error(error)
  // 콜백 안에 콜백
  request.get(`${apiUrl}/user/repos`, option, function (error, response, body) {
    if (error) console.error(error)
    const repoNames = body.map(item => item.name)
    // 콜백 안에 콜백 안에 콜백
    request.get(`${apiUrl}/issues`, option, function (error, response, body) {
      if (error) console.error(error)
      const issueNum = body.length
      console.log(`name: ${name}`)
      console.log('repos:')
      repoNames.forEach(name => {
        console.log(name)
      })
      console.log(`num of assigned issues: ${issueNum}`)
    })
  })
})
```
- request function이 만든사람이 error, response, body 를 parameter로 받는다.

## Callback Hell
- Callback의 Hell을 방지하기 위해서 Promise를 사용한다.

## Promise
- 비동기 작업의 `결과`를 담는 `객체`
- 정확히 언제가 될지 모르지만, `결국 성공 또는 실패의 상태`를 갖게 됨

```js
// tenSec.js
module.exports = function tenSec(value) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(value)
    }, 10000)
  })
}
// REPL
> const tenSec = require('./tenSec')
> const p = tenSec(1)
> p // 만든지 10초가 지나기 전
Promise {
  [pending],
  ...
> p // 만든지 10초가 지난 후
Promise {
  1,
  ...
```
- export안에 함수를 넣어서 값이 함수로 나온다.

```js
> tenSec('hello promise').then(value => {
... console.log(value)
... })
Promise { // `then`은 Promise를 반환
  [pending],
  ...
> // 10초 후
'hello promise'
```

> then안에서 promise를 return하면 promise를 벗기고 안의 값만 들어간다.

```js
// chaining.js
const tenSec = require('./tenSec')
tenSec('hello promise')
  .then(value => {
    console.log(value)
    return 1 // 위 `.then`은 값이 1인 Promise를 반환함
  })
  .then(value => {
    console.log(value)
    return tenSec('new promise') // Promise도 반환할 수 있음
  })
  .then(value => {
    console.log(value)
  })
  .then(() => {
    throw new Error('error in promise')
  })
  .catch(err => {
    console.error(err)
  })
  .then(() => { // 에러 처리 이후에도 코드 실행 가능
    console.log('done')
  })
```
- catch 앞의 tehn 부분에서 에러가 발생하면 catch안의 값이 실행된다.
  - `맨 위의 then에서 에러가나면 바로 catch로 넘어간다.`

- promise.all([...]) 배열안의 넘기는 값들이 모두 성공해야지 성공한다.
- promise.rade([...]) 배열안의 값중에서 먼저 성공한것을 나타낸다.

## readFile - promise

- node.js v8부터 새로들어온 함수이다.

```js
// readfilePromise.js
const {promisify} = require('util') // Node.js 8.0.0부터 추가됨
const fs = require('fs')
const readFile = promisify(fs.readFile)
readFile('./calc.js', 'utf8')
  .then(data => {
    console.log(data)
  })
  .catch(err => {
    console.error(err)
  })

```
- 파일을 다읽으면 반환하는 promise파일을 반환한다.

## Promise의 특징
- 이미 resolve 된 Promise에도 콜백을 실행할 수 있음

```node
> const resolved = Promise.resolve(1)
> resolved.then(v => console.log(v))
```
- `.then`에 넘겨진 콜백은 무조건 다음 루프에 실행됨

```node
> (function() {
... Promise.resolve(1).then(v => console.log(v))
... console.log('done!')
... })()
/* 출력:
done!
1
*/
```

## Promise.all

```js
// npm install --save request-promise
const rp = require('request-promise')
const apiUrl = 'https://api.github.com'
const option = {
  json: true,
  auth: {
    'user': 'username',
    'pass': 'password',
  },
  headers: {
    'User-Agent': 'request'
  }
}

const userPromise = rp.get(`${apiUrl}/user`, option)
const reposPromise = rp.get(`${apiUrl}/user/repos`, option)
const issuesPromise = rp.get(`${apiUrl}/issues`, option)

// 배열 내의 모든 Promise 객체가 완료되었을 때
// resolve 되는 Promise를 만든다.
Promise.all([userPromise, reposPromise, issuesPromise])
  .then(([user, repos, issues]) => {
    console.log(`name: ${user.name}`)
    console.log('repos:')
    repos.forEach(repo => {
      console.log(repo.name)
    })
    console.log(`num of assigned issues: ${issues.length}`)
  })
```
[axios](https://www.npmjs.com/package/axios)  
[fetch api](http://hacks.mozilla.or.kr/2015/05/this-api-is-so-fetching/)  

> fetch api, axios를 통하여 Ajax통신을 promise를 통하여 통신을 할 수 있게한다.

## Async/Await
- javascript의 문법을 바꾸어버렸다.
- 비동기 코드를 동기식 코드처럼 편하게 짤 수 있게 만든 것이다.
  - async function은 무조건 promise를 반환하며 await가 완료될때 까지 기다린다.
```js
const tenSec = require('./tenSec')

async function resolveAfterTenSec() {
  await tenSec()
  return 1
}

resolveAfterTenSec().then(value => {
  console.log(value)
})
```
- ES2017에서 도입되어, 비동기식 코드를 동기식 코드처럼 쓸 수 있는 문법 제공
- Chrome 55, Node.js 8.0.0 부터 사용가능
- `async function` 안에서 반환된 값은 최종적으로 Promise 객체로 변환되어 반환된다.
- async function 안에서 쓸 수 있는 await 키워드는 현재 함수를 중단시키고 Promise 객체가 충족될 때까지 `기다리지만, 스레드를 block 하지 않는다.`
- 에러 처리는 동기식 코드처럼 try, catch 블록을 통해서 한다.
