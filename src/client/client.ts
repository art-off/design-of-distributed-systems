import { Socket } from "net";
import { mathExprToString, startUdpBroadcastOnUdpAddress } from "../utils";
import { generateRandomLogin, generateRandomMathExpr } from "./utils";
import { randomInt } from "crypto";

const PORT = 8888;

var currServerAddress: string | undefined = undefined;
var SERVER_ADDRESSES = [];
const addServerAddress = (address: string) => {
    if (SERVER_ADDRESSES.includes(address)) { return; }
    SERVER_ADDRESSES.push(address);
};

const client = new Socket();

const connectClient = (serverAddress: string) => {
    currServerAddress = serverAddress;
    client.connect(PORT, serverAddress, () => {
        console.log(`Client connected to : ${serverAddress}:${PORT}`);
        startSendingMessages(client);
    });
}

const onUpdBroadcastMessage = (message: Buffer, address: string) => {
    if (message.toString() != 'i_am_server') return;

    console.log(`[BROADCAST] server on ${address}`);
    addServerAddress(address);

    if (!currServerAddress) {
        connectClient(address);
    }
};

const main = async () => {
    startUdpBroadcastOnUdpAddress(PORT, onUpdBroadcastMessage)
};

main()

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