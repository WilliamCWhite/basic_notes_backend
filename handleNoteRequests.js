import http from 'http'
import pool from './db.js'
import format from 'pg-format'

async function handleNoteGetRequest(req, res, paths, searches) {
    const client = await pool.connect();

    let searchProperty;
    let sortMethod;
    if (searches.length !== 0) {
        [searchProperty, sortMethod] = searches[0].split('=');
    } else {
        [searchProperty, sortMethod] = ['time_modified', 'DESC']
    }

    try {
        const sqlQuery = format(`
            SELECT *
            FROM notes
            ORDER BY %I %s
            `, searchProperty, sortMethod);
        const dbResult = await client.query(sqlQuery);

        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(dbResult.rows));
        //console.log(`Successfully processed query with searchProperty=${searchProperty} and sortMethod=${sortMethod}`);
    } catch (error) {
        console.error(error);
    } finally {
        await client.release();
    }
}

function handleNotePostRequest(req, res, paths, searches) {

}

function handleNotePutRequest(req, res, paths, searches) {

}

function handleNoteDeleteRequest(req, res, paths, searches) {

}

export {handleNoteGetRequest, handleNotePostRequest, handleNotePutRequest, handleNoteDeleteRequest}
