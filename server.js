import http from 'http'
import { parseURL, generateKey } from './functions.js'
import { handleNoteDeleteRequest, handleNoteGetRequest, handleNotePostRequest, handleNotePutRequest } from './handleNoteRequests.js'
import { handleFetchUserRequest, handleCreateUserRequest, idFromKeyUsername } from './handleUserRequests.js'


const server = http.createServer(async (req, res) => {
    const method = req.method.toUpperCase();
    const [paths, searches] = parseURL(req.url); //paths.length will never be 0
    console.log("Received the following request:");
    console.log(req.url);

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
        if (!(req.headers.userauthenticationkey && paths.length > 1)) {
            console.log("Received a request where there was either no userAuthenticationKey, or no user specified");
            return;
        }

        const targetUsername = paths[1];
        const targetKey = req.headers.userauthenticationkey;
        const userId = await idFromKeyUsername(targetKey, targetUsername);
        if (userId === false) {
            console.log('The key and username did not match');
        }

        if (method === 'GET') {
            handleNoteGetRequest(req, res, paths, userId);
        } else if (method === 'POST') {
            handleNotePostRequest(req, res, paths, userId);
        } else if (method === 'PUT') {
            handleNotePutRequest(req, res, paths, userId);
        }
        else if (method === 'DELETE') {
            handleNoteDeleteRequest(req, res, paths, userId);
        }
    }
    else if (paths[0] === 'users' && method === 'POST') {
        console.log(searches);
        if (searches[0] === 'action=fetchUser') {
            handleFetchUserRequest(req, res);
        } else if (searches[0] === 'action=createUser') {
            handleCreateUserRequest(req, res);
        }
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
})