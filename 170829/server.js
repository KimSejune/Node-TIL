const express = require('express')
let app = express()

app.use('view engine', 'ejs')
app.use('/static', express.static('public'))

const data = [
  {
    slug: 'seungha',
    name: '김승하',
    avartar: 'https://cdn.glitch.com/50c24104-3d4a-45ce-a960-271977ba01e8%2Fbeb64e6851616833bebee094e7b13b30.jpeg?1503412166247',
    description: '패스트캠퍼스에서 Node.js 강의를 하고 있는 김승하입니다.'
  },
  {
    slug: 'sejune',
    name: '김세준',
    avartar: '',
    description: '패스트캠퍼스에서 Node.js 수강을 하고 있는 김세준입니다.'
  }
]

// 프로필 목록
app.get('/',(req,res) => {
  res.render('index.ejs', {data})
})

// 개별 프로필 페이지
app.get('/profile/:slug', (req, res) => {
  const slug = req.params.slug
  const profile = data.find(item => item.slug === slug)
  if(profile){
    res.render('profile.ejs', profile)
  }else {
    res.status(404)
    res.send('404 Not Found')
  }
})

app.listen(3000, function() {
  console.log('listening')
})