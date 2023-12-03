import dgram from "dgram";
import * as process from "process";
import {getCurrentIpAddress, getUdpBroadcastAddress} from "../common/utils";
import { IOtherPeer } from "common/peer_info_model";


export interface BroadcastManagerDelegate {
    monitoringInfo(): any;
    didReceivedOtherPeer(otherPeer: IOtherPeer): void;
}

// Слушает и отправляет UDP broadcast сообщения от мониторинга и других пиров
export class BroadcastManager {

    private readonly tcpServerPort: number;
    private readonly broadcastPort: number;
    private readonly delegate: BroadcastManagerDelegate;
    private readonly socket: dgram.Socket;

    constructor(delegate: BroadcastManagerDelegate, tcpServerPort: number) {
        this.tcpServerPort = tcpServerPort;
        this.broadcastPort = Number(process.env.BROADCAST_PORT);
        this.delegate = delegate;
        this.socket = dgram.createSocket('udp4');
    }

    async start() {
        await this.bind();
        this.startListening();
        this.sendBroadcast();
    }

    private async bind(): Promise<void> {
        return new Promise<void>(resolve => {
            this.socket.bind(this.broadcastPort, () => {
                this.socket.setBroadcast(true);
                console.log(`[BROADCAST] udp broadcast listener is started on ${this.broadcastPort}`);
                resolve();
            });
        });
    }

    private startListening() {
        this.socket.on('message', (message, rinfo) => {
            // Перестраховка, чтобы не слушать свои сообщения
            if (getCurrentIpAddress() == rinfo.address) return;

            const stringMessage = message.toString();

            // Если получаем от монитора, то отправляем ему свою таблицу (для отображения в мониторинге)
            if (stringMessage == 'i_am_monitor') {
                this.socket.send(this.generateMessage(), rinfo.port, rinfo.address);
                return;
            }

            const jsonMessage = JSON.parse(stringMessage);

            // Если от другого пира, то отправляем делегату, что появился новый пир
            this.delegate.didReceivedOtherPeer({
                address: jsonMessage['address'],
                port: jsonMessage['port'],
            });
        });
    }

    // Отправляет сообщение о том, что я пир
    private sendBroadcast() {
        this.socket.send(
            JSON.stringify({
                address: getCurrentIpAddress(),
                port: this.tcpServerPort,
            }),
            this.broadcastPort,
            getUdpBroadcastAddress()
        );
    }

    // - Helpers

    private generateMessage(): string {
        return JSON.stringify({
            table: this.delegate.monitoringInfo(),
            address: getCurrentIpAddress(),
            port: this.tcpServerPort,
        });
    }
}