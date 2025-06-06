// Returns an object with two arrays, one of paths and one of searches
// If there's no path or no searches, they will default to empty arrays (0 paths, 0 searches)
function parseURL(url) {
    const [pathString, searchString] = url.split("?");
    let paths;
    if (pathString !== undefined) {
        paths = pathString.split("/")//.shift();
        // normalize to everything after /api/
        while (paths[0] == '' || paths.includes('api')) {
            paths.shift();
        }
    }
    let searches;
    if (searchString !== undefined) {
        searches = searchString.split("&");
    } else {
        searches = [];
    }
    return [paths, searches];
}

function generateKey() {
    let result = '';
    for (let i = 0; i < 20; i++) {
        const randomValue = Math.floor(Math.random() * 52); // 0-51
        // A is 65, Z is 90
        // a is 97, z is 122
        let ch;
        if (randomValue < 26) {
            ch = String.fromCharCode(65 + randomValue);
        } else {
            ch = String.fromCharCode(97 + (randomValue - 26));
        }
        result += ch;
    }
    return result;
}

export { parseURL, generateKey }
