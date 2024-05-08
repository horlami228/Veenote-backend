export interface DbConfig {
    uri: string;
}

export interface Config {
    development: DbConfig;
    production: DbConfig;
}

export const config: Config = {
    development: {
        uri: process.env.DATABASE_DEV_URI || 'mongodb://localhost:27017/veenote',
    },

    production: {
        uri: process.env.DATABASE_URI || '',
    }
};
