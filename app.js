const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const db = pgp(process.env.DATABASE_URL);
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('OK');
});

app.get('/db', (req, res) => {
  db.any('select * from information_schema.schemata')
    .then(data => {
      res.send(data);
    })
    .catch(error => {
      res.send(error);
    });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
