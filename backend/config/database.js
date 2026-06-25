"use strict";

module.exports = ({ env }) => {
  const client = env("DATABASE_CLIENT", "postgres");

  return {
    connection: {
      client,
      connection: {
        host: env("DATABASE_HOST", "127.0.0.1"),
        port: env.int("DATABASE_PORT", 5432),
        database: env("DATABASE_NAME", "essence_source"),
        user: env("DATABASE_USERNAME", "essence_source"),
        password: env("DATABASE_PASSWORD", "essence_source"),
        ssl: env.bool("DATABASE_SSL", false)
          ? {
              rejectUnauthorized: env.bool("DATABASE_SSL_REJECT_UNAUTHORIZED", false),
            }
          : false,
      },
      pool: {
        min: env.int("DATABASE_POOL_MIN", 2),
        max: env.int("DATABASE_POOL_MAX", 10),
      },
      acquireConnectionTimeout: env.int("DATABASE_CONNECTION_TIMEOUT", 60000),
    },
  };
};
