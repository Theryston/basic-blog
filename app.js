const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const Article = require('./articles/Article')
const Category = require('./categories/Category')

const CategoriesController = require('./categories/CategoriesController')
const ArticlesController = require('./articles/ArticlesController')

//view engine
app.set('view engine', 'ejs')

//bodyParser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//static
app.use(express.static('public'))

//Databasee
connection
	.authenticate()
		.then(() => {
			console.log('Connected with database!')
		})
		.catch((error) => {
			console.log(error)
		})

app.use('/', CategoriesController)
app.use('/', ArticlesController)

app.get('/', (req, res) => {
	Article.findAll().then((articles) => {
		res.render('index', {
			articles: articles
		})
	})
})

app.get('/:slug', (req, res) => {
	var slug = req.params.slug
	Article.findOne({
		where: {
			slug: slug
		}
	}).then(article => {
		if (article) {
			res.render('article', {
				article: article
			})
		} else {
			res.redirect('/')
		}
	}).catch(() => {
		res.redirect('/')
	})
})

app.listen(2020, () => {
	console.log('rodando!')
})