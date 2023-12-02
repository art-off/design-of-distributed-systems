import dgram from "dgram";
import {getCurrentIpAddress} from "./utils";


export interface MonitorListenerDelegate {
    monitoringInfo(): any;
}

export class MonitorListener {

    private readonly port: number;
    private readonly delegate: MonitorListenerDelegate;
    private readonly socket: dgram.Socket;

    constructor(delegate: MonitorListenerDelegate) {
        this.port = 4562;
        this.delegate = delegate;
        this.socket = dgram.createSocket('udp4');
    }

    startListening() {
        this.socket
            .on('message', (message, rinfo) => {
                if (message.toString() != 'i_am_monitor') return;
                this.socket.send(`${getCurrentIpAddress()}`, rinfo.port, rinfo.address);
            })
            .bind(this.port, () => {
                console.log(`[BROADCAST] udp broadcast listener is started on ${this.port}`);
            });
    }
}