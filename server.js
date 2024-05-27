
const { specs, swaggerUi } = require('./src/config/swaggerConfig'); // Import Swagger configuration
const express = require('express');
const { connectToDatabase } = require('./src/db/db');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const logger = require('morgan');
const path = require('path');
const router = require('./src/routes/authRoutes');
const { auth } = require('express-openid-connect');
const dotenv = require('dotenv');
const authMiddleware = require('./src/middlewares/authMiddleware'); 
const publicRoutes = require('./src/routes/publicRoutes'); 
const privateRoutes = require('./src/routes/privateRoutes'); 
const accountDeletionRoute = require('./src/routes/accountDeletionRoutes')
const cors = require('cors');



// Load environment variables
dotenv.load();





//gemini config



// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());
// Connect to MongoDB
connectToDatabase();
const connection = mongoose.connection;
connection.once("open", () => {
    console.log("Database connected");
});

// Authentication middleware
const config = {
    authRequired: false,
    auth0Logout: true
};
if (!config.baseURL && !process.env.BASE_URL && process.env.PORT && process.env.NODE_ENV !== 'production') {
    config.baseURL = `http://localhost:${port}`;
}
app.use(auth(config));

// Middleware to fetch user roles using the access token
app.use((req, res, next) => {
    // Apply authMiddleware.fetchUserDatabase only to the '/' route
    if (req.originalUrl === '/') {
        authMiddleware.fetchUserDatabase(req, res, next);
    } else {
        next();
    }
});


// Routes
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/account-delete', accountDeletionRoute);

app.use('/', router);
app.use('/api/public', publicRoutes);
app.use('/api/private', privateRoutes);



// Start the server
http.createServer(app)
    .listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
