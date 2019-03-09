## ln-plugin-js

#### A simple Lightning Network plugin based on JS

#### Installation

* Install node packages with `npm install`
* Install `mongodb` database for your OS

##### Running 

* Start the web-server with `npm start`
* Navigate to [http://localhost:3000](http://localhost:3000) in your browser
* Connect or Disconnect with a peer node 
* Refresh the page to see new entries from mongodb

##### Event Handling

By default the plugin only subscribes to `connect` and `disconnect` events from [c-lightning](https://github.com/ElementsProject/lightning).
These are defined in the [config.json](https://github.com/Actinium-project/ln-plugin-js/blob/master/config.json#L7) and can be expanded.
More info on events and other options can be found [here](https://lightning.readthedocs.io/PLUGINS.html#a-day-in-the-life-of-a-plugin).
This plugin can be expanded to do more than only waiting for events. 
For example, it could define methods to be registered in the `lightningd` daemon.

##### LICENSE

[MIT](https://github.com/Actinium-project/ln-plugin-js/blob/master/LICENSE)