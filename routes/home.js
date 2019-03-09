import express from 'express';
import { accessManager } from '../middlewares';

const init = (config) => {

  const router = new express.Router();

  router.get('/', (req, res, next) => {
    response.sendFile( 'index.html');
  });

  router.get('/dashboard', accessManager(config),
                          (req, res, next) => {
    res.render('dashboard', { title: 'Dashboard' });
  });

  router.get('/login', (req, res, next) => {
    res.render('login', { title: 'Login'});
  });

  return router;

};

export {
  init
};

