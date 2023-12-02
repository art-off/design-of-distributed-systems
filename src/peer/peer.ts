import "dgram";
import { MonitorListenerDelegate, MonitorListener } from "./monitor_listener";


export class Peer implements MonitorListenerDelegate {

    private readonly monitorListener: MonitorListener;

    constructor() {
        this.monitorListener = new MonitorListener(this);
    }

    start() {
        this.monitorListener.startListening();
    }

    monitoringInfo(): any {
        return [
            22,
            33,
            44
        ]
    }
}