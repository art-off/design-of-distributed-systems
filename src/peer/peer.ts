import "dgram";
import { BroadcastListenerDelegate, BroadcastListener } from "./broadcast_listener";


export class Peer implements BroadcastListenerDelegate {

    private readonly broadcastListener: BroadcastListener;

    constructor() {
        this.broadcastListener = new BroadcastListener(this);
    }

    start() {
        this.broadcastListener.startListening();
    }

    monitoringInfo(): any {
        return [
            22,
            33,
            44
        ]
    }
}