import dgram from "dgram";
import * as process from "process";
import {getCurrentIpAddress, getUdpBroadcastAddress} from "../common/utils";
import {IOtherPeer} from "./peer";


export interface BroadcastManagerDelegate {
    monitoringInfo(): any;
    didReceivedOtherPeer(otherPeer: IOtherPeer): void;
}

// Слушает и отправляет UDP broadcast сообщения от мониторинга и других пиров
export class BroadcastManager {

    private readonly port: number;
    private readonly delegate: BroadcastManagerDelegate;
    private readonly socket: dgram.Socket;

    constructor(delegate: BroadcastManagerDelegate) {
        this.port = Number(process.env.BROADCAST_PORT);
        this.delegate = delegate;
        this.socket = dgram.createSocket('udp4');
    }

    async bind(): Promise<void> {
        return new Promise<void>(resolve => {
            this.socket
                .bind(this.port, () => {
                    this.socket.setBroadcast(true);
                    console.log(`[BROADCAST] udp broadcast listener is started on ${this.port}`);
                    resolve();
                });
        });
    }

    startListening() {
        this.socket.on('message', (message, rinfo) => {
            switch (message.toString()) {
                case 'i_am_monitor':
                    // Если получаем от монитора, то отправляем ему свою таблицу (для отображения в мониторинге)
                    this.socket.send(this.generateMessage(), rinfo.port, rinfo.address);
                    break;
                case 'i_am_peer':
                    // Если получаем от другого пира, то отправляем делегату, что появился новый пир
                    if (getCurrentIpAddress() == rinfo.address) return;
                    this.delegate.didReceivedOtherPeer({
                        address: rinfo.address,
                        port: rinfo.port,
                    });
                    break;
            }
        });
    }

    // Отправляет сообщение о том, что я пир
    sendBroadcast() {
        this.socket.send('i_am_peer', this.port, getUdpBroadcastAddress());
    }

    // - Helpers

    private generateMessage(): string {
        return JSON.stringify({
            table: this.delegate.monitoringInfo(),
        });
    }
}