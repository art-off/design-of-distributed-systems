import { Socket } from "net";
import { sendRandomMessage } from "send_messages";
import { BroadcastManager } from "./broadcast_manager"

export class Peer {

    // Config
    private port: number;

    // Work
    private socket: Socket;
    private serverAddresses: string[];
    private currentServerAddress: string | undefined;
    private broadcastManager: BroadcastManager

    constructor(port: number, serverAddresses: string[]) {
        this.serverAddresses = serverAddresses;
        this.port = port

        this.socket = new Socket();
        this.broadcastManager = new BroadcastManager(this.port)
    }

    start() {
        this.broadcastManager.startUpdBroadcast((message, address) => {
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
