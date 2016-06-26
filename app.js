const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/meetings');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use('/api/meetings', routes);

app.get('/', (req, res) => {
  res.send('OK');
});

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  res.status(status).json({ status, message: err.message });
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
