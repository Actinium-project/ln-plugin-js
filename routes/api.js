import express from 'express';
import mongoose from 'mongoose';
import Status from '../models/status';
import boom from 'boom';

const init = (config) => {

    const router = new express.Router();

    mongoose.connect('mongodb://localhost/lightning', { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

    router.get('/', (req, res) => {
      response.sendFile('index.html');
    });

    router.post('/update', async (req, res) => {
      try {
        console.log('Received data from LN: ' + JSON.stringify(req.body));
        const json = req.body;
        console.log('object parsed to : ' + JSON.stringify(json));
        let status = undefined;

        if (json.method == 'connect') {
          status = new Status(
            {
              id: json.params.id,
              event: json.method,
              type: json.params.address.type,
              address: json.params.address.address,
              port: json.params.address.port
            }
          );
        } else if (json.method == 'disconnect') {
          status = new Status(
            {
              id: json.params.id,
              event: json.method,
              type: '',
              address: '',
              port: ''
            }
          );
        }
        return status.save();
      } catch (err) {
        boom.boomify(err);
      }
    });

    router.get('/status', async (req ,res) => {
      try {
        res.setHeader('Content-Type', 'application/json');
        const status = await Status.find();
        res.send(JSON.stringify(status));
      } catch (err) {
        boom.boomify(err)
      }
    });

    router.get('/logout', (req ,res) => {
      if (req.session.user && req.cookies.user_sid) {
        req.session.user = null;
        req.session.userData = null;
      }
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ logout: 'Logout success'}));
    });
    return router;
};

export {
  init
};
