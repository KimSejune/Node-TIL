170830

# Node Web Form

## HTML Form

## HTML form의 기본 동작

HTML form을 전송하면, 입력된 정보가 기본적으로 `percent encoding` 되어 요청됨

- GET method  
  - 이름=값 형식으로 간다.
```
GET /search?query=%EA%B0%9C&sort=latest HTTP/1.1
...
```


- Post method  
  - 이름=값 형식으로 간다.
  - urlencoded로는 파일을 보내기에 부적절해서 다른 `Content-type인 multipart를 사용한다.`

```
POST /form HTTP/1.1
Content-Type: application/x-www-form-urlencoded
...

home=Cosby&favorite+flavor=flies
```

## multipart/ form-data

- 기본 설정(percent encoding)으로는 폼으로 `파일을 업로드하는 것은 불가능`  
- (클라이언트 측) form 태그에 `enctype="multipart/form-data" `속성을 적용하면 파일 업로드 가능  
- (서버 측) body-parser 미들웨어는 multipart/form-data 형태의 요청을 지원하지 않음 (`multer` 필요)
 - `json, url-encoded형식을 req.body에서 사용하기 위해서는 body-parser가 필요하다.`


## HTML Form 예제 [Link](https://glitch.com/edit/#!/wpsn-form-example)

- UUID  
- Redirection after submission  
- Form validation  

- 클라이언트 측 validation을 잘하면 사용자가 사용하기에 편하다.
- 클라이언트 측 validation 구현방법

```html
<input required type="text" name="title">
```

> redirect('/')는 300(301 Moved Permanently
302 Found) 번대 에러가 발생했을 때 다른 곳으로 보내준다.

- post 응답이 redirect가아닌 새로고침을 하면 같은 값이 계속 간다.
  - Ajax를 사용할때는 redirect를 하지 않아도 괜찮다.

### 301과 302의 차이

- 301응답이란? 사용자가 보내면 web browser는 그걸을 기억했다가 똑같은 요청이 온다면 web browser가 `서버에 요청을 하지않고 web browser에서 그전의 저장한 정보를 보낸다.`

- res.redirect는 302 상태코드로 응답합니다.

### UUID

- 범용 공용 식별자 : 어디에서든지 유니크한 아이디
- 128bit의 숫자로 이루어져 있으며 