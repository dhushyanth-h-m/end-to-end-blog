const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

pool.connect()
    .then(() => console.log(`Connected to the database successfully "${process.env.DB_NAME}"`))
    .catch(err => console.error("Error connecting to the database", err));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})