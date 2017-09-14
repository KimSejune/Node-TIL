170829

# Node Template Language

## Static Web Page
누가 어떻게 요청하든 미리 저장되어 있던 HTML 파일을 그대로 응답

## Dynamic Web Page
요청한 사람과 요청한 내용에 따라 `각각 다른 내용으로 편집한 HTML을 응답`

## Template Engine
`템플릿과 데이터를 결합`해 문서를 생성하는 프로그램, 혹은 라이브러리
템플릿을 작성할 때 사용하는 언어를 `템플릿 언어`라고 함

## EJS
Embedded JavaScript Template [#](http://ejs.co/)  
- Node.js 생태계에서 가장 많이 사용되는 템플릿 엔진
- 문법이 단순
- JavaScript 코드를 템플릿 안에서 그대로 쓸 수 있음
- `.ejs VSCode Extension`

```js
<%# index.ejs %>
<html>
  <head>
    <title><%= title %></title>
  </head>
  <body>
    <div class="message">
      <%= message %>
    </div>
    <% if (showSecret) { %>
      <div>my secret</div>  // showSecret이 true면 my secret을 보여주고 false면 보여주지 말아라.
    <% } %>
  </body>
</html>
```
- <%= title %> 을 사용하여서 데이터의 title을 가진 값을 집어 넣는다.

## Express에서 EJS 사용하기

`ejs 설치`
```bash
$ npm install --save ejs
```

`template engine 설정`
```bash
app.set('view engine', 'ejs')
```

`res.render()`  
```js
const data = {
  title: 'Template Language',
  message: 'Hello EJS!',
  showSecret: true
}
res.render('index.ejs', data)
```

## Serving Static Files
- 템플릿 파일에서 참조할 수 있다.
- 변하지 않는 파일들을 넣어서 보관해둔다.
```js
// `public` 폴더에 있는 파일을 `/static` 경로 아래에서 제공
app.set('view engine', 'ejs')
app.use('/static', express.static('public'))

<!-- 템플릿 파일에서 참조할 수 있음 -->
<link rel="stylesheet" href="/static/index.css">
<script type="text/javascript" src="/static/index.js"></script>
```
