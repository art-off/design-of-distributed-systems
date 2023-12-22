import * as net from "net";
import {IOtherPeer} from "../common/peer_info_model";
import {getCurrentIpAddress} from "../common/utils";

export interface TCPManagerDelegate {
    messageForSending(): { table: IOtherPeer[], info: any };
    didReceivedMessage(message: { table: IOtherPeer[], info: any }): void;
}

export class TCPServerManager {

    private readonly tcpServerPort: number;
    private readonly delegate: TCPManagerDelegate;
    private readonly tcpServer: net.Server;

    constructor(delegate: TCPManagerDelegate, tcpServerPort: number) {
        this.tcpServerPort = tcpServerPort;
        this.delegate = delegate;
        this.tcpServer = net.createServer((socket) => {
            this.handleConnection(socket);
        });
    }

    async bindTcpServer() {
        return new Promise<void>(resolve => {
            this.tcpServer.listen(this.tcpServerPort, () => {
                console.log(`[TCP] tcp server is started on ${this.tcpServerPort}`);
                resolve();
            });
        });
    }

    private handleConnection(socket: net.Socket) {
        socket.on('data', (data) => {
            const message = JSON.parse(data.toString());
            this.delegate.didReceivedMessage(message);
            console.log(`[${getCurrentIpAddress()}] [TCP] received table: ${JSON.stringify(message)}`);
        });
    }
}
