const path = require('path');
const mongoose = require('mongoose')

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Add CORS middleware

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cors());

// const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/admin', adminData.routes);
app.use('/', shopRoutes.routes);

app.use((req, res, next) => {
    //  res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

// Add CORS headers to responses
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
      return res.status(200).json({});
    }
    next();
  });

mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://shopdb:shopdb@shopdb.2unren5.mongodb.net/shopdb?retryWrites=true&w=majority&appName=ShopDb')
    .then(() => {
        console.log('Mongoose connected successfully.');
        app.listen(3000);
    })
    .catch(err => {
        console.log('Mongoose connection error: ' + err);
    });
