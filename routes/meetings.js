const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const pgp = require('pg-promise')();
const db = pgp(process.env.DATABASE_URL);

router.post('/', (req, res) => {
  // 単純に全データ削除してから登録し直す
  db.tx(t => {
    const queries = [];
    queries.push(t.none('DELETE FROM meetings'));
    if (Array.isArray(req.body)) {
      const now = new Date();
      req.body.forEach(m => {
        queries.push(t.none('INSERT INTO ' +
          'meetings (id, room_id, title, description, start_at, end_at, registered_at)' +
          'values (DEFAULT, $1, $2, $3, $4, $5, $6)',
          [m.room_id, m.title, m.description, m.start_at, m.end_at, now]
        ));
      });
    }
    return t.batch(queries);
  })
  .then(() => {
    res.json('ok'); // FIXME
  })
  .catch(error => {
    console.error(error);
    res.json('error'); // FIXME
  });
});

module.exports = router;
