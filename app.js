var express = require('express');
var multer = require('multer');
var parser = require('body-parser');
var rocontasa = require('./routes/rocontasa');
var path = require('path');
var app = express();

app.use(parser.json());
app.use(parser.urlencoded());
app.use(multer({ dest: './uploads/'}));
app.use('/rocontasa', rocontasa);

app.listen(process.env.PORT || 80);
app.use(express.static(path.join(__dirname, 'public')));