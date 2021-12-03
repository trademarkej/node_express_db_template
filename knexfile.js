// Update with your config settings.
// Initial usage: npx knex migrate:latest

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/database.db'
    },
    useNullAsDefault: true,
    pool: {
      afterCreate: (conn, done) => {
        conn.run("PRAGMA foreign_keys = ON", done);
      }
    }
  }
};
