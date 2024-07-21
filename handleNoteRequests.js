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
        await client.release();
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

function handleNotePutRequest(req, res, paths, searches) {

}

function handleNoteDeleteRequest(req, res, paths, searches) {

}

export {handleNoteGetRequest, handleNotePostRequest, handleNotePutRequest, handleNoteDeleteRequest}
