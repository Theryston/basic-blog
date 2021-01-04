const express = require('express');
const router = express.Router();
const Category = require('../categories/Category')
const Article = require('./Article')
const slugify = require('slugify')

router.get('/admin/articles', (req, res) => {
	Article.findAll({
		include: [{
			model: Category
		}]
	}).then((articles) => {
		res.render('admin/articles/index', {
			articles: articles
		})
	})
})

router.get('/admin/articles/new', (req, res) => {
	Category.findAll().then((categories) => {
		res.render('admin/articles/new', {
			categories: categories
		})
	})
})

router.get('/admin/article/edit/:id', (req, res) => {
	const id = req.params.id

	Category.findAll().then((categories) => {
		Article.findByPk(id, {
			include: [{
				model: Category
			}]
		}).then(article => {
			res.render('admin/articles/edit', {
				article: article,
				categories: categories
			})
		})
	})
})

router.post('/article/update', (req, res) => {
	const {
		title, body, id, category
	} = req.body

	Article.update({
		title: title,
		slug: slugify(title),
		body: body,
		categoryId: category
	}, {
		where: {
			id: id
		}
	})
	.then(() => {
		res.redirect('/admin/articles')
	})
	.catch(() => {
		res.redirect('/admin/articles')
	})

})

router.post('/articles/save', (req, res) => {
	var title = req.body.title
	var body = req.body.body
	var category = req.body.category

	Article.create({
		title: title,
		slug: slugify(title),
		body: body,
		categoryId: category
	}).then(() => {
		res.redirect('/admin/articles')
	})

})

router.post('/articles/delete', (req, res) => {
	var id = req.body.id
	if (id != undefined) {
		if (!isNaN(id)) {

			Article.destroy({
				where: {
					id: id
				}
			}).then(() => {
				res.redirect('/admin/articles')
			})

		} else {
			res.redirect('/admin/articles')
		}
	} else {
		res.redirect('/admin/articles')

	}

})

router.get('/articles/page/:num', (req, res) => {
	var page = req.params.num
	var offset = 0
	
	if (isNaN(page) || page == 1) {
		offset = 0
	} else {
		offset = (parseInt(page) - 1) * 4;
	}
	
	Article.findAndCountAll({
		limit: 4,
		offset: offset
	}).then(articles => {

		var next;
		if (offset + 4 >= articles.count) {
			next = false
		} else {
			next = true
		}

		var result = {
			next: next,
			articles: articles,
			offset: offset
		}

		res.json(result)
	})

})

module.exports = router;