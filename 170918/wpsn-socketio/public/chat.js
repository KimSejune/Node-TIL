// 메시지를 DOM에 표시하기 위한 함수
function appendText(messageListEl, text) {
  const messageEl = document.createElement('p')
  messageEl.textContent = text
  messageEl.classList.add('message')
  // new가 붙으면 회색, message요청이 확실하게 되면 new가 사라지면서 검은글씨
  messageEl.classList.add('new')
  messageListEl.insertBefore(messageEl, messageListEl.firstChild)
  return messageEl
}

// 메시지 양식
function formatMessage({username, message}) {
  return `${username}: ${message}`
}

document.addEventListener('DOMContentLoaded', e => {
  let username;

  // 사용할 엘리먼트 가져오기
  const formEl = document.querySelector('#chat-form')
  const messageListEl = document.querySelector('#messages')
  const roomId = formEl.dataset.room // data-room값을 가져오는 것이다.

  // socket.io 연결 수립하고 room 설정, username 설정
  // index.js에 /chat부분과 연동
  socket = io('/chat')

  socket.emit('join', {id: roomId}, data => {
    username = data.username
    console.log(username)
  })
  // form 전송 이벤트 핸들러 => 발생시킬 'chat'이라는 event를 전송
  formEl.addEventListener('submit', e => {
    // form의 기본동작을 금지한다.
    e.preventDefault()
    // form에 들어있는 message.value값을 가져온다.
    const message = formEl.elements.message.value
    const messageEl = appendText(messageListEl, formatMessage({username, message}))
    socket.emit('clientchat', {message}, data => {
      // 메시지 전송이 잘 되었다는 표시를 해주면 된다.
      messageEl.classList.remove('new')
    })
    // reset() => form의 값들을 비워주는 method
    formEl.reset()
  })

  // (chat) 채팅 메시지가 올 때마다 출력 => 남들이 보낸 메세지
  socket.on('serverchat', data => {
    const messageEl = appendText(messageListEl, formatMessage(data))
    // 다른 사람이 보내는 것을 시간지연시킨다.
    setTimeout(() => {
      messageEl.classList.remove('new')
    })

  })

  // (user connected) 새 사용자가 접속한 사실을 출력
  socket.on('user connected', data => {
    appendText(messageListEl, `${data.username} 님이 접속하셨습니다.`)
  })

  // (user disconnected) 사용자의 연결이 끊어졌다는 사실을 출력
  socket.on('user disconnected', data => {
    appendText(messageListEl, `${data.username} 님이 접속이 끊겼습니다.`)
  })

})
