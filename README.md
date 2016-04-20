stratum-proxy-redirect
======================

Simple proxy server that can redirect all stratum traffic from one port to another host:port

Example Code:

	// Starts a 'stratum proxy' server on localhost:3335 that redirects all traffic to stratum.example.com:3333
	var stratum = require('./stratumRedirect.js');
	var s = stratum.start('SOMENAME', 3335, 'stratum.example.com', 3333);