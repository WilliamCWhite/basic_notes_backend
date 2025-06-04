import dotenv from 'dotenv'
import pg from 'pg'

dotenv.config();
const env = process.env;

const pool = new pg.Pool({
    user: env.NODE_DB_USER,
    database: env.NODE_DB_DATABASE,
    password: env.NODE_DB_PASSWORD,
    port: env.NODE_DB_PORT,
    host: env.NODE_DB_HOST
});

console.log(`${env.NODE_DB_USER} ${env.NODE_DB_DATABASE} ${env.NODE_DB_PASSWORD} ${env.NODE_DB_HOST} ${env.NODE_DB_PORT}`);
export default pool;


