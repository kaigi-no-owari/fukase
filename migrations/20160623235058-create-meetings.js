exports.up = (db, callback) => {
  db.createTable('meetings', {
    room_id: { type: 'string', primaryKey: true },
    title: 'string',
    description: 'string',
    start_at: { type: 'datetime', notNull: true },
    end_at: { type: 'datetime', notNull: true },
    registered_at: { type: 'datetime', notNull: true },
  }, callback);
};

exports.down = (db, callback) => {
  db.dropTable('meetings', callback);
};
