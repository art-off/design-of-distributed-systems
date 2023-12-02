import dgram from "dgram";
import {getUdpBroadcastAddress} from "../utils";

export class Monitor {

    private readonly socket: dgram.Socket;

    constructor() {
        this.socket = dgram.createSocket('udp4');
    }

    checkPeers() {
        this.socket
            .on('message', (message, rinfo) => {
                console.log(message.toString(), rinfo)
            })
            .bind(() => {
                this.socket.setBroadcast(true)
                console.log(`[BROADCAST] sending upd broadcast`)
                this.socket.send('i_am_monitor', 4562, getUdpBroadcastAddress());
            });
    }
}