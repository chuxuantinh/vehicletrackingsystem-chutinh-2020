const login = require('./middleware/login');
const methodOverride = require('method-override');
const bodyparser = require('body-parser');
const exphbs = require('express-handlebars');
const express = require('express');
const mongoose = require('mongoose');
const location = require('./routes/location');
const delivery = require('./routes/delivery');
const agency = require('./routes/agency.js');
const driver = require('./routes/driver.js');
const auth  = require('./routes/auth.js');
const dashboard = require('./routes/dashboard');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();

mongoose.connect('mongodb://localhost/VehicleTrackingSystem', {useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log('Sucessfully Connected to Database'))
    .catch(err => console.error('Error ', err));
    
app.use(express.static('views'));
app.set('view engine', 'handlebars');
app.engine('handlebars', exphbs({defaultLayout: 'main'}));

app.use(cookieParser());
app.use(bodyparser.urlencoded({ extended: true}));
app.use(express.json());


// Express session
app.use(
    session({
      secret: 'secret',
      resave: true,
      saveUninitialized: true
    })
);

app.use(methodOverride('_method'));
app.use('/api', auth);
app.use('/dashboard', dashboard);
app.use('/agency', agency);
app.use('/driver', driver);
app.use('/delivery', delivery);
app.use('/location', location);


app.get('/', [login], (req, res) => {
    return res.render('loginAgency');
});

app.get('/loginDriver', login, (req, res) => {
    return res.render('loginDriver');
});

app.get('/logout', (req, res) => {
    return res.clearCookie('xAuthToken').redirect('/');
});

app.get('/registerAgency', login, (req, res) => {
    return res.render('registerAgency');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`listening on ${port}`);
});