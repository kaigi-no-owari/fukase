const express = require('express');
const router = express.Router(); // eslint-disable-line new-cap
const pgp = require('pg-promise')();
const db = pgp(process.env.DATABASE_URL);

function findMeetings(req) {
  const params = {
    room_id: req.params.room_id,
    from: req.query.from || new Date(),
    to: req.query.to,
    limit: req.query.limit,
  };
  let sql = 'SELECT id, room_id, title, description ,';
  sql += ' to_char(start_at, \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') AS start_at, ';
  sql += ' to_char(end_at, \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') AS end_at, ';
  sql += ' to_char(registered_at, \'YYYY-MM-DD"T"HH24:MI:SS"Z"\') AS registered_at';
  sql += ' FROM meetings WHERE $(from) <= end_at';
  if (params.room_id) {
    sql += ' AND room_id = $(room_id)';
  }
  if (params.to) {
    sql += ' AND end_at <= $(to)';
  }
  sql += ' ORDER BY start_at ASC, id ASC';
  if (params.limit) {
    sql += ' LIMIT $(limit)';
  }
  return db.any(sql, params);
}

router.get('/', (req, res, next) => {
  findMeetings(req)
  .then((data) => res.status(200).json(data))
  .catch((err) => next(err));
});

router.get('/:room_id', (req, res, next) => {
  findMeetings(req)
  .then((data) => res.status(200).json(data))
  .catch((err) => next(err));
});

router.get('/:room_id/pow', (req, res, next) => {
  const threshold = req.query.threshold || 10;
  findMeetings(req)
  .then((data) => {
    if (data.length > 0) {
      const endAt = new Date(data[0].end_at);
      const remainingMillisec = endAt.getTime() - new Date().getTime();
      if (remainingMillisec / 1000 / 60 <= threshold) {
        res.status(200).json({ notification: true });
        return;
      }
    }
    res.status(200).json({ notification: false });
  })
  .catch((err) => next(err));
});

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
