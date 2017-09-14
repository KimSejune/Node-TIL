const express = require('express')
const app = express()

app.set('view engine', 'ejs')


app.get('/', (req, res) => {
  res.send('hi~~ 수현 and 세준 eating 닭발')
  res.render('index.ejs')
  
})


// 서버를 3000 port로 구동
app.listen(3000, () => {
  console.log('listening...')
})