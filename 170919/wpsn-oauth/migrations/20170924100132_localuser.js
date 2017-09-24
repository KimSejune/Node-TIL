
exports.up = function(knex, Promise) {
  return knex.schema.createTable('localuser', t => {
    t.increments()
    t.string('username').unique()
    t.string('hashed_password').notNullable()
    t.integer('user_id').unsigned().notNullable()
    t.foreign('user_id').references('user.id')
  })
};

exports.down = function(knex, Promise) {
  return knex.shema.dropTable('localuser')
};
