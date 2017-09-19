// 통신을 주로하는 영역
const express = require('express')
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const flash = require('connect-flash')
const csurf = require('csurf')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy


const query = require('./query')
// const knex = require('./knex')

// middleware는 순서에 영향을 받는다.
const app = express()
const urlencodedMiddleware = bodyParser.urlencoded({ extended: false })
const csrfMiddleware = csurf()

app.use(cookieSession({
  name: 'session',
  keys: ['mysecret']
}))
app.use(urlencodedMiddleware)
app.use(csrfMiddleware)
app.use(flash())

app.set('view engine', 'ejs')

// 순서는 거의 마지막쯤에 된다.
app.use(passport.initialize())
// jwt를 사용한다면 session은 없어도 된다. 위에만 해주면 된다.
app.use(passport.session())
// session은 req.user에다가 넣어주는 역할을 한다.


passport.serializeUser((user, done) => {
  // user 객체로부터 세션에 저장할 수 있는 문자열을 만들어서 반환
  done(null, user.id)
})

passport.deserializeUser((id, done) => {
  // session에 저장되어 있는 id를 통해 user객체를 얻어온 후 변환
  query.getUserById(id)
    .then(user => {
      if(user) {
        done(null, user)
      }else {
        done(new Error('아이디가 일치하는 사용자가 없습니다.'))
      }
    })
})

passport.use(new LocalStrategy ((username, password, done) => {
  // 최초의 로그인 할 때 사용 serial은 최초 이후로 로그인 할 때 사용
  query.getUserById(username)
    .then(matched => {
      // compareSync(원래 pwd, bcrypt pwd)
      if (matched && bcrypt.compareSync(password, matched.password)){
        done(null, matched)
      }else {
        done(new Error('사용자 이름 혹은 비밀번호가 일치하지 않습니다.'))
      }
    })
}))


function authMiddleware(req, res, next) {
// 로그인이 필요한 부분에 필요한 middleware이다.
// passport에서는 req.user에 로그인 정보가 들어온다.
  if(req.user) {
    // 로그인이 된 상태이므로 그냥 통과시킨다.
    next()
  } else {
    res.redirect('/login')
  }

}

/*
// passport사용 전 내부적으로만 인증할 때 사용
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
*/


app.get('/', authMiddleware, (req, res) => {
  query.getUrlEntriesByUserId(req.user.id)
    .then(rows => {
      res.render('index.ejs', {rows, csrfToken: req.csrfToken()})
    })
})

app.get('/login', (req, res) => {
  res.render('login.ejs', {errors: req.flash('error'), csrfToken: req.csrfToken()})
})

app.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
  // 여기서 true는 위에서 발생한 에러메시지를 출력한다 `사용자 이름 혹은 비밀번호가 일치하지 않습니다.`
}))

app.post('/logout', (req,res) => {
  req.logout()
  res.redirect('/login')
})

/*
// passport사용 전 내부적으로만 인증할 때 사용
app.post('/login', (req, res) => {
  query.getUserById(req.body.username)
    .first()
    .then(matched => {
      // compareSync(원래 pwd, bcrypt pwd)
      if (matched && bcrypt.compareSync(req.body.password, matched.password)){
        req.session.id = matched.id // 값은 cookie에 저장된다.
        res.redirect('/')
      }else {
        // session에 정보를 저장한다. 정보를 저장했으니 redirect를 해야한다.
        req.flash('error', 'id or password is not mathced')
        // res.status(400)
        // res.send('400 Bad request')
        res.redirect('/login')
      }
    })
})


app.post('/logout', (req,res) => {
  req.session = null;
  res.redirect('/login')
})
*/


// authMiddleware를 사용하지 않는다면 req.user에 아무런 정보가 들어가지 않는다.
app.post('/url_entry', authMiddleware, (req, res) => {
  const long_url = req.body.long_url
  // 데이터 저장
  query.createUrlEntry(long_url, req.user.id)
    .then( () => {
      res.redirect('/')
    })
    .catch(err => {
      res.status(400)
      res.send(err.message)
    })
})

// app.get('/:id', (req, res, next) => {
//   query.getUrlById(req.params.id)
//     .then(urlEntry => {
//       if(urlEntry){
//         query.saveClickCountById(urlEntry.id, urlEntry.click_count+1)
//           .then(() => {
//             res.redirect(urlEntry.long_url) // 301 moved~~ 영원히 이동한다 (브라우저에 저장) , 302 브라우저에 저장안하고 다시보낸다.
//             // res.redirect(301, entry.long_url)를 해야하지만 사람들이 얼마나 클릭했는지 확인하기 위해서 301을 뺐다.
//           })
//       }else {
//         next()
//       }
//     })
// })

app.get('/:id', (req, res, next) => {
  query.getUrlById(req.params.id)
    .then(urlEntry => {
      if(urlEntry){
        query.incrementClickCountById(urlEntry.id) // Atomic Update를 적용한 상태이다.
          .then(() => {
            res.redirect(urlEntry.long_url) // 301 moved~~ 영원히 이동한다 (브라우저에 저장) , 302 브라우저에 저장안하고 다시보낸다.
            // res.redirect(301, entry.long_url)를 해야하지만 사람들이 얼마나 클릭했는지 확인하기 위해서 301을 뺐다.
          })
      }else {
        next()
      }
    })
})


app.get('/register', (req, res) => {
  res.render('register.ejs', {csrfToken: req.csrfToken()})
})

app.post('/register', (req, res) => {
  query.createUser(req.body.id, req.body.password)
    .then(() => {
      // 로그인
      req.session.id = req.body.id
      res.redirect('/')
    })
})

app.listen(3000, () => {
  console.log('listening...')
})
