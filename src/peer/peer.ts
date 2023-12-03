import "dgram";
import { BroadcastManagerDelegate, BroadcastManager } from "./broadcast_manager";

export interface IOtherPeer {
    address: string;
    port: number;
}

export class Peer implements BroadcastManagerDelegate {

    private readonly broadcastManager: BroadcastManager;
    private otherPeers: IOtherPeer[] = [];

    constructor() {
        this.broadcastManager = new BroadcastManager(this);
    }

    async start() {
        await this.broadcastManager.bind();
        this.broadcastManager.startListening();
        await this.broadcastManager.sendBroadcast();
    }

    // - BroadcastListenerDelegate
    monitoringInfo(): any {
        return this.otherPeers;
    }

    didReceivedOtherPeer(otherPeer: IOtherPeer) {
        // Добавляем если еще нет, иначе ничего не делаем
        const index = this.otherPeers.findIndex(p => p.address === otherPeer.address && p.port === otherPeer.port);
        if (index == -1) {
            this.otherPeers.push(otherPeer);
        }
    }
}