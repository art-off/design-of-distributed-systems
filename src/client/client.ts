import { Socket } from "net";
import { randomItem } from "../utils/array";
import { IMathExpr, MathOperator } from "../models";
import { randomInt } from "crypto";
import { mathExprToString } from "../parsing";
import { generateRandomMathExpr } from "./utils";

const HOST = 'localhost';
const PORT = 1234;

const client = new Socket();

client.on('data', (data) => {
    console.log(`Received: ${data.toString()}`)
});

// Add a 'close' event handler for the client socket
client.on('close', function () {
    console.log('Client closed');
});

client.on('error', function (err) {
    console.error(err);
});

client.connect(PORT, HOST, function () {
    console.log(`Client connected to : ${HOST}:${PORT}`)
    sendRandomMathExprMessage(client)
});

// MARK: - helpers
const sendRandomMathExprMessage = (sock: Socket) => {
    const mathExpr = generateRandomMathExpr();
    const jsonString = JSON.stringify(mathExpr)
    sock.write(jsonString)
    console.log(`Send: ${mathExprToString(mathExpr)}`)
}