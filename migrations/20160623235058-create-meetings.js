exports.up = (db, callback) => {
  db.createTable('meetings', {
    id: { type: 'int', primaryKey: true, autoIncrement: true },
    room_id: 'string',
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
