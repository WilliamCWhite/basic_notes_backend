import pool from './db.js'
// these functions are pretty self-explanatory

async function handleNoteGetRequest(req, res, paths, userId) {
    const client = await pool.connect();

    try {
        const dbResult = await client.query(`
            SELECT *
            FROM notes
            WHERE user_id = $1
            ORDER BY time_modified DESC
            `, [userId]);

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(dbResult.rows));
    } catch (error) {
        console.error(error);
    } finally {
        client.release();
    }
}

async function handleNotePostRequest(req, res, paths, userId) {
    const client = await pool.connect();

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    })
    req.on('end', async () => {
        const data = JSON.parse(body);
        try {
            const dbResult = await client.query(`
                INSERT INTO notes(title, body, user_id, time_created, time_modified)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `, [data.title, data.body, userId, data.time_created, data.time_modified]);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(dbResult.rows));
        } catch (error) {
            console.error(error);
        } finally {
            client.release();
        }
    })
}

async function handleNotePutRequest(req, res, paths, userId) {
    const client = await pool.connect();

    let body = '';
    req.on('data', chunk => {
        body += chunk.toString();
    })
    req.on('end', async () => {
        const data = JSON.parse(body);
        try {
            const dbResult = await client.query(`
                UPDATE notes
                SET
                    title = $1,
                    body = $2,
                    time_modified = $3
                WHERE note_id = $4
            `, [data.title, data.body, data.time_modified, paths[2]]);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(dbResult.rows));
        } catch (error) {
            console.error(error);
        } finally {
            client.release();
        }
    })
}

async function handleNoteDeleteRequest(req, res, paths, userId) {
    const client = await pool.connect();
    const idToDelete = paths[2];
    try {
        const dbResult = await client.query(`
            DELETE FROM notes
            WHERE note_id = $1
            RETURNING *
        `, [idToDelete]);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(dbResult.rows));
    } catch (error) {
        console.error(error);
    } finally {
        client.release();
    }
}


export {handleNoteGetRequest, handleNotePostRequest, handleNotePutRequest, handleNoteDeleteRequest}
