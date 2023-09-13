import { createServer, Socket } from "net";

import { MathOperator } from "../models";
import { mathExprToString, parseMathExpr } from "../parsing";
import { calculateMathExpr, log, sockAddress } from "./utils";

// Configuration parameters
var HOST = 'localhost';
var PORT = 1234;

const handleClinetConnection = (sock: Socket) => {
    sock.on('data', (data) => {
        const jsonString = data.toString();
        try {
            const mathExpr = parseMathExpr(jsonString);
            log(sock, `Received: ${mathExprToString(mathExpr)}`);
            const result = calculateMathExpr(mathExpr);
            log(sock, `Calculated: ${result}`);
            sock.write(result.toString())
        } catch (e) {
            let message = `Error: ${e.message}`
            log(sock, message);
            sock.write(message);
        }
    });
}

const server = createServer(handleClinetConnection);

server.listen(PORT, HOST, () => {
    console.log('server listening on %j', server.address());
});
