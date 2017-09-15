
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
