170918

# SEED

기존의 seed.js로 데이터베이스의 값을 넣는 것이아닌 knex의 seed로 값을 넣어본다.  


### 기존 seed.js  

```js
const faker = require('faker')
const randomstring = require('randomstring')
const knex = require('./knex')

knex('user')
  .insert({
    id: 'fast',
    password: 'campus'
  })
  .then(() => {
    for(var i = 0; i < 20; i++){
      knex('url_entry')
        .insert({
          id: randomstring.generate(8),
          long_url: faker.internet.url(),
          user_id: 'fast'
        }).then(console.log)
    }
  })


```

## seeds 생성방법 


### seed 명령어 

```bash
// seed file을 만드는 명령어
$ knex seed:make initial_data

// seed 실행 명령어
$ knex seed:run
```

변경된 seeds/initial_data.js

```js
const faker = require('faker')
const randomstring = require('randomstring')

// 값이 실행되어서 이 파일의 작업이 끝나는 것에 대해서 알려줘야한다.
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('user')
  .insert({
    id: 'kim',
    password: 'sejune'
  })
  .then(() => {
    const arr = []
    for(var i = 0; i < 20; i++){
      arr.push(
        knex('url_entry')
          .insert({
            id: randomstring.generate(8),
            long_url: faker.internet.url(),
            user_id: 'kim'
          })
      )
    }

    return Promise.all(arr)
    // promise는 어떤값을 감싸고 있는데 그 값을 then을 사용해서 사용할 수 있다.
    // 단 return하는 것이 그냥 값이면 then에서는 그 값을 사용할 수 있다.
    // 여기서 다음에 등장하는 then에는 arr를 사용할 수 있다.
  })
}

```
