var express = require('express');
var app = express();

console.log('Started?');

app.get('/', function(req, res)
{
  res.send('connected');

  console.log("left: " + req.query.left);
  console.log("right: " + req.query.right);
});

app.listen(3000);