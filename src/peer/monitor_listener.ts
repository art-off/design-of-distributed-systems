import dgram from "dgram";
import * as process from "process";


export interface MonitorListenerDelegate {
    monitoringInfo(): any;
}

// Слушает UDP broadcast сообщения от мониторинга и отвечает на них
export class MonitorListener {

    private readonly port: number;
    private readonly delegate: MonitorListenerDelegate;
    private readonly socket: dgram.Socket;

    constructor(delegate: MonitorListenerDelegate) {
        this.port = Number(process.env.MONITORING_PORT);
        this.delegate = delegate;
        this.socket = dgram.createSocket('udp4');
    }

    startListening() {
        this.socket
            .on('message', (message, rinfo) => {
                if (message.toString() != 'i_am_monitor') return;
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