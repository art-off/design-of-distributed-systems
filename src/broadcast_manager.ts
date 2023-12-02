import {createSocket, Socket} from "dgram";
import {getUdpBroadcastAddress} from "./utils";


export class BroadcastManager {

    // Config
    private readonly port: number;
    private readonly udpAddress: string | undefined;

    // Work
    private socket: Socket

    constructor(port: number, udpAddress: string = getUdpBroadcastAddress()) {
        this.port = port
        this.udpAddress = udpAddress
    }

    startUpdBroadcast(onUpdBroadcastMessage: (message: Buffer, address: string) => void) {
        console.log(`[BROADCAST] udp broadcast address is ${this.udpAddress}`)

        this.socket = createSocket('udp4');
        this.socket
            .on('message', (message, rinfo) => {
                onUpdBroadcastMessage(message, rinfo.address)
            })
            .bind(() => {
                this.socket.setBroadcast(true);
                console.log(`[BROADCAST] udp broadcast client is started`)
                this.socket.send('i_am_client', this.port, this.udpAddress)
            })
    }
}