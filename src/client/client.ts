import { Socket } from "net";
import { randomItem } from "../utils";
import { IMathExpr, MathOperator } from "../models";
import { randomInt } from "crypto";
import { mathExprToString } from "../utils";
import { generateRandomLogin, generateRandomMathExpr } from "./utils";

const HOST = 'localhost';
const PORT = 1234;

const client = new Socket();

client.on('data', (data) => {
    console.log(`Received: ${data.toString()}`)
});

client.connect(PORT, HOST, function () {
    console.log(`Client connected to : ${HOST}:${PORT}`)
    sendRandomMessage(client)
});

// MARK: - helpers
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