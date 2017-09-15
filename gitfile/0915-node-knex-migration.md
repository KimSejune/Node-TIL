170915

# Node knex Migration

## Schema Alter

Migration하는 방법  

```bash
$ npm install knex -g

$ knex init
```

- knexfile.js가 생성된다 이것으로 앞으로 migration을 한다.(초기모습)

```js

//knexfile.js

// Update with your config settings.

module.exports = {

  // 개발단계
  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    }
  },

  
  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};


```

development, staging, production 3가지로 구성되어있다.

`NODE_ENV=production node src/index.js`형식으로 실행을 한다 production값을 변경가능하며 default값은 development이다.

debug는 devlopment에서는 사용하고 product에서는 사용하지 않는다.

`각자의 환경에서 설치할 수 있는데 개발에서 사용되는 패키지를 운영에다가 넣을 필요가없으니 개발환경에서만 사용하는 것은 --save-dev로 설치해둔다.`
  - test, faker같은 것을 --save-dev로 설치해둔다.

- knexfile.js 적용모습

```js
// Update with your config settings.
require('dotenv').config()

module.exports = {

  development: {
    client: 'mysql',
    connection: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME
    },
    debug: true
  },

  staging: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  },

  production: {
    client: 'postgresql',
    connection: {
      database: 'my_db',
      user:     'username',
      password: 'password'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }

};

```
## Knex Migration 생성법

```bash
$ knex migrate:make migration_name
```

migrations라는 폴더에 migration_name 파일이 생긴다.  
- `up` : 데이터베이스를 변경하는데 사용한다.  
- `down` : 변경된 값을 되돌리는데 사용한다.  

`migration을 사용하여서 table을 생성하는 방법`

```bash
> knex migrate:latest
```
- 1번 더 같은 명령어를 실행하면 이미 저장되어있다고 알려준다.

migration 취소방법

```bash
> knex migrate:rollback
```

migration은 한번 할 때 한번씩 하는 것이 좋다.(작은 단위로 실행을 추천)
- 이제 schema.js는 필요가 없게 되었다.

```js
// schema.js
const knex = require('./knex')

knex.schema.createTable('user', t => {
  t.string('id').primary()
  t.string('password').notNullable()
}).then(() => knex.schema.createTable('url_entry', t => {
  t.string('id', 8).primary()
  t.string('long_url').notNullable()
  t.string('user_id')
  t.foreign('user_id').references('user.id')
  t.timestamp('created_at').defaultTo(knex.fn.now())
})).then(process.exit)

// 실행 node src/schema.js 하면 DB에 생성된다.

```
- 변경 후 migrationfile

```js
// add_user.js  <migration file>
exports.up = function(knex, Promise) {
  // return은 promise가 끝난 여부를 판단하기 때문이다.
  return knex.schema.createTable('user', t => {
    t.string('id').primary()
    t.string('password').notNullable()
  })
};

exports.down = function(knex, Promise) {
  // usertable을 되돌리는 코드 작성
  return knex.schema.dropTable('user')
};


// url_entry.js <migration file>

exports.up = function(knex, Promise) {
  return knex.schema.createTable('url_entry', t => {
    t.string('id', 8).primary()
    t.string('long_url').notNullable()
    t.string('user_id')
    t.foreign('user_id').references('user.id')
    t.timestamp('created_at').defaultTo(knex.fn.now())
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('url_entry')
};

```

## Database 동시성 문제

접속한 링크에 count를 1씩 올릴때 동시에 1000번의 요청을 보낼 경우에 값을 제대로 반영을 못한다는 문제가 발생한다. 아래의 예를 보면 알 수 있다.

```js

// query.js
  saveClickCountById(id, click_count) {
    return knex('url_entry')
      .where({id})
      .update({click_count})
  }

// index.js
app.get('/:id', (req, res, next) => {
  query.getUrlById(req.params.id)
    .then(urlEntry => {
      if(urlEntry){
        query.saveClickCountById(urlEntry.id, urlEntry.click_count+1)
          .then(() => {
            res.redirect(urlEntry.long_url) // 301 moved~~ 영원히 이동한다 (브라우저에 저장) , 302 브라우저에 저장안하고 다시보낸다.
            // res.redirect(301, entry.long_url)를 해야하지만 사람들이 얼마나 클릭했는지 확인하기 위해서 301을 뺐다.
          })
      }else {
        next()
      }
    })
})

```
값을 업데이트하기전에 계속 값이 덮어씌어지는 문제가 발생한다.  

해결방법  
1. 잠금 => 성능이 느려진다. DeadLock이 발생할 확률이 생긴다.  
2. `Atomic Update` 원자적 갱신  
- 명령을 내릴 때 자동으로 증가시킨다.  
- knex의 `.increment`를 사용한다.  

```js
// query.js
  incrementClickCountById(id) {
    return knex('url_entry')
      .where({id})
      .increment('click_count', 1)
  }

// index.js
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

```

> Atomic Update를 하면 데이터베이스에 접속해서 가져오는 것이 아닌 바로 값을 올려버리기 때문에 제대로 값이 나타난다.

## bcrypt를 사용한 보안

[bcrypt](https://www.npmjs.com/package/bcrypt)  

```bash
> npm install --save bcrypt

> node
> bcrypt = require('bcrypt')
> bcrypt.hashSync('campus', 10)   # 2의 10승이다.
> hash = bcrypt.hashSync('campus', 10)  # hash에다가 값을 담아둔다

# 비교방법

> bcrypt.compareSync('campus', hash) # 정확하게 일치해야지 true이다.
true
> bcrypt.compareSync('campus1', hash)
false
```

To check a password    
```js
// Load hash from your password DB.
bcrypt.compareSync(myPlaintextPassword, hash); // true
bcrypt.compareSync(someOtherPlaintextPassword, hash); // false
```

동기의 방식을 사용하는 위에 script보다 아래의 방식이 좋다.   

```js
// Load hash from your password DB.
bcrypt.compare(myPlaintextPassword, hash).then(function(res) {
    // res == true
});
bcrypt.compare(someOtherPlaintextPassword, hash).then(function(res) {
    // res == false
});
```

## npm validator

많은 종류의 validation이 생성되어있으며 값이 맞는지 검증해주는 역할을 한다.

```bash
> npm install validator --save

```

## Error 처리방법
Flash : error를 session 저장해두었다가 다음 요청이 왔을 때 error 메세지를 보여준다.

```bash
> npm install connect-flash --save

```

> session을 사용하면 여러 요청에 걸친 정보를 유지할 수 있다.
