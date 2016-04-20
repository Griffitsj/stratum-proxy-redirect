var stratum = require('./stratumRedirect.js');

// Starts a 'stratum proxy' server on localhost:3335 that redirects all traffic to stratum.example.com:3333
// This might be useful if you are moving your stratum server to another hostname or port and don't want to lose the connections.
var s = stratum.start('SOMENAME', 3335, 'stratum.example.com', 3333);
