const express = require('express');
require('dotenv').config();
const app = express(); 
const port = process.env.PORT || 3000;
const cors = require('cors');

app.use(express.json());
app.use(cors());

const companyRouter = require('./routes/company.routes');
const contactsRouter = require('./routes/contacts.routes');
const outdoorsRouter = require('./routes/outdoors.routes');
const homeRouter = require('./routes/home.routes');

const outdoorModel = require('./models/outdoor.model');
const requestModel = require('./models/request.model');
const userModel = require('./models/user.model');
const user_resquestModel = require('./models/user_request.model');
const favoritesModel = require('./models/favorites.model');

app.get('/', function (req, res) {
    res.status(200).json({
        message: 'home'
    });
});

app.use('/', homeRouter);
// app.use('/quemsomos', companyRouter);
// app.use('/contactos', contactsRouter);
app.use('/outdoors', outdoorsRouter);

app.listen(port, () => {
    console.log('Server Running at http://localhost:' + port);
});

