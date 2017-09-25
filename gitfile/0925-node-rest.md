170925

# REST API

## REST(Representaitonal State Transfer)

REST(Representaitonal State Transfer)는 HTTP나 JSON 같은 `기술 표준 `아닙니다. REST는 로이 필딩이라는 사람이 아파치 웹 서버와 HTTP 1.1을 설계할 때 세웠던 원칙들을 모아서 쓴 그의 박사학위 논문에서 처음 제시한 뒤 널리 퍼진 개념입니다. REST는 웹 서비스를 만들 때 아래와 같은 설계 규칙을 지키도록 명시하고 있습니다.  

- 클라이언트-서버 아키텍처  
- 무상태(statelessness): 클라이언트의 세션 상태는 웹 서버 대신 클라이언트에 저장되어야 합니다.  
  - `어떤 값이 어디에 저장될지 모르기 때문`에 웹 서버에 저장되면 안된다.
- 캐시 가능: 웹 서버의 응답은, 캐시 가능 여부에 대한 정보를 포함해야 합니다.  
- 계층 시스템: 클라이언트는 요청이 정확히 어느 웹 서버에 도달할 지, 중간 매체가 있는지 없는지를 모르더라도 별다른 문제없이 서비스를 사용할 수 있어야 합니다.  
- 일관된 인터페이스  
  - 자원은 URI를 통해서 식별하고, 자원의 제공 형태를 식별자에 포함시키지 않습니다.  
  - 서버가 요청을 잘 처리할 수 있도록 각 요청은 충분한 정보를 포함하고 있어야 합니다. (Content-Type 등)  
- 필요 시 코드 전송(Code on demand): 웹 서버는 자바 애플릿, 플래시, 자바스크립트 등의 제공을 통해 클라이언트의 기능을 확장시킬 수 있습니다.  

위 설계 원칙을 따름으로써 웹 서버는 아래의 좋은 속성들을 가질 수 있게 됩니다.

- 높은 성능  
- 확장가능성(Scalability)  
- 인터페이스의 단순함  
- 웹 서버의 실시간 업데이트가 가능  

> Sticky Session 사용자가 사용했던 한개의 서버로만 접속하게 하는 것 : 좋지 않은 방법이다.

## REST API

위의 REST 원칙을 따르는 웹 API를 가지고 REST API라고 부릅니다. REST API 역시 REST와 같이 표준화 된 기술은 아닙니다만, 개발자 커뮤니티에서 합의가 되어 있는 best practice 들이 있습니다.  

### RESTful URI 설계

REST API의 URI는 기본적으로 '자원'을 나타냅니다. URI를 통해 자원을 표현할 때는 다음과 같은 기본 원칙을 따르도록 합니다.  

- 슬래시(/) 문자는 자원 간 계층관계를 나타내는 데 사용합니다.  
- 마지막 문자로 슬래시를 포함하지 않습니다.  
- 띄어쓰기를 표현할 때는 하이픈(-)을 사용하고, 밑줄(_)을 사용하지 않는다  
- 대문자 대신 소문자만을 사용합니다.  
- 경로에 확장자를 쓰지 않습니다. 내용 협상을 위해서는 Accept 헤더를 사용합니다.  

자원은 하나일 수도, 여러 개일수도, 혹은 특정한 동작을 나타내는 것일 수도 있습니다.  

#### Document

도큐먼트는 보통 하나의 객체 혹은 데이터베이스 레코드를 나타내는 `단일 자원`입니다. URI에서는 아래와 같이 단수 명사로 표기합니다.  

```js
https://api.example.com/user
https://api.example.com/service-info
https://api.example.com/resource
```

#### Collection

컬렉션은 보통 여러 개의 객체 `복수의 자원` 혹은 데이터베이스의 여러 레코드를 나타내는 자원입니다. 도큐먼트는 파일에, 컬렉션은 폴더에 비유할 수 있습니다.  

```js
https://api.example.com/todos
https://api.example.com/articles
```

컬렉션 뒤에 자원의 식별자를 붙여서 도큐먼트를 나타낼 수도 있습니다.  

```js
https://api.example.com/todos/123
https://api.example.com/articles/how-to-design-rest-api
```

#### Controller

자원에 대한 단순한 CRUD(Create, Read, Update, Delete)는 HTTP 메소드를 통해서 할 수 있지만, 단순 CRUD가 아닌 경우에는 자원 뒤에 동사를 붙여서 해당 동작을 표현할 수 있습니다.  
- 우리의 절차를 걸치지 않고 다른 사람이 데이터베이스를 변경할 수 도 있다. 밑에 예제 처럼해야한다.
- controller에 대해서는 없는 기능에 대해서는 post 요청을 사용한다.  
```js
https://api.example.com/todos/123/finish
```

### REST API 통신 설계

기본적으로 의미에 맞는 HTTP 메소드와 상태 코드를 사용해주세요.  

컬렉션, 도큐먼트, 컨트롤러에 대해서는 HTTP 메소드를 아래와 같이 사용합니다.  

```js
# 컬렉션에 속해있는 자원을 모두 가져오기 위해 컬렉션 URI에 GET 요청을 보냅니다.
GET https://api.example.com/todos

# 컬렉션에 대한 filtering이나 pagination을 위해 쿼리 스트링을 사용할 수 있습니다.
GET https://api.example.com/todos?complete=true&assignee=me
GET https://api.example.com/todos?page=2

# 컬렉션 내에 새로운 자원을 생성하기 위해 POST 요청을 보냅니다.
POST https://api.example.com/todos
```

```js
# 단일 도큐먼트를 읽어오기 위해 도큐먼트 URI에 GET 요청을 보냅니다.
GET https://api.example.com/user
GET https://api.example.com/todos/123

# 도큐먼트를 수정하기 위해 PUT(치환) 혹은 PATCH(변경) 요청을 보냅니다.
PUT https://api.example.com/todos/123
PATCH https://api.example.com/user

# 도큐먼트를 삭제하기 위해 DELETE 요청을 보냅니다.
DELETE https://api.example.com/todos/123
```

이런 식으로 하면 안 됩니다!  

```js
# 자원의 생성을 위한 URI가 따로 존재하고 GET 메소드를 사용하는 경우
GET /add_todo?title=mytodo

# 자원 식별자를 쿼리 스트링에 포함시키는 경우
GET /todo?id=1

# 자원의 삭제를 위해 POST 메소드를 사용하는 경우
POST /todos/1/delete?id=1
```

> get으로 절대로 자원을 생성해서는 안된다.
