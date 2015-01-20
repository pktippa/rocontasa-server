var express = require('express');
var parser = require('body-parser');
var rocontasa = require('./routes/rocontasa');
var path = require('path');
var app = express();

app.use(parser.json());
app.use(parser.urlencoded());
app.use('/rocontasa', rocontasa);

app.listen(process.env.PORT || 80);
app.use(express.static(path.join(__dirname, 'public')));