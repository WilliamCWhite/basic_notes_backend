import pool from './db.js'

async function handleNoteGetRequest(req, res, paths, userId) {
    const client = await pool.connect();

    try {
        let finalResult;
        const dbResult = await client.query(`
            SELECT *
            FROM notes
            WHERE user_id = $1
            ORDER BY time_modified DESC
            `, [userId]);

        // If there are no notes associated with the user, create a placeholder note
        if (dbResult.rows.length === 0) {
            const currentTime = new Date(Date.now()).toISOString();
            const createResult = await client.query(`
                INSERT INTO notes (title, body, user_id, time_created, time_modified)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *
            `, ["placeholder", "this is a placeholder note", userId, currentTime, currentTime]);
            finalResult = createResult;
        }
        else {
            finalResult = dbResult;
        }
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(finalResult.rows));
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
        console.log(data);
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
        console.log("We deleted a note, and this is the db result");
        console.log(dbResult.rows);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(dbResult.rows));
    } catch (error) {
        console.error(error);
    } finally {
        client.release();
    }
}


export {handleNoteGetRequest, handleNotePostRequest, handleNotePutRequest, handleNoteDeleteRequest}
