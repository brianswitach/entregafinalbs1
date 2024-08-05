const express = require('express');
const mongoose = require('mongoose');
const handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const indexRouter = require('./routes/index');

const app = express();

// Configuración de Handlebars
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Rutas
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', indexRouter);

// Conexión a la base de datos
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to Database');
        app.listen(8080, () => {
            console.log('Server is running on port 8080');
        });
    })
    .catch(err => console.error(err));
