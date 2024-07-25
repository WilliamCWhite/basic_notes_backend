import pool from "./db";
import { generateKey } from "./functions";

async function handleUserGetRequest(req, res) {

}

async function handleUserPutRequest(req, res) {
    const client = await pool.connect();

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    })
    req.on('end', async () => {
        const data = JSON.parse(body);
        console.log(data);

        try {
            const dbResult = await client.query(`
                SELECT username
                FROM notes
                WHERE username = $1
            `, [data.username])

            console.log(dbResult.rows);
            
            if (dbResult.rows.length !== 0) {
                res.status(406).send('Status: Not Acceptable');
                return;
            }
            
            const userKey = generateKey();

            const insertResult = await client.query(`
                INSERT INTO notes(username, password, user_key)
                VALUES ($1, $2, $3)
            `, [data.username, data.password, userKey]);

            res.status(201).send('Status: Created');
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

export { handleUserGetRequest, handleUserPutRequest }