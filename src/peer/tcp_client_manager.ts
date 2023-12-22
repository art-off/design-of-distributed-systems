import * as net from "net";
import {getCurrentIpAddress} from "../common/utils";
import {IOtherPeer} from "../common/peer_info_model";

export class TCPClientManager {

    private readonly tcpClient: net.Socket;

    private onData: (data: any) => void;
    private onError: (err: any) => void;

    constructor() {
        this.tcpClient = new net.Socket();
        this.tcpClient.on('data', (data) => {
            this.onData(data);
        });
        this.tcpClient.on('error', (err) => {
            this.onError(err);
        });
    }

    async shareTablesWithTcpServer(address: string, port: number, message: any): Promise<void> {
        return new Promise((resolve, reject) => {
            this.tcpClient.destroy();
            this.onError = (err) => {
                console.log(`[${getCurrentIpAddress()}] [TCP] error: ${err}`);
                reject(err);
            };

            this.tcpClient.connect(port, address, () => {
                console.log(`[${getCurrentIpAddress()}] [TCP] connected to ${address}:${port}`);
                const m = JSON.stringify(message);
                this.tcpClient.write(m);
                console.log(`[${getCurrentIpAddress()}] [TCP] sent message: ${m}`);
                resolve();
            });
        });
    }
}