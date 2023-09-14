import { Socket } from "net";
import { randomItem, sleep } from "../utils";
import { IMathExpr, MathOperator } from "../models";
import { randomInt } from "crypto";
import { mathExprToString } from "../utils";
import { generateRandomLogin, generateRandomMathExpr } from "./utils";

const HOST = 'server';
const PORT = 8888;

const client = new Socket();

client.connect(PORT, HOST, function () {
    console.log(`Client connected to : ${HOST}:${PORT}`)
    startSendingMessages(client);
});

// MARK: - helpers
const startSendingMessages = async (sock: Socket) => {
    while (true) {
        await sendRandomMessage(sock);
    }
}

const sendRandomMessage = async (sock: Socket) => {
    const login = generateRandomLogin();
    const mathExpr = generateRandomMathExpr();

    const jsonMessage = {
        login: login,
        expr: mathExpr,
    }

    const stringMessage = JSON.stringify(jsonMessage)

    const response = await sendAndGetResponse(sock, stringMessage);
    console.log(`Sended: ${mathExprToString(mathExpr)}, login: ${login}; Received: ${response.toString()}`)
}

const sendAndGetResponse = async (sock: Socket, message: string): Promise<Buffer> => {
    return new Promise((resosle, reject) => {
        sock.once('data', resosle);
        sock.write(message);
    });
}