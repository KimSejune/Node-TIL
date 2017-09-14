170906

# Node GraphQL

## REST API의 단점
- 각각의 자원마다 경로가 따로 있음. 즉, 여러 자원이 동시에 필요한 경우에는 `요청을 여러 번 보내야 함` (요청의 횟수 면에서 비효율적)  

- (보통의 경우) 자원의 필요한 속성만 얻어올 수 없음. 즉, `일부 속성의 필요하더라도 전체 속성을 가져와야만 함` (요청의 용량 면에서 비효율적)  

## GraphQL
- Facebook에서 2015년 공개한 `데이터 질의 언어`  
- REST API를 대체하기 위해 만들어짐  
- 클라이언트에서 필요한 `데이터의 구조`를 GraphQL 언어로 정의한 후 질의할 수 있고, 서버는 그에 맞게 `구조화된 데이터를 응답`  
- 서버에서는 GraphQL 질의를 해석하기 위해 별도의 해석기가 필요하며, [`여러 언어의 구현체`](http://graphql.org/code/)가 나와있는 상태  

## Example

```js
// request
{
  human(id:"1000"){
    name
    height
  }
}
```

```js
//response
{
  "data": {
    "human":{
      "name": "Luke Skywalker",
      "height":1.72
    }
  }
}
```
- 내가 원하는 자료만 받아 올 수 있다.

## Github Graph API 실습
[Link](https://developer.github.com/v4/explorer/)


## 참고 링크  
- https://dev-blog.apollodata.com/graphql-vs-rest-5d425123e34b  
- http://graphql.org/learn/  
