var net = require('net');
var util = require('util');
var events = require("events");

function stratumRedirect(name, listenPort, redirectHost, redirectPort) {
    events.EventEmitter.call(this);
    console.log(name + ':init');

    function emitMethod(data) {
        try {
            var jsonData = JSON.parse(data);
            if (jsonData.method) {
                this.emit(jsonData.method, jsonData);
            }
        }
        finally {
            this.emit('invalidrequest', data);
        }
    }

    net.createServer({ allowHalfOpen: false }, function (socket) {
        console.log(name + ':new');

        var serviceSocket = new net.Socket();
        serviceSocket.connect(redirectPort, redirectHost);

        // Write data to the destination host
        socket.on("data", function (data) {
            serviceSocket.write(data);
        });

        // Pass data back from the destination host
        serviceSocket.on("data", function (data) {
            console.log(name + ':data');
            socket.write(data);
        });

        socket.on("close", function (had_error) {            
            console.log(name + ':close had_error=' + had_error);
            serviceSocket.end();
        })

        serviceSocket.on("close", function (had_error) {
            socket.end();
        });

        socket.on("error", function (e) {
            console.log(name + ':warn', '[' + new Date() + '] Proxy Socket Error');
            console.log(name + ':warn', e);
        });

        serviceSocket.on("error", function (e) {
            console.log(name + ':warn', '[' + new Date() + '] Service Socket Error');
            console.log(name + ':warn', e);
        });
    }).listen(parseInt(listenPort), function () {
        console.log(name + ':listen listenPort=' + listenPort);
    });
}

util.inherits(stratumRedirect, events.EventEmitter);

module.exports = {
    start: function (name, listenPort, redirectHost, redirectPort) {
        return new stratumRedirect(name, listenPort, redirectHost, redirectPort);
    }
};