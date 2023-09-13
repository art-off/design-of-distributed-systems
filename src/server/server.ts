import { createServer, Socket } from "net";

// Configuration parameters
var HOST = 'localhost';
var PORT = 1234;

const handleClinetConnection = (sock: Socket) => {
    var remoteAddress = sock.remoteAddress + ':' + sock.remotePort;
    console.log('new client connected: %s', remoteAddress);

    sock.on('data', (data) => {
        console.log('%s Says: %s', remoteAddress, data);
        sock.write(data);
        sock.write(' exit');
    });
    sock.on('close', () => {
        console.log('connection from %s closed', remoteAddress);
    });
    sock.on('error', (err) => {
        console.log('Connection %s error: %s', remoteAddress, err.message);
    });
}

// Create Server instance 
var server = createServer(handleClinetConnection);

server.listen(PORT, HOST, function () {
    console.log('server listening on %j', server.address());
});
