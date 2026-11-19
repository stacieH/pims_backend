require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { routes } = require('./routes');
const { setDns } = require('./helpers/dns');
const { connectDB } = require('./helpers/databaseConnection');
const { PORT } = require('./constants');
const path = require('path');
const fs = require('fs');

const isLocalDevelopment = require.main === module

const app = express();

isLocalDevelopment && setDns()

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (_, res) => {
    res.status(200).json({
        message: `Running on Port ${PORT}`,
        port: PORT,
        status: 'OK'
    })
})

// API Documentation
app.get('/documentation', (_, res) => {
     const filePath = path.join(__dirname, 'docs', 'documentation.html');

    console.log('Documentation path:', filePath);
    console.log('File exists:', fs.existsSync(filePath));

    if (!fs.existsSync(filePath)) {
        return res.status(404).send(`
            <h1>Documentation Not Found</h1>
            <p>Expected file: ${filePath}</p>
        `);
    }

    res.sendFile(filePath, (error) => {
        if (error) {
            console.error('DOCUMENTATION ERROR:', error);

            if (!res.headersSent) {
                res.status(500).send('Unable to load API documentation.');
            }
        }
    });
});

// Health Check
app.get('/health', async (_, res) => {
    try {
        await connectDB();

        res.status(200).json({
            message: 'API and database are running.',
            status: 'OK',
            database: 'Connected'
        });
    } catch (error) {
        res.status(503).json({
            message: 'Database connection unavailable.',
            status: 'ERROR',
            database: 'Disconnected',
            error: error.name
        });
    }
});

// Ensure database connection before API routes
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.error('DATABASE MIDDLEWARE ERROR:', {
            name: error.name,
            message: error.message,
            code: error.code,
            stack: error.stack
        });

        res.status(503).json({
            message: 'Database connection unavailable',
            error: error.name
        });
    }
});

// API routes
routes(app);

if (isLocalDevelopment) {
    app.listen(PORT, () => {
        console.log(`Server started at localhost:${PORT}`);
    });
}

// Export Express application for Vercel
module.exports = app;
