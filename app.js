const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const connection = require('./database/database')

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


app.get('/', (req, res) => {
	res.render('index')
})

app.listen(2020, () => {
	console.log('rodando!')
})