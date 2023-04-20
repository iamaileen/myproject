const Product = require('../models/product');
const Personnel = require('../models/personnel');
const dotenv = require('dotenv');
const connectDatabase = require('../config/database');

const products = require('../data/products');
const personnels = require('../data/personnels');


dotenv.config({ path: 'backend/config/config.env' })

connectDatabase();

const seedProducts = async () => {
    try {

        await Product.deleteMany();
        console.log('Products are deleted');

        await Product.insertMany(products)
        console.log('All Products are added.')

        process.exit();

    } catch (error) {
        console.log(error.message);
        process.exit();
    }
}

const seedPersonnels = async () => {
    try {

        await Personnel.deleteMany();
        console.log('Personnels are deleted');

        await Personnel.insertMany(personnel)
        console.log('All Personnels are added.')

        process.exit();

    } catch (error) {
        console.log(error.message);
        process.exit();
    }
}

seedProducts()
seedPersonnels()