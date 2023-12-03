import * as net from "net";
import {IOtherPeer} from "../common/peer_info_model";

export interface TCPManagerDelegate {
    tableForSending(): IOtherPeer[];
    didReceivedTable(table: IOtherPeer[]): void;
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
        const message = JSON.stringify(this.delegate.tableForSending());
        socket.write(message);
        socket.destroy()
        console.log(`[TCP] sent table: ${message}`);
    }
}