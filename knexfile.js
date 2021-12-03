// Update with your config settings.
// Initial usage: npx knex migrate:latest

module.exports = {

  development: {
    client: 'sqlite3',
    connection: {
      filename: './data/lessons.sqlite3'
    },
    useNullAsDefault: true
  }
};
