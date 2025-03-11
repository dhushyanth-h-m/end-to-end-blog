const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const authRouter = require('./middleware/auth');
const sequelize = require('./sequelize');

const app = express();
app.use(cors());
app.use(express.json());
app.use(errorHandler);

app.use('/auth', authRouter);

const PORT = process.env.PORT || 3000;

// Import models
const UserModel = require('./models/user');
const User = UserModel(sequelize, require('sequelize').DataTypes);

async function initializeApp() {
    try {
        // Sync database (this will create tables if they don't exist)
        await sequelize.sync({ force: false }); // Use force: true only in development to recreate tables
        console.log('Database synced successfully');

        // Start server
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Failed to initialize database:', error);
    }
}

initializeApp();

pool.connect()
    .then(() => console.log(`Connected to the database successfully "${process.env.DB_NAME}"`))
    .catch(err => console.error("Error connecting to the database", err));

app.get('/api/posts', async(req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts');
        res.json(result.rows);
    } catch(error) {
        console.error("Error fetching posts", error);
        res.status(500).json({error: "Error fetching posts"});
    }
});