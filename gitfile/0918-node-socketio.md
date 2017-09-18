170918

# SocketIO

초기의 HTTP는 실시간 전송이 안되었어서 초기에는 실시간처럼 보이는 Long Polling와 comet이라는 응답을 서버가 결정을 하는 기술을 사용하였다.  
현재는 WebSocketIO를 표준으로 사용하고 있다.  

`WebSocketIO HandShake` 
1. WebSocketIO는 client가 server에게 websocket이라고 요청을 보낸다.
2. server가 지원을 해주면 연결을 한다.
  - HTTP의 요청응답을 넘어서 server, client가 서로가 필요할때 바로 정보를 요청 및 전달한다.

websocket연결을 보기위해서는 검사tab의 Frames로 확인 할 수 있다.

[Socket.io](https://socket.io/)


## SocketIO 예제

Socket.io는 `실시간 웹을` 위한 JS 라이브러리입니다. 기존의 웹은 클라이언트(브라우저)가 요청을 해야만 서버로부터 데이터를 받을 수 있었던 데 반해, Socket.io와 같은 기술을 사용하면 클라이언트가 요청을 하지 않아도 필요할 때 서버로부터 데이터를 받을 수 있습니다. 이를 이용하면, 채팅이나 실시간 차트 혹은 실시간 알림을 지원하는 웹 어플리케이션을 작성할 수 있습니다.  

Socket.io는 실시간 통신을 위해 주로 WebSocket이라는 웹 표준 기술을 사용하지만, 구형 웹브라우저 등 WebSocket을 지원하지 않는 환경에서는 다른 기술을 사용할 수도 있습니다. (long polling, comet 등) 다른 일반적인 웹소켓 서버와는 호환이 되지 않으므로 주의하세요.  

```js
//index.js
// DOMContentLoaded html이 다 loading되었을 때 실행되게 한다.
document.addEventListener('DOMContentLoaded', () => {
  const socket = io()
  
  socket.on('response', data => {
    console.log(`${data.message} @ ${new Date}`)
  })
  
  // emit : 우리가 맺은 socketio에다가 message라는 이름의 event를 발생시켜라 거기에 이런 데이터를 포함시켜라
  document.querySelector('#message').addEventListener('click', e => {
    socket.emit('message', {message: '간단한 메시지를 이렇게 보낼 수 있습니다.'})
  })
  
  document.querySelector('#message-and-ack').addEventListener('click', e => {
    socket.emit('messageAndAck', {message: '메시지를 보낸 후에 서버에서 응답을 받을 수도 있습니다'}, data => {
      console.log(data)
    })
  })
  
  document.querySelector('#broadcast').addEventListener('click', e => {
    socket.emit('broadcast', {message: '다른 클라이언트에게만 가는 메시지도 보낼 수 있습니다.'})
  })
})
```
index.js에 있는 message event가 발생하고 client에게 server.js에서 response event를 발생을 하면 index.js에서 response를 한다.

```js
// server.js
const express = require('express')
const http = require('http') // express를 사용하려면 http를 써야한다.
const socketio = require('socket.io')

const app = express()
const server = http.Server(app)
const io = socketio(server)

app.set('view engine', 'pug')

app.use(express.static('public'))

app.get("/", (req, res) => {
  res.render('index.pug')
})

app.get('/namespace', (req, res) => {
  res.render('namespace.pug')
})

app.get('/room/:id', (req, res) => {
  res.render('room.pug', {id: req.params.id})
})

/*
# 서버 측 API

## 사전 정의된 이벤트 목록

- 'connect' 혹은 'connection': 클라이언트가 새 연결을 맺었을 때
- 'disconnect': 클라이언트의 연결이 끊어졌을 때
- 'error': 에러가 발생했을 때
- 'disconnecting': 클라이언트가 연결을 끊기 직전에

*/

io.on('connection', socket => {
  
  // Simple Message
  socket.on('message', data => {
    // 현재 네임스페이스에 접속 중인 모든 클라이언트에게 메시지 보내기
    io.emit('response', data)
  })
  
  // Acknowledgement
  socket.on('messageAndAck', (data, ack) => {
    io.emit('response', data)
    // 메시지를 보낸 클라이언트에게만 회신하기
    ack({ok: true})
  })
  
  // Broadcast
  socket.on('broadcast', data => {
    // 메시지를 보낸 클라이언트를 제외한 모든 클라이언트에게 메시지 보내기
    socket.broadcast.emit('response', data)
  })
})

// Custom Namespace 통신을 격리하기 위해서 사용한다. -> namespace.js
const someNsp = io.of('/some-namespace')

someNsp.on('connection', socket => {
  socket.on('message', data => {
    someNsp.emit('response', data)
  })
})

// Room
const roomNsp = io.of('/room')

/*
room은 동적으로 지정할 수 있는 통신의 분리 단위입니다.
하나의 소켓은 여러 개의 room에 들어갈 수 있습니다.
*/
roomNsp.on('connection', socket => {
  let id;
  socket.on('join', data => {
    // `socket.join`을 호출해서 특정 room에 진입합니다.
    socket.join(data.id)
    id = data.id
  })
  
  socket.on('message', data => {
    // `socket.to`는 이벤트 방출을 특정 room에 한정시킵니다.
    roomNsp.to(id).emit('response', data)
  })
})

const listener = server.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port)
})

```

- `접속한 사람마다 각자의 socket객체를 생성 해준다.`


## 사전 정의된 이벤트 목록
SocketIo의 기본 이벤트 목록

- `'connect'` 혹은 `'connection'`: 클라이언트가 새 연결을 맺었을 때
- `'disconnect'`: 클라이언트의 연결이 끊어졌을 때
- `'error'`: 에러가 발생했을 때
- `'disconnecting'`: 클라이언트가 연결을 끊기 직전에

server.js에서 
- `socket.emit`는 자기자신에게만 보내진다.   
- `io.emit는` 접속한 전부에게 보내진다.


```js
// namespace.js

document.addEventListener('DOMContentLoaded', () => {
  // 특정 namespace에 대한 연결 수립
  const socket = io('/some-namespace')
  
  socket.on('response', data => {
    console.log(`${data.message} @ ${new Date}`)
  })
  
  document.querySelector('#message').addEventListener('click', e => {
    socket.emit('message', {message: '특정한 이름공간에 접속할 수 있습니다. 통신은 다른 이름공간과 분리됩니다.'})
  })
})
```

`namespace`는 미리 만들어진 방에서 격리할 때 사용한다.  
`roomspace는` 동적으로 변경되는 방에서 격리할 때 사용한다.
