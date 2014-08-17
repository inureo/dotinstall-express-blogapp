// require
var express        = require('express');
var app            = express();
var morgan         = require('morgan');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var cookieParser   = require('cookie-parser');
var session        = require('express-session');
var csrf           = require('csurf');
var ejs            = require('ejs');
var post           = require('./routes/post');

// template engine settings
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// middleware
app.use(morgan('dev')); // loggerは4で切り分けられた
app.use(function(err, req, res, next) {
    res.send(err.message);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(methodOverride(function(req, res){
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        var method = req.body._method
        delete req.body._method
        return method
    }
})); // loggerと同じく切り分けられた、このようにカスタムロジックを追加しておかないとオーバーライドしてくれないので注意
app.use(express.static(__dirname + '/public'));

// security
app.use(cookieParser());
app.use(session({ secret: 'inureodayo' }));
app.use(csrf());
app.use(function(req, res, next) {
    res.locals.csrftoken = req.csrfToken();
    next();
});

// routing
app.get('/', post.index);
app.get('/posts/:id([0-9+])', post.show); // 正規表現設定しておかないとRoutingでこれがひっかかるよ！
app.get('/posts/new', post.new);
app.post('/posts/create', post.create);
app.get('/posts/:id/edit', post.edit);
app.put('/posts/:id', post.update);
app.delete('/posts/:id', post.destroy);

app.listen(3000);
