import http from 'http'
import { parseURL, generateKey } from './functions.js'
import { handleNoteDeleteRequest, handleNoteGetRequest, handleNotePostRequest, handleNotePutRequest } from './handleNoteRequests.js'
import { handleFetchUserRequest, handleCreateUserRequest } from './handleUserRequests.js'


const server = http.createServer(async (req, res) => {
    const method = req.method.toUpperCase();
    const [paths, searches] = parseURL(req.url); //paths.length will never be 0

    // console.log(`Request received! url = ${req.url} and method = ${req.method}`)

    res.setHeader('Access-Control-Allow-Origin', 'http://127.0.0.1:5173');
    res.setHeader('Access-Control-Request-Method', '*');
	res.setHeader('Access-Control-Allow-Methods', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (paths[0] === 'notes') {
        if (method === 'GET') {
            handleNoteGetRequest(req, res, paths, searches);
        } else if (method === 'POST') {
            handleNotePostRequest(req, res);
        } else if (method === 'PUT') {
            handleNotePutRequest(req, res, paths);
        }
        else if (method === 'DELETE') {
            handleNoteDeleteRequest(req, res, paths);
        }
    }
    else if (paths[0] === 'users' && method === 'POST') {
        if (searches) {
            handleFetchUserRequest(req, res);
        } else {
            handleCreateUserRequest(req, res);
        }
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
})