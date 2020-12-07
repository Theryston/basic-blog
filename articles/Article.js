const sequelize = require('sequelize')
const connection = require('../database/database')
const Category = require('../categories/Category')

const Article = connection.define('articles', {
	title: {
		type: sequelize.STRING,
		allowNull: false
	},
	slug: {
		type: sequelize.STRING,
		allowNull: false
	},
	body: {
		type: sequelize.TEXT,
		allowNull: false
	}
})

Category.hasMany(Article) //uma categoria tem muitos artigos!
Article.belongsTo(Category) //um artigo pertence a uma categoria!

Article.sync({force: false})

module.exports = Article;