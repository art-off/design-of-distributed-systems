import * as net from "net";

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

    async getTableFromTcpServer(address: string, port: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.onData = (data) => {
                resolve(JSON.parse(data.toString()));
            };
            this.onError = (err) => {
                console.log(`[TCP] error: ${err}`);
                reject(err);
            };

            this.tcpClient.connect(port, address, () => {
                console.log(`[TCP] connected to ${address}:${port}`);
            });
        });
    }
}