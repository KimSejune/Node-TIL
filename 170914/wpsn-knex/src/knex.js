require('dotenv').config()

module.exports = require('knex')({
  client: 'mysql',
  connection: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME
  },
  debug: true
})

// node안에서 작성하는 구문 : knew = require('./src/knex)

