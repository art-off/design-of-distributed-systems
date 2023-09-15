import { Socket } from "net";
import { mathExprToString } from "../utils";
import { generateRandomLogin, generateRandomMathExpr } from "./utils";
import { randomInt } from "crypto";

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

    if (randomInt(0, 9) == 0) {
        await sendStopCommand(sock, login);
    } else {
        await sendMathExprCommand(sock, login);
    }
}

const sendMathExprCommand = async (sock: Socket, login: string) => {
    const mathExpr = generateRandomMathExpr();

    const jsonMessage = {
        login: login,
        expr: mathExpr,
    }

    const stringMessage = JSON.stringify(jsonMessage)

    const response = await sendAndGetResponse(sock, stringMessage);
    console.log(`Sended: ${mathExprToString(mathExpr)}, login: ${login}; Received: ${response.toString()}`)
}

const sendStopCommand = async (sock: Socket, login: string) => {
    const jsonMessage = {
        login: login,
        stop: true,
    }

    const stringMessage = JSON.stringify(jsonMessage);

    sock.write(stringMessage);
    console.log(`Sended stop command, login: ${login}`)
}

const sendAndGetResponse = async (sock: Socket, message: string): Promise<Buffer> => {
    return new Promise((resosle, reject) => {
        sock.once('data', resosle);
        sock.write(message);
    });
}