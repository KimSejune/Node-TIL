170905

# Node Fetch API

## Fetch API
- 웹 브라우저의 XMLHttpRequest를 대체하기 위해 만들어진 새로운 HTTP client 표준  
- 비교적 최근에 도입되어 IE 및 구형 안드로이드 브라우저(4.x)는 지원하지 않음  
- [Fetch Polyfill](https://github.com/github/fetch)  
  - 최신기술로써 지원하지 않는 브라우저가 많지만 Fetch Polyfill을 사용하면 사용가능하다.
- [isomorphic-fetch](https://www.npmjs.com/package/isomorphic-fetch)  
  - npm library이다.  


## Axios vs Fetch API
- Instance와 같이 설정을 재사용하거나 요청중인 연결을 취소하는 등의 `편의기능`이 Fetch API에는 없음  
- `현재로서는 Axios를 사용하는 것이 좋은 선택`  
- 다만, Axios는 내부적으로 XMLHttpRequest를 사용하고 있는데 `Service Worker 등의 웹 최신 기술이 XMLHttpRequest를 지원하지 않으므로`, Service Worker를 사용할 예정에 있는 프로젝트에서는 Axios를 사용할 수 없음  

## Fetch API
[Fetch API](http://hacks.mozilla.or.kr/2015/05/this-api-is-so-fetching/)
