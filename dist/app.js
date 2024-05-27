"use strict";

// app.js
var express = require('express');
var app = express();
var port = 3000;
app.get('/', function (req, res) {
  res.send('Hello, World!');
});
app.listen(port, function () {
  console.log("App listening at http://localhost:".concat(port));
});