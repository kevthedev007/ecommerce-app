const pool = require('../models/queries.js');

let controller = {
    home: async function(req, res) {
        let products = await pool.query('SELECT * FROM products ORDER BY id ASC');
        res.json(products.rows)
    }
} 

module.exports = controller;