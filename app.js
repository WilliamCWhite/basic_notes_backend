import pool from './db.js'
import http from 'http'
import parseURL from './parseURL.js'
import { handleNoteGetRequest } from './handleNoteRequests.js'


const server = http.createServer(async (req, res) => {
    const method = req.method.toUpperCase();
    const [paths, searches] = parseURL(req.url); //paths.length will never be 0

    if (paths[0] === 'notes') {
        if (method === 'GET') {
            handleNoteGetRequest(req, res, paths, searches);
        }
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
})