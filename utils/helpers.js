
module.exports.deepCopy = obj => {
    return JSON.parse(JSON.stringify(obj));
}