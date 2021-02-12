const pool = require('../models/queries.js');
const paypal = require('paypal-rest-sdk');


let controller = {
    home: async function(req, res) {
        let products = await pool.query('SELECT * FROM products ORDER BY id ASC');
        res.json(products.rows)
    },

    postCart: async function(req, res) {
        let productId = req.body.product_id;
        let addToCart = await pool.query('INSERT INTO cart (product_id) VALUES ($1)', [productId]);
        res.end()
    },

    getCart: async function(req, res) {
        let getItems = await pool.query('SELECT products.name, products.price, cart.cart_id FROM products JOIN cart ON products.id = cart.product_id');
        let total = await pool.query('SELECT SUM(products.price) FROM products JOIN cart ON products.id = cart.product_id')
        res.json(total)
    },

    deleteFromCart: async function(req, res) {
        let id = req.params.cart_id;
        let del = await pool.query('DELETE FROM cart WHERE cart_id = $1', [id]);
        res.end()
    },

    postPaypal: async function(req, res) {
        let products = await pool.query('SELECT products.name, products.id, products.price FROM products JOIN cart ON products.id = cart.product_id');
        let totalAmount = req.body.amount;

        const create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": "https://ecommerce-kmt.herokuapp.com/success",
                "cancel_url": "https://ecommerce-kmt.herokuapp.com/cancel"
            },
            "transactions": [{
                "item_list": {
                    "items": products.rows.map((product) => {
                        return {
                            name: product.name,
                            sku: product.id,
                            price: product.price,
                            currency: "USD",
                            quantity: 1
                        }
                    })
                },
                "amount": {
                    "currency": "USD",
                    "total": totalAmount
                },
                "description": "Thanks for Purchasing"
            }]
        };
        console.log(create_payment_json)
        paypal.payment.create(create_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                for(let i = 0; i < payment.links.length; i++) {
                  if(payment.links[i].rel === 'approval_url') {
                    res.json(payment.links[i].href)
                  }
                }
            }
        });
    },

    success: async function(req, res) {
        const payerId = req.query.PayerID;
        const paymentId = req.query.paymentId;

        const execute_payment_json = {
            "payer_id" : payerId
        };

        paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
            if (error) {
                throw error;
            } else {
                pool.query('INSERT INTO payment (payment_id, payer_id, first_name, last_name, email) VALUES ($1, $2, $3, $4, $5)', [payment.id, payment.payer.payer_info.payer_id, payment.payer.payer_info.first_name, payment.payer.payer_info.last_name, payment.payer.payer_info.email], (err, resp) => {
                    if(err) {
                        next(err)
                    } else {
                        pool.query('DELETE FROM cart', (err, data) => {
                            if(err) throw err;
                            res.render('success')
                        })
                    }
                });
            }
        });
    },

    cancel: function(req, res) {
        res.render('failure')
    }
} 

module.exports = controller;