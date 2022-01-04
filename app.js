const express = require('express');
// const {loadMap} = require('./public/utils/map.js');
const {loadProviders, findProvider} = require('./utils/map.js')
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');
// const L = require('leaflet');

const app = express();
const port = 9000;


//EJS
app.set('view engine','ejs');
//Third-party Middlewere
app.use(expressLayouts);
//Built-in middleware
app.use(express.static('public'))
app.use(express.urlencoded({extended:true}));


//Konfigurasi flash
app.use(cookieParser('secret'));
app.use(session({
    cookie:{maxAge:6000},
    secret:'secret',
    resave: true,
    saveUninitialized:true,
}));

app.use(flash());

app.get('/', (req, res) => {
    res.render('index', {
        title:'Hazmy-Resume',
        layout: 'layouts/main-layout',
    });
})

app.get('/portofolio', (req, res) => {
    res.render('portofolio', {
        title:'Hazmy-Portofolio',
        layout: 'layouts/demo-layout',
    });
})


app.get('/demo', (req, res) => {
    const basemap= loadProviders();
    res.render('demo', {
        title:'Hazmy-Map Demo',
        layout: 'layouts/demo-layout',
        basemap,
    });
})

app.get('/basemaps-providers', (req, res) => {
    const basemap= loadProviders();
    res.jsonp(basemap);
})


app.use('/', (req, res) => {
    res.status(404);
    res.send('<h1>404</h1>');
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})