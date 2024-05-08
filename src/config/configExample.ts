export interface DbConfig {
    uri: string;
}

export interface Config {
    development: DbConfig;
    production: DbConfig;
}

export const config: Config = {
    development: {
        uri: 'mongodb://{{host}}:{{port}}/{{db}}',
    },

    production: {
        uri: process.env.DATABASE_URI || '',
    }
};