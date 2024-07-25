import pool from "./db.js";
import { generateKey } from "./functions.js";

async function handleFetchUserRequest(req, res) {
    console.log(`handling fetch user request`);
    const client = await pool.connect();

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    })
    req.on('end', async () => {
        const data = JSON.parse(body);
        console.log(data);

        try {
            const exists = await doesUserExist(data.username);
            if (!exists) {
                console.log(`user ${data.username} does not exist`);
                res.statusCode = 404
                res.end();
                return;
            }

            const dbResult = await client.query(`
                SELECT username, user_key
                FROM users
                WHERE username = $1 AND user_password = $2
            `, [data.username, data.password]);

            console.log(dbResult.rows);

            if (dbResult.rows.length === 0) {
                console.log(`Couldn't find match with username ${data.username} and user_password ${data.password}`);
                res.statusCode = 406
                res.end();
                return;
            }

            res.setHeader('Content-type', 'application/json')
            res.end(JSON.stringify({
                username: dbResult.rows[0].username,
                user_key: dbResult.rows[0].user_key
            }))

        } catch (error) {
            console.error(error);
        } finally {
            client.release();
        }

    })
}

async function handleCreateUserRequest(req, res) {
    const client = await pool.connect();

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    })
    req.on('end', async () => {
        const data = JSON.parse(body);
        console.log(data);

        try {
            const usernameExists = await doesUserExist(data.username);
            if (usernameExists) {
                res.statusCode = 406
                res.end();
                return;
            }
            
            const userKey = generateKey();

            const insertResult = await client.query(`
                INSERT INTO users(username, user_password, user_key)
                VALUES ($1, $2, $3)
            `, [data.username, data.password, userKey]);

            res.statusCode = 201
            res.setHeader('Content-type', 'application/json');
            res.end(JSON.stringify({
                username: data.username,
                user_key: userKey
            }))

        } catch (error) {
            console.error(error);
        } finally {
            client.release();
        }
    })
}

async function doesUserExist(username) {
    const client = await pool.connect();
    let result;

    try {
        const dbResult = await client.query(`
            SELECT username
            FROM users
            WHERE username = $1
        `, [username]);
        if (dbResult.rows.length !== 0) {
            result = true;
        } else {
            result = false;
        }
    } catch (error) {
        console.error(error);
    } finally {
        client.release();
    }
    return result;
}

export { handleFetchUserRequest, handleCreateUserRequest }