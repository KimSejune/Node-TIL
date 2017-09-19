const faker = require('faker')
const randomstring = require('randomstring')
const bcrypt = require('bcrypt')
// 값이 실행되어서 이파일의 작업이 끝나는 것에 대해서 알려줘야한다.
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('user')
  .insert({
    id: 'fast',
    password: bcrypt.hashSync('campus', 10)
  })
  .then(() => {
    const arr = []
    for(var i = 0; i < 20; i++){
      arr.push(
        knex('url_entry')
          .insert({
            id: randomstring.generate(8),
            long_url: faker.internet.url(),
            user_id: 'fast'
          })
      )
    }

    return Promise.all(arr)
    // promise는 어떤값을 감싸고 있는데 그 값을 then을 사용해서 사용할 수 있다.
    // 단 return하는 것이 그냥 값이면 then에서는 그 값을 사용할 수 있다.
    // 여기서 다음에 등장하는 then에는 arr를 사용할 수 있다.
  })
}
