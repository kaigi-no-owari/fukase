const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const pgp = require('pg-promise')();
const db = pgp(process.env.DATABASE_URL);

function getCreatedMeetings(req) {
  if (!Array.isArray(req.body)) {
    return [];
  }
  const now = new Date();
  return req.body.map(m => ({
    room_id: m.room_id,
    title: m.title || '',
    description: m.description || '',
    start_at: new Date(m.start_at),
    end_at: new Date(m.end_at),
    registered_at: now,
  }));
}

router.post('/', (req, res, next) => {
  // 単純に全データ削除してから登録し直す
  db.tx(t => {
    const queries = [];
    queries.push(t.none('DELETE FROM meetings'));
    getCreatedMeetings(req).forEach(meeting => {
      queries.push(t.none('INSERT INTO meetings' +
        ' (id, room_id, title, description, start_at, end_at, registered_at)' +
        ' values (DEFAULT, $(room_id), $(title), $(description), $(start_at),' +
        ' $(end_at), $(registered_at))', meeting));
    });
    return t.batch(queries);
  })
  .then(() => res.status(201).json({ status: 201, message: 'Created' }))
  .catch(err => next(err));
});

module.exports = router;
