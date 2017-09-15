const express = require('express')
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')

const query = require('./query')
// const knex = require('./knex')

const app = express()
const urlencodedMiddleware = bodyParser.urlencoded({ extended: false })

app.use(cookieSession({
  name: 'session',
  keys: ['mysecret']
}))
app.set('view engine', 'ejs')
// git add
function authMiddleware(req, res, next) {
  if(req.session.id){
    query.getUserById(req.session.id)
      .then(matched => {
        req.user = matched
        res.locals.user = matched  // ejs, pug를 쓴다면 이렇게 넣어줘야한다.
        next()
      })
  }else {
    res.redirect('/login')
  }
}

app.get('/', authMiddleware, (req, res) => {
  query.getUrlEntriesByUserId(req.user.id)
    .then(rows => {
      res.render('index.ejs', {rows})
    })
})

app.get('/login', (req, res) => {
  res.render('login.ejs')
})

app.post('/login', urlencodedMiddleware, (req, res) => {
  query.getUser(req.body.username, req.body.password)
    .first()
    .then(matched => {
      if (matched){
        req.session.id = matched.id // 값은 cookie에 저장된다.
        res.redirect('/')
      }else {
        res.status(400)
        res.send('400 Bad request')
      }
    })
})

app.post('/logout', (req,res) => {
  req.session = null;
  res.redirect('/login')
})

// authMiddleware를 사용하지 않는다면 req.user에 아무런 정보가 들어가지 않는다.
app.post('/url_entry', authMiddleware, urlencodedMiddleware, (req, res) => {
  const long_url = req.body.long_url
  // 데이터 저장
  query.createUrlEntry(long_url, req.user.id)
    .then( () => {
      res.redirect('/')
    })
})

app.get('/:id', (req, res, next) => {
  query.getUrlById(req.params.id)
    .then(urlEntry => {
      if(urlEntry){
        res.redirect(urlEntry.long_url) // 301 moved~~ 영원히 이동한다 (브라우저에 저장) , 302 브라우저에 저장안하고 다시보낸다.
        // res.redirect(301, entry.long_url)를 해야하지만 사람들이 얼마나 클릭했는지 확인하기 위해서 301을 뺐다.
      }else {
        next()
      }
    })
})

app.listen(3000, () => {
  console.log('listening...')
})
