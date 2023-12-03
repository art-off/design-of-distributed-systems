import dgram from "dgram";
import {getUdpBroadcastAddress} from "../common/utils";
import {IPeerInfo} from "../common/peer_info_model";
import * as process from "process";

export class Monitor {

    private socket: dgram.Socket;
    private peersInfo: IPeerInfo[] = [];

    async getPeersInfo(): Promise<any[]> {
        this.peersInfo = []
        this.checkPeers();
        // Ждем пока все ответят)
        await new Promise(r => setTimeout(r, 2000));
        return this.peersInfo;
    }

    private checkPeers() {
        this.setupSocketIfNeeded(() => {
            this.socket.send('i_am_monitor', Number(process.env.BROADCAST_PORT), getUdpBroadcastAddress());
        });
    }

    private setupSocketIfNeeded(completion: () => void) {
        if (this.socket != undefined) {
            return completion()
        }
        this.socket = dgram.createSocket('udp4')
            .on('message', (message, rinfo) => {
                this.peersInfo.push({
                    address: rinfo.address,
                    port: rinfo.port,
                    table: JSON.parse(message.toString())['table'],
                });
                console.log(message.toString(), rinfo)
            })
            .bind(() => {
                this.socket.setBroadcast(true)
                console.log(`[BROADCAST] sending upd broadcast`)
                completion()
            });
    }
}