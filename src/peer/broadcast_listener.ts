import dgram from "dgram";
import * as process from "process";


export interface BroadcastListenerDelegate {
    monitoringInfo(): any;
}

// Слушает UDP broadcast сообщения от мониторинга и других пиров
export class BroadcastListener {

    private readonly port: number;
    private readonly delegate: BroadcastListenerDelegate;
    private readonly socket: dgram.Socket;

    constructor(delegate: BroadcastListenerDelegate) {
        this.port = Number(process.env.BROADCAST_PORT);
        this.delegate = delegate;
        this.socket = dgram.createSocket('udp4');
    }

    startListening() {
        this.socket
            .on('message', (message, rinfo) => {
                this.socket.send(this.generateMessage(), rinfo.port, rinfo.address);
            })
            .bind(this.port, () => {
                console.log(`[BROADCAST] udp broadcast listener is started on ${this.port}`);
            });
    }

    // - Helpers

    private generateMessage(): string {
        return JSON.stringify({
            table: this.delegate.monitoringInfo(),
        });
    }
}