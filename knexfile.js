module.exports = {
    development: {
        debug: true,
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'financial-tool'
        },
        migrations: {
            directory: './app/db/migrations',
            tableName: 'migrations'
        }
    },
    production: {
        client: 'mysql',
        connection: {
            host: '127.0.0.1',
            user: 'root',
            password: '',
            database: 'financial-tool'
        }
    }
};
