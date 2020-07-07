var express = require('express');
var compression = require('compression');
var helmet = require('helmet');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');
var routes = require('./public/controller/routes');

app.disable('etag');

app.use(bodyParser.urlencoded({extended: true}));
app.use(compression());
app.use(helmet());
app.use(helmet.referrerPolicy({
    policy: ['no-referrer',
'unsafe-url', 'same-origin']
}));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use('/', routes);
app.use('/home', routes);


app.listen(process.env.PORT || 3000, ()=>{
    console.log(`Server listening on port ${process.env.PORT || 3000} ...`);
})

