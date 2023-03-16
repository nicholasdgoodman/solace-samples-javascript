const solace = require('solclientjs/lib-browser/solclient-debug');

if(window.solace === undefined) {
  Object.assign(window, { solace });
}