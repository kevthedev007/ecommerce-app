const express = require('express');
const bodyParser = require('body-parser');


//custom modules
const routes = require('./routes/router.js')


//express app
const app = express()

//middlewares
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//adding route
app.use('/', routes)

app.listen(3000, () => console.log('app started at port 3000'))