function adminAuth(req, res, next) {
	if (req.session.user != undefined) {
		next()
	} else {
		res.render('admin/users/login')
	}
}

module.exports = adminAuth;