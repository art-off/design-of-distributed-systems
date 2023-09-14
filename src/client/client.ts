import { Socket } from "net";
import { randomItem, sleep } from "../utils";
import { IMathExpr, MathOperator } from "../models";
import { randomInt } from "crypto";
import { mathExprToString } from "../utils";
import { generateRandomLogin, generateRandomMathExpr } from "./utils";

const HOST = 'server';
const PORT = 8888;

const client = new Socket();

client.on('data', (data) => {
    console.log(`Received: ${data.toString()}`)
});

client.connect(PORT, HOST, function () {
    console.log(`Client connected to : ${HOST}:${PORT}`)
    startSendingMessages(client);
});

// MARK: - helpers
const startSendingMessages = async (sock: Socket) => {
    while (true) {
        console.log('--')
        sendRandomMessage(sock);
        await sleep(1)
    }
}

const sendRandomMessage = (sock: Socket) => {
    const login = generateRandomLogin();
    const mathExpr = generateRandomMathExpr();

    const jsonMessage = {
        login: login,
        expr: mathExpr,
    }

    const stringMessage = JSON.stringify(jsonMessage)
    sock.write(stringMessage)

    console.log(`Send: ${mathExprToString(mathExpr)}, login: ${login}`)
}