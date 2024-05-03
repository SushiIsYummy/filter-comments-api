require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const authenticateUser = require('./middleware/authenticateUser');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const meRouter = require('./routes/me');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const routeNotFoundHandler = require('./middleware/routeNotFoundHandler');

connectDB();

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(authenticateUser);

app.use('/api/users', usersRouter);
app.use('/api/auth', authRouter);
app.use('/api/me', meRouter);

app.use(routeNotFoundHandler);
app.use(errorHandler);

module.exports = app;
