const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

require('dotenv').config();


const app = express();
app.use(express.json());
var corsOptions = {
    origin: 'https://capchat-128d3c8c71a2.herokuapp.com', // or your angular app's origin
    credentials: true
}

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(cookieParser());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }
    console.log('connected as id ' + connection.threadId);
});

// Routes
const authenticationRoutes = require('./routes/authentication');
const userRoutes = require('./routes/user');
const capchatRoutes = require('./routes/capchat');
const imageSetRoutes = require('./routes/imageSet');

// Use routes
authenticationRoutes(app, connection);
userRoutes(app, connection);
capchatRoutes(app, connection);
imageSetRoutes(app, connection);


app.use('/resources', express.static(path.join(__dirname, 'resources')));

const PORT = process.env.PORT || 3000;

app.listen(PORT, "0.0.0.0", () => console.log('Server started' + __dirname));
