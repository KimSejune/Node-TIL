const bcrypt = require('bcrypt')

exports.up = function(knex, Promise) {
  return knex('user')
  // first를 쓰지 않아서 배열로 들어온다.
    .then(users => {
      const promise = users.map(user => {
        const hash = bcrypt.hashSync(user.password, 10)
         return knex('user')
            .where({id: user.id})
            .update({password: hash})
      })
      return Promise.all(promise)
    })


};

exports.down = function(knex, Promise) {
  return Promise.resolve(1)
};

