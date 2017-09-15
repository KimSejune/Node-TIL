
exports.up = function(knex, Promise) {
  return knex.schema.table('url_entry', t => {
    t.integer('click_count').unsigned().defaultTo(0)
    // defalutTo는 기본사항이다. schemaBuilder.md 파일을 참고
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.table('url_entry', t => {
    t.dropColumn('click_count')
  })
};
