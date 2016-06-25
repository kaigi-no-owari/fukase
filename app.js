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

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
