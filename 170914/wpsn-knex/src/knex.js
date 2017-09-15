const config = require('../knexfile')

module.exports = require('knex')(config.development)
// node안에서 작성하는 구문 : knew = require('./src/knex)

