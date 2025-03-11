const { Sequelize } = require("sequelize");

const errorHandler = (err, req, res, next) => {
    // Log the error stack trace
    console.error(err);

    // Send a custom error messgage and status code based on the error type
    if(err instanceof Sequelize.ValidationError) {
        return res.status(400).json({ error: err.errors.map( e => e.message) });
    }

    if(err.name === "UnauthorizedError") {
        return res.status(401).json({ error: "Unauthorized"});
    }

    res.status(500).json({ error: "Internal Server Error"});
};

module.exports = errorHandler;