const express = require('express');
const cookieParser = require('cookie-parser')
const errorMiddleware = require('./middlewares/errors');
const app = express();
const bodyParser = require('body-parser')

const fileUpload = require('express-fileupload')


const dotenv = require('dotenv');

app.use(express.json());

app.use(express.urlencoded({limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(fileUpload());


const auth = require('./routes/auth');

const animals = require('./routes/animal');
const healths = require('./routes/health');
const adoptions = require('./routes/adoption');

app.use('/api/v1',adoptions);




app.use('/api/v1', auth);

app.use('/api/v1', animals);
app.use('/api/v1', healths);
app.use(errorMiddleware);


module.exports = app

