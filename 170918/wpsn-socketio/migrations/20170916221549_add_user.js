
exports.up = function(knex, Promise) {
  return knex.schema.createTable('user', t => {
    // id자동생성
    t.increments()
    t.string('username').unique().notNullable()
    t.string('hashed_password').notNullable()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('user')
};
