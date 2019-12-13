const express = require('express');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const http = require('http');
const methodOverride = require('method-override');
const passport = require('passport');
const path = require('path');
const session = require('express-session');
const socketio = require('socket.io');

// Initializations
const app = express();
require('./database');
require('./config/passport');

// settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// middlewares
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Global Variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// routes
app.use(require('./routes'));
app.use(require('./routes/users'));
app.use(require('./routes/measures'));

// Bootstrap 4 y librerías necesarias
app.use('/css', express.static(path.join(process.cwd(), '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(process.cwd(), '/node_modules/jquery/dist')));
app.use('/js', express.static(path.join(process.cwd(), '/node_modules/popper.js/dist')));
app.use('/js', express.static(path.join(process.cwd(), '/node_modules/bootstrap/dist/js')));

// static files
app.use(express.static(path.join(__dirname, 'public')));

// Server is listening
const server = http.createServer(app);
global.io = socketio.listen(server);
server.listen(app.get('port'), () => {
    console.log('Server on port', app.get('port'));
});