import cors from 'cors';
import chalk from 'chalk';
import helmet from 'helmet';
import express from 'express';

import bodyParser from 'body-parser';
import session from 'express-session';
import compression from 'compression';

import { serverConfig } from '../config';
import { dbConnection, dbDisconnection } from './utils';

import routes from './routes';

const app = express();
const serverPort = serverConfig.port;

const SERVER = app.listen(serverPort, () => {
  console.clear();
  console.info(chalk.green(`🌍 => is running (on port: ${serverPort})`));
  dbConnection()
    .then(res => console.log(chalk.green(res)))
    .catch(err => console.error(chalk.red(err)));
});

process.on('SIGINT', () => {
  SERVER.close(() => {
    dbDisconnection()
      .then(res => {
        console.clear();
        console.log(chalk.yellow(res));
      })
      .catch(err => console.error(chalk.red(err)))
      .finally(() => {
        console.log(chalk.yellow('🌍 => is close'));
        process.exit(0);
      });
  });
});

app.use(cors());
app.use(compression());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());

app.use(routes);

app.use(
  session({
    secret: 'test session',
    resave: true,
    saveUninitialized: false,
    cookie: { secure: true }
  })
);

app.get('/check', function(req, res) {
  res.json({
    TEST: 'Welcome to the Node express JWT Tutorial'
  });
});
