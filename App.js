const express = require('express');
const bodyParser = require('body-parser');
const path = require('path')
const paypal = require('paypal-rest-sdk');
const cors = require('cors')


//custom modules
const routes = require('./routes/router.js');

//paypal int
paypal.configure({
    'mode': 'sandbox', //sandbox or live
    'client_id': 'AQu86yqhDDKUzWQTWXsplC_D7ge6Xac_HxawxSEmFO00PbEp_FfJDLRFXKNu-QF-ikroDf4lGOFXAh4_',
    'client_secret': 'EBoQ5zF42Y0Q9jxA1Bgyiv3bh6HP830uXWcf8TDzZA3ltKn5IUx9XCU2YNkqOrusdRzvwXLI5QPnpxBt'
  });

//express app
const app = express()

//template engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//middlewares
app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());

//adding route
app.use('/', routes)

app.listen(process.env.PORT || 3000, () => console.log(`app started at ${process.env.PORT}`))