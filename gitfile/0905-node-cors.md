170905

# Node CORS

보내는쪽과 받는쪽의 Domain이 다를때 발생하는 문제

## Some-origin Plicy(동일 출처 정책)
- 웹페이지에서 리소스를 불러올 때, `리소스의 출처가 웹페이지의 출처와 같으면 안전`하다고 보고, `출처가 다르면 해당 리소스는 안전하지 않다`고 보는 원칙
- 여기서 `'출처'`란 `'프로토콜 + 도메인 + 포트번호'`의 결합을 가리킴. 즉, `세 개가 다 같아야 동일 출처`라고 할 수 있고, 셋 중에 하나라도 다르면 동일 출처로 간주되지 않음
- `웹 보안의 기본 원칙`으로, 웹 브라우저의 많은 요소에 적용됨

## Same-origin Policy 실습

```bash
> const child = window.open('http://www.fastcampus.co.kr')
// 새로 열린 웹 페이지의 콘솔에서
> window.foo = 'bar'
// 이전 웹 페이지의 콘솔에서
> child.foo
// 출처가 같다면 접근 가능, 아니면 불가

// fastcampus 홈페이지에서 naver를 오픈한다.
> const naver = window.open('https://naver.com')  
// naver가 실행되는데 naver의 콘솔에서 만든 foo는 적용이 안된다.
> foo = 'bar'
// fastcampus쪽에서 naver.foo를 하면 에러가난다.
> naver.foo // error

```
- 이러한 에러를 same-origin policy 이라고 한다.

## Content-Security-Policy
Content-Security-Policy 헤더를 이용하면, `동일하지 않은 출처에 대한 리소스를 불러올지 말지` 결정할 수 있음  

## CORS
Cross-Origin Resource Sharing 

- `클라이언트 측 cross-origin 요청을` `안전하게 보낼 수 있는 방법`을 정한 표준  
- 쉽게 말하면, `스크립트가 전혀 다른 출처를 갖는 API 서버를 사용하려고 하는 상황`에서는 뭔가 `추가적인 처리`를 해주어야 한다는 것!  
  - 도메인이 다를때 서로 통신하는 방법

## Cross-origin 요청의 위험성

아래 상황을 가정해봅시다.

`mywebsite.com`에서 서비스 중인 웹 사이트는 mywebsite.com/api 에서 REST API를 통해 필요한 정보를 얻습니다. mywebsite.com/api 경로에 대한 `인증은 쿠키`로 이루어지고 있습니다.

그런데 만약 `evil.com` 웹 사이트의 스크립트에서 `mywebsite.com` API에 요청을 마음대로 보낼 수 있다면, 이미 my-website.com 도메인에 대해 브라우저에 저장된 쿠키를 이용해서 API를 마음대로 호출할 수 있을 것입니다.  
- 쿠키는 요청을 하기만하면 자동으로 보내진다.

## Cross-origin 요청 예제
- IE8 이상의 모던 웹 브라우저는 `cross-origin 요청에 대해 여러가지 제한`을 두고 있음  
- cross-origin 요청을 허용하려면, 서버가 특별한 형태의 응답을 전송해야 함  
- 만약 서버가 cross-origin 요청을 허용하지 않으면, 웹 브라우저는 에러를 발생시킴
  - 어느 웹페이지는 허락하고 거절할지에 대해서 `서버단에서 설정할 수 있다.`  
[Link](https://glitch.com/edit/#!/wpsn-cross-origin-example)  

### 참고

express를 비롯한 일반적인 웹 서버는 별도의 설정을 하지 않으면 cross-origin 요청을 모두 불허(즉 웹브라우저가 거부)하도록 만들어져 있습니다. 그런데 json-server는 개발자의 편의를 위해 쿠키가 포함되어있지 않은 모든 cross-origin 요청을 허용하도록 만들어져 있습니다. 본 예제의 원활한 진행을 위해, json-server가 일반적인 웹 서버와 같이 cross-origin 요청을 허용하지 않도록 설정한 부분이 wpsn-axios-example의 코드를 보시면 나와있습니다.  

- get은 그냥 보내는데 나머지는 options로 보낸다.

## CORS에 관여하는 응답 헤더
- Access-Control-Allow-Origin  
  - 서버를 허용해 줄 때
- Access-Control-Expose-Headers  
- Access-Control-Max-Age  
- Access-Control-Allow-Credentials  
  - 쿠키를 추가하는 명령도 받는다.
- Access-Control-Allow-Methods  
  - 특정 Method만 받는다.
- Access-Control-Allow-Headers  
  - 특정 Header만 받는다.

## CORS에 관여하는 요청 헤더
- Origin  
- Access-Control-Request-Method (preflighted 전용)  
- Access-Control-Request-Headers (preflighted 전용)  

## CORS - Safe, Unsafe
- GET, HEAD 요청은 `safe(읽기 전용)`이기 때문에 서버에 요청이 도달한다고 해서 서버의 상태에 영향을 미칠 일은 없으므로, `웹 브라우저는 일단 해당 요청을 보내본다`. 만약 서버가 cross-origin 요청을 허용한다고 응답하면 응답을 그대로 사용하고, 그렇지 않으면 `에러를 낸다. ` 

- POST, PUT, PATCH, DELETE 등의 메소드는 요청이 서버에 `전송되는 것 자체가 위험`하므로, 실제 요청을 보내기 전에 서버가 cross-origin 요청을 허용하는지를 알아보기 위해 `시험적으로 요청을 한 번 보내본다.(options)` 이 요청을 `preflighted request`라고 한다.  

  - (단, 기존 HTML form의 동작방식인 application/x-www-form-urlencoded 혹은 
multipart/form-data 형태의 POST 요청은 preflighted request가 발생하지 않음)  

  - safe, unsafe 말고도 다른 원인에 의해 preflighted request가 발생하는 경우가 있는데, 자세한 사항은 MDN 문서를 참고해주세요.  

## CORS with credentials
`cross-origin 요청에는 기본적으로 쿠키가 포함되지 않으나`, XMLHttpRequest 혹은 fetch를 통해서 요청을 보낼 때 `쿠키를 포함시키는 옵션`을 줄 수 있고 이 때 `CORS 요건이 더 엄격해짐  `
  - (Access-Control-Allow-Credentials 헤더 설정 필요, Access-Control-Allow-Origin 헤더에 와일드카드 허용 안됨)

> cross-origin Ajax 요청에는 `기본적으로 쿠키가 포함되지 않으나` 옵션을 줘서 쿠키를 포함시켜서 보낼 수 있지만 보안 정책이 더욱 엄격해진다.

## 복잡하면 그냥...  
- 프론트엔드와 API 서버를 `같은 도메인`으로 제공한다.  
- 불가피하게 둘을 다른 도메인으로 제공해야 한다면  
  - CORS를 허용한다 (`cors 미들웨어`를 사용하면 간단함)  
  - CORS를 허용했으므로 `쿠키를 쓰지 않는다.`

