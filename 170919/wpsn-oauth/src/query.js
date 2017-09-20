const knex = require('./knex')
const bcrypt = require('bcrypt')
const validator = require('validator')

module.exports = {
  firstOrCreateUserByProvider(provider, provider_user_id, access_token=null, avatar_url=null) {
    return knex('user')
      .where({
        provider,
        provider_user_id
      })
      .first()
      .then(user => {
        if (user) {
          return user
        } else {
          return knex('user')
          // 없으면 만들어서 줘라.
            .insert({
              provider,
              provider_user_id,
              access_token,
              avatar_url
            })
            // insert 뒤에 then을 하면 insert한 뒤에 생성된 값을 받아 올 수 있다.
            .then(([id]) => {
              return knex('user')
                .where({id})
                .first()
            })
        }
      })
  },
  getUserById(id) {
    return knex('user')
      .where({id})
      .first()
  },
}
