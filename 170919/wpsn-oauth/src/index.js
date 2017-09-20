require('dotenv').config()

const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cookieSession = require('cookie-session')
const csurf = require('csurf')
const flash = require('connect-flash')
const passport = require('passport')
// github 연결
const GitHubStrategy = require('passport-github').Strategy
// google 연결
const GoogleStrategy = require('passport-google-oauth20').Strategy
// facebook 연결
const FacebookStrategy = require('passport-facebook').Strategy
// naver 연결
const NaverStrategy = require('passport-naver').Strategy

const util = require('./util')
const query = require('./query')
const mw = require('./middleware')

const PORT = process.env.PORT || 3000

const app = express()

app.set('view engine', 'pug')
app.set('trust proxy')

app.use(express.static(path.join(__dirname, '..', 'public')))
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieSession({
  name: 'oasess',
  keys: [
    process.env.SECRET
  ]
}))
app.use(flash())
app.use(csurf())
app.use(mw.insertReq)
app.use(mw.insertToken)
app.use(passport.initialize())
app.use(passport.session())

passport.serializeUser((user, done) => {
  done(null, `${user.provider}:${user.provider_user_id}`)
})

passport.deserializeUser((str, done) => {
  const [provider, provider_user_id] = str.split(':')
  query.firstOrCreateUserByProvider(provider, provider_user_id)
    .then(user => {
      if (user) {
        done(null, user)
      } else {
        done(new Error('해당 정보와 일치하는 사용자가 없습니다.'))
      }
    })
})

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: process.env.GITHUB_CALLBACK_URL
}, (accessToken, refreshToken, profile, done) => {
  // avatar_url를 저장한다.
  const avatar_url = profile.photos[0] ? profile.photos[0].value : null
  query.firstOrCreateUserByProvider( // github로 로그인 하는 부분 access token으로 profile까지 받아온다.
    // github에 같은 것을 가진놈을 가져오고 없으면 만들어서 가져온다.
    'github',
    profile.id,
    accessToken,
    avatar_url
  ).then(user => {
    done(null, user)
  }).catch(err => {
    done(err)
  })
}))

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
},(accessToken, refreshToken, profile, done) => {
  const avatar_url = profile.photos[0] ? profile.photos[0].value : null
  query.firstOrCreateUserByProvider( // google에 로그인 하는 부분 access token으로 profile까지 받아온다.
      // google에 같은 것을 가진놈을 가져오고 없으면 만들어서 가져온다.
      'google',
      profile.id,
      accessToken,
      avatar_url
    ).then(user => {
      done(null, user)
    }).catch(err => {
      done(err)
    })
}))

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['id', 'displayName', 'photos', 'email']
},(accessToken, refreshToken, profile, done) => {
  const avatar_url = profile.photos[0] ? profile.photos[0].value : null
  query.firstOrCreateUserByProvider( // facebook 로그인 하는 부분 access token으로 profile까지 받아온다.
      // facebook 같은 것을 가진놈을 가져오고 없으면 만들어서 가져온다.
      'facebook',
      profile.id,
      accessToken,
      avatar_url
    ).then(user => {
      done(null, user)
    }).catch(err => {
      done(err)
    })
}))

passport.use(new NaverStrategy({
  clientID: process.env.NAVER_CLIENT_ID,
  clientSecret: process.env.NAVER_CLIENT_SECRET,
  callbackURL: process.env.NAVER_CALLBACK_URL,
  svcType: 0
},(accessToken, refreshToken, profile, done) => {
  const avatar_url = profile._json ? profile._json.profile_image : null
  query.firstOrCreateUserByProvider( // naver 로그인 하는 부분 access token으로 profile까지 받아온다.
      // naver 같은 것을 가진놈을 가져오고 없으면 만들어서 가져온다.
      'naver',
      profile.id,
      accessToken,
      avatar_url
    ).then(user => {
      done(null, user)
    }).catch(err => {
      done(err)
    })
}))

app.get('/', mw.loginRequired, (req, res) => {
  res.render('index.pug', req.user)
})

app.get('/login', (req, res) => {
  res.render('login.pug', req.user)
})

app.post('/logout', (req, res) => {
  req.logout()
  res.redirect('/login')
})

// 우리서버가 github으로 redirect하고 허용을 누르면 아래로
app.get('/auth/github', passport.authenticate('github'))

// github에서 우리서버로 redirect를 해준다.
app.get('/auth/github/callback', passport.authenticate('github', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

// 우리서버가 google으로 redirect하고 허용을 누르면 아래로
app.get('/auth/google',passport.authenticate('google', { scope: ['profile'] }))

// google에서 우리서버로 redirect를 해준다.
app.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))

// 우리서버가 facebook으로 redirect하고 허용을 누르면 아래로
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile'] }))


// google에서 우리서버로 redirect를 해준다.
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))


// 우리서버가 naver으로 redirect하고 허용을 누르면 아래로
app.get('/auth/naver', passport.authenticate('naver', null), function(req, res) {
    console.log('/auth/naver failed, stopped')
})

// naver에서 우리서버로 redirect를 해준다.
app.get('/auth/naver/callback', passport.authenticate('naver', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
}))


app.listen(PORT, () => {
  console.log(`listening ${PORT}...`)
})
