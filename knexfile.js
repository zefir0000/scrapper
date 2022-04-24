// Update with your config settings.

module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      user: 'root',
      password: 'KnybsAct0j@',
      database: 'Moto_DB',
      port: 3306
    },
    pool: {
      min: 2,
      max: 20
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/moto-catalog/migrations'
    },
    debug: false
  },

  production: {
    client: 'mysql2',
    connection: {
      host: 'localhost',
      user: 'root',
      password: 'KnybsAct0j@',
      database: 'Moto_DB',
      port: 3306
    },
    pool: {
      min: 2,
      max: 20
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: __dirname + '/knex/migrations'
    },
    debug: true
  }

};
