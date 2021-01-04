const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')
const Article = require('./articles/Article')
const Category = require('./categories/Category')

const CategoriesController = require('./categories/categoriesController')
const ArticlesController = require('./articles/ArticlesController')

//view engine
app.set('view engine', 'ejs')

//bodyParser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//static
app.use(express.static('public'))

app.use(express.json())

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


//routers
app.get('/', (req, res) => {
	Article.findAll({order: [['id', 'desc']]}).then((articles) => {
		Category.findAll().then((categories) => {
		res.render('index', {
			articles: articles,
			categories: categories
		})
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
			Category.findAll().then((categories) => {
				res.render('article', {
					article: article,
					categories: categories
				})
			})
		} else {
			res.redirect('/')
		}
	}).catch(() => {
		res.redirect('/')
	})
})

app.get('/category/:slug', (req, res) => {
	var slug = req.params.slug

	Category.findOne({ 
		where: {
			slug: slug
		},
		include: [{model: Article}]
	}).then((category) => {
		if (category) {	
			Category.findAll().then((categories) => {
				res.render('index', {
					articles: category.articles,
					categories: categories
				})
			})
		}else {
			res.redirect('/')
		}
	})

})



//listen
app.listen(2020, () => {
	console.log('rodando!')
})
