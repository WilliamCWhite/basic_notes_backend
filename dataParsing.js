// Returns an object with two arrays, one of paths and one of searches
// If there's no path or no searches, they will default to empty arrays (0 paths, 0 searches)
function parseURL(url) {
    const [pathString, searchString] = url.split("?");
    let paths;
    if (pathString !== undefined) {
        paths = pathString.split("/")//.shift();
        paths.shift();
    }
    let searches;
    if (searchString !== undefined) {
        searches = searchString.split("&");
    } else {
        searches = [];
    }
    return [paths, searches];
}


export { parseURL }