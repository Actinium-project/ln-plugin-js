import express from 'express';
import path from 'path';
import fs from 'fs';
import logger from 'morgan';
import bodyParser from 'body-parser';
import { errorHandler,
         accessManager
        } from './middlewares';
import { homeRouter,
         apiRouter } from './routes';
import * as config from './config.json';
import boom from 'express-boom';
import rfs from 'rotating-file-stream';
let logDir = path.join(__dirname, 'logs');

// webserver
const app = express();

// create logDir
fs.existsSync(logDir) || fs.mkdirSync(logDir);
// create a rotating write stream
const accessLogStream = rfs('access.log', {
  interval: '1d', // rotate daily
  path: logDir
});

// log only 4xx and 5xx responses to console
app.use(logger('dev', {
  skip: (req, res) => { return res.statusCode < 400 }
}));

// log all requests to access.log
app.use(logger('combined', { stream: accessLogStream } ));

// view engine setup (we don't use any view engine, only pure HTML & JS)
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(boom());
app.use(express.static(path.join(__dirname, 'public')));

// attach middlewares
// currently not in use
app.use(/^((?!public|keys|logout|login).)*$/, accessManager(config));

app.use('/', homeRouter(config));
app.use('/api', apiRouter(config));
app.use(errorHandler(config));

module.exports = app;
