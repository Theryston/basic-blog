const express = require('express');
const router = express.Router();
const User = require('./User')
const bcrypt = require('bcryptjs')
const adminAuth = require('../middlewares/adminauth')

router.get('/admin/users', adminAuth, (req, res) => {
	User.findAll().then(users => {
		res.render('admin/users/index', {
			users: users
		})
	}).catch(() => {
		res.redirect('/')
	})
})

router.get('/admin/user/create', adminAuth, (req, res) => {
	res.render('admin/users/create')
})

router.post('/user/create', (req, res) => {
	var email = req.body.email
	var password = req.body.password

	User.findOne({
		where: {
			email: email
		}}).then((user) => {
		if (user != undefined) {
			res.redirect('/admin/user/create')
		} else {
			var salt = bcrypt.genSaltSync(10)
			var hash = bcrypt.hashSync(password, salt)

			User.create({
				email: email,
				password: hash
			}).then(() => {
				res.redirect('/admin/users')
			}).catch(() => {
				res.redirect('/admin/user/create')
			})
		}
	})

})

router.get('/login', (req, res) => {
	if (req.session.user == undefined) {
		res.render('admin/users/login')
	} else {
		res.redirect('/admin')
	}
})

router.post('/authenticate', (req, res) => {
	var email = req.body.email
	var password = req.body.password
	var path = req.body.path

	if (path == '/login') {
		path = '/admin'
	}

	User.findOne({
		where: {
			email: email
		}})
	.then((user) => {
		if (user != undefined) {
			// Validar a senha

			var correct = bcrypt.compareSync(password, user.password)

			if (correct) {
				req.session.user = {
					id: user.id,
					email: user.email
				}
				res.redirect(path)
			} else {
				res.redirect('/login')
			}

		} else {
			res.redirect('/login')
		}
	})
	.catch(error => {
		res.redirect('/login')
	})

})

router.get('/logout', (req, res) => {
	req.session.user = undefined
	res.redirect('/')
})

router.post('/users/delete', (req, res) => {
	var id = req.body.id
	if (id != undefined) {
		if (!isNaN(id)) {

			User.destroy({
				where: {
					id: id
				}
			}).then(() => {
				res.redirect('/admin/users')
			})

		} else {
			res.redirect('/admin/users')
		}
	} else {
		res.redirect('/admin/users')

	}

})

router.get('/admin/user/edit/:id', adminAuth, (req, res) => {
	var id = req.params.id

	if (isNaN(id)) {
		res.redirect('/admin/users')
	}

	User.findByPk(id).then((user) => {
		if (user != undefined) {
			res.render('admin/users/edit', {
				user: user
			})
		} else {
			res.redirect('/admin/user')
		}
	}).catch(() => {
		res.redirect('/admin/user')
	})

})

router.post('/user/update', (req, res) => {
	var id = req.body.id
	var email = req.body.email
	var password = req.body.password

	var salt = bcrypt.genSaltSync(10)
	var hash = bcrypt.hashSync(password,
		salt)


	User.update({
		email: email,
		password: hash
	},
		{
			where: {
				id: id
			}
		}).then(() => {
			res.redirect('/admin/users')
		})

})

module.exports = router;