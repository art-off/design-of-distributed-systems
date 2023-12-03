import * as net from "net";
import {getCurrentIpAddress} from "../common/utils";

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

    sendTablesToTcpServer(address: string, port: number, table: any): Promise<void> {
        return new Promise((resolve, reject) => {
            this.tcpClient.destroy();
            this.onError = (err) => {
                console.log(`[${getCurrentIpAddress()}] [TCP] error: ${err}`);
                reject(err);
            };

            this.tcpClient.connect(port, address, () => {
                console.log(`[${getCurrentIpAddress()}] [TCP] connected to ${address}:${port}`);
                const message = JSON.stringify(table);
                this.tcpClient.write(message);
                console.log(`[${getCurrentIpAddress()}] [TCP] sent table: ${message}`);
                resolve();
            });
        });
    }
}