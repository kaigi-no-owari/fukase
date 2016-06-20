var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

app.get('/', function (req, res) {
  res.send('OK');
});

app.listen(port, function () {
  console.log('Listening on port ' + port);
});
