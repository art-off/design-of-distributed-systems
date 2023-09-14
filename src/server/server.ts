import { createServer, Socket } from "net";

import { parseLogin, parseMathExpr } from "../parsing";
import { mathExprToString, sleep } from "../utils";
import { calculateMathExpr, log } from "./utils";

// Configuration parameters
var HOST = '0.0.0.0';
var PORT = 8888;

const ALLOWED_LOGINS = [
    'l0', 'l1', 'l2', 'l3', 'l4',
];

const checkLogin = (login: string) => {
    if (!ALLOWED_LOGINS.includes(login)) {
        throw new Error('invalid login')
    }
}

const handleClientData = async (sock: Socket, data: Buffer) => {
    const stringMessage = data.toString();
    try {
        const login = parseLogin(stringMessage);
        checkLogin(login);

        const expr = parseMathExpr(stringMessage);
        log(sock, `Received: ${mathExprToString(expr)}`);

        const result = calculateMathExpr(expr);
        await sleep(4); // Симуляция долних вычислений
        log(sock, `Calculated: ${result}`);

        sock.write(result.toString())
    } catch (e) {
        let message = `Error: ${e.message}`
        log(sock, message);
        sock.write(message);
    }
}

const handleClinetConnection = (sock: Socket) => {
    sock.on('data', (data) => { handleClientData(sock, data); });
}

const server = createServer(handleClinetConnection);

server.listen(PORT, HOST, () => {
    console.log('server listening on %j', server.address());
});
