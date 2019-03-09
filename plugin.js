#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const winston = require('winston');
const split = require('split');
const axios = require('axios');
const config = require('./config.json');

let lnLogger = undefined;
let useLogger = config.useLogger;
let useWebServer = config.useWebServer;
let isRunning = false;
let inputLine = "";
const errorLog = "error.log";
const combinedLog = "combined.log";
const serverUrl = config.serverProtocol + "://" + config.serverName + ":" + config.serverPort;
axios.defaults.headers.post['Content-Type'] = 'application/json';

/**
 * JSON with selected subscriptions
 * Will be used to asnwer LN's 'getmanifest' query
 */
const manifestJson = {
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "options": [],
    "rpcmethods": [],
    "subscriptions": config.subscriptions
  }
};

/**
 * Initialize Plugin logger 
 * Do not use stdout for anything besides communication with LN!
 */ 
function initLogger() {
  try { 
    fs.unlinkSync(errorLog);
    fs.unlinkSync(combinedLog); 
  }
  catch (ex) { }

  lnLogger = winston.createLogger({
    level: 'info',
    format: winston.format.simple(),
    transports: [
      new winston.transports.File({ filename: 'error.log', level: 'error', options: { flags: 'w+' } }),
      new winston.transports.File({ filename: 'combined.log', options: { flags: 'w+' } })
    ]
  });
  hasLogger = true;
}
/**
 * Wrap local logging and POST calls 
 * @param {*} severity 
 * @param {*} message 
 */
function log(severity, message) {
    if (useLogger) {
      lnLogger.log({
        level: severity,
        message: message
      });
    }
    if (useWebServer) {
      sendToServer(message);
    }
}
/**
 * Send subscription data to server
 * @param {*} message 
 */
function sendToServer(message) {
  axios.post(serverUrl + '/api/update', message)
  .then((res) => {
    if (useLogger) {
      lnLogger.log({
        level: 'info',
        message: 'Status Code' + res.statusCode + ', result: ' + res
      });
    }
  })
  .catch((error) => {
    if (useLogger) {
      lnLogger.log({
        level: 'error',
        message: error
      });
    }
  });
}
/**
 * Read LN queries from stdin 
 * @param {*} line 
 */
function processLine (line) {
  inputLine += line;
  try
  {
    const json = JSON.parse(inputLine);
    inputLine = "";
    if (json["method"] == 'init') {
      process.stdout.write(JSON.parse('{}'));
      log('info', 'init call answered');
    } else if (json["method"] == 'getmanifest') {
      manifestJson.id = json.id;
      process.stdout.write(JSON.stringify(manifestJson));
      log('info', JSON.stringify(manifestJson));
    } else {
      log('info', JSON.stringify(json));
    }
  }
  catch(e){
  }
}
/**
 * Initialize Plugin
 */
function initPlugin() {
  process.stdin.pipe(split()).on('data', processLine);
};

if (useLogger) {
  initLogger();
}

initPlugin();