import { Socket } from "net";
import { sendRandomMessage } from "send_messages";
import { startUdpBroadcastOnUdpAddress } from "utils";

export class Peer {

    // Config
    private port: number;

    // Work
    private socket: Socket;
    private serverAddresses: string[];
    private currentServerAddress: string | undefined;

    constructor(port: number, serverAddresses: string[]) {
        this.socket = new Socket();
        this.serverAddresses = serverAddresses;
        this.port = port
    }

    start() {
        startUdpBroadcastOnUdpAddress(this.port, (message, address) => {
            this.onUpdBroadcastMessage(message, address)
        })
    }

    onUpdBroadcastMessage(message: Buffer, address: string) {
        if (message.toString() != 'i_am_server') return;

        console.log(`[BROADCAST] server on ${address}`);

        if (this.serverAddresses.includes(address)) return;
        this.serverAddresses.push(address);

        if (!this.currentServerAddress) {
            this.connectClient(address);
        }
    };

    connectClient(serverAddress: string) {
        this.currentServerAddress = serverAddress;
        this.socket.connect(this.port, serverAddress, () => {
            console.log(`Client connected to : ${serverAddress}:${this.port}`);
            this.startSendingMessages();
        });
    }

    async startSendingMessages() {
        while (true) {
            await sendRandomMessage(this.socket);
        }
    }
}
