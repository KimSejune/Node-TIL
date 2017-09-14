170906

# Node Single-page Application

## SPA의 구조
![SPA](../images/IC690875.png)

- ejs를 사용하여서 웹개발을 하게되면 전체를 다시 새로고침을 해야한다.
- SPA 구조를 사용하면 Ajax를 통하여 부분만 고쳐준다.

## SPA 실습
[Link](https://github.com/seungha-kim/simple-todo-spa)

- data 부분을 node.js module로 빼뒀다.
- npm으로 설치한 module은 경로지정이 없어도 불러와 지지만 직접만든 module은 경로를 입력해줘야한다.
- send, end를 통해서 SPA를 구현한다. (redirect, render가 필요없다)
- 비관적 업데이트(pessimistic)  
  -  event 발생시 ajax 요청을 보낼때 실패 or 성공을 모른다 `ajax응답을 기다리다가 응답이 온뒤에 화면을 갱신`
- 낙관적 업데이트(optimistic)
  - ajax 요청과 화면 갱신을 같은 단계에 한다 그리고 `미리 화면을 갱신`하는데 이것은 ajax요청이 성공하면 끝난다. ajax요청이 실패하면 취소 or 에러처리 요즘 자주 사용한다.

## 개선 예시
- title 수정 기능  
- '기한'  
- 디자인 개선  
- 로그인  
  - cookie session사용.
- 데이터 유지  
