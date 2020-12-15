const Sequelize = require('sequelize')

const connection = new Sequelize('blog', 'root', 'Theryston10', {
	host: 'localhost',
	dialect: 'mysql',
	timezone: '-03:00'
})

module.exports = connection;