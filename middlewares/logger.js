
const logger = (req, res, next) => {
    console.log("1")
    next();
}

module.exports = logger;