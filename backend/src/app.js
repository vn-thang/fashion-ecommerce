const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const routes = require('./routes');

const app = express();
app.set('trust proxy', 1);

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use('/api', routes);

module.exports = app;