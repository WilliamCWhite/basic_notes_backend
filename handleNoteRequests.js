import pool from './db.js'

async function handleNoteGetRequest(req, res, paths, searches) {
    const client = await pool.connect();

    try {
        const dbResult = await client.query(`
            SELECT *
            FROM notes
            ORDER BY time_modified DESC
            `);
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(dbResult.rows));
    } catch (error) {
        console.error(error);
    } finally {
        client.release();
    }
}

async function handleNotePostRequest(req, res) {
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
                INSERT INTO notes(title, body)
                VALUES ($1, $2)
                RETURNING *
            `, [data.title, data.body]);
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(dbResult.rows));
        } catch (error) {
            console.error(error);
        } finally {
            client.release();
        }
    })
}

async function handleNotePutRequest(req, res, paths) {
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
            `, [data.title, data.body, data.time_modified, paths[1]]);
        } catch (error) {
            console.error(error);
        } finally {
            client.release();
        }
    })
}

async function handleNoteDeleteRequest(req, res, paths) {
    const client = await pool.connect();
    const idToDelete = paths[1];
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
