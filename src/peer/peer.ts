import * as net from "net";
import { BroadcastManagerDelegate, BroadcastManager } from "./broadcast_manager";
import { IOtherPeer } from "common/peer_info_model";
import {TCPServerManager, TCPManagerDelegate} from "./tcp_server_manager";
import {TCPClientManager} from "./tcp_client_manager";
import {getCurrentIpAddress} from "../common/utils";

export class Peer implements BroadcastManagerDelegate, TCPManagerDelegate {

    private readonly broadcastManager: BroadcastManager;
    private readonly tcpServerManager: TCPServerManager;
    private readonly tcpClientManager: TCPClientManager;

    private readonly tcpServerPort: number;
    private otherPeers: IOtherPeer[] = [];

    constructor(tcpServerPort: number) {
        this.tcpServerPort = tcpServerPort;
        this.broadcastManager = new BroadcastManager(this, tcpServerPort);
        this.tcpServerManager = new TCPServerManager(this, tcpServerPort);
        this.tcpClientManager = new TCPClientManager();
    }

    async start() {
        await this.broadcastManager.start()

        await this.tcpServerManager.bindTcpServer();
        this.startConnectionToRandomPeer();
    }

    // - BroadcastListenerDelegate

    monitoringInfo(): any {
        return this.otherPeers;
    }

    didReceivedOtherPeer(otherPeer: IOtherPeer) {
        // Добавляем если еще нет, иначе ничего не делаем
        const index = this.otherPeers.findIndex(p => p.address == otherPeer.address && p.port == otherPeer.port);
        if (index == -1) {
            console.log(`[BROADCAST] new peer: ${otherPeer.address}:${otherPeer.port}`)
            this.otherPeers.push(otherPeer);
        }
    }

    // - TCPManagerDelegate

    tableForSending(): IOtherPeer[] {
        return this.otherPeers;
    }

    didReceivedTable(table: IOtherPeer[]): void {
        this.updateTableByReceived(table);
    }

    // - Helpers

    private async startConnectionToRandomPeer() {
        while (true) {
            await new Promise(r => setTimeout(r, 5000));
            await this.connectToRandomPeer();
        }
    }

    private async connectToRandomPeer() {
        // Подключаемся и ждем пока нам отправят таблицу, потом отправляет свою таблица в ответ
        const randomPeer = this.otherPeers[Math.floor(Math.random() * this.otherPeers.length)];

        // Если нет пиров, то ничего не делаем
        if (randomPeer == undefined) return;

        const otherPeersAndSelf  = Object.assign([], this.otherPeers);
        otherPeersAndSelf.push({
            address: getCurrentIpAddress(),
            port: this.tcpServerPort,
        });

        await this.tcpClientManager.sendTablesToTcpServer(
            randomPeer.address,
            randomPeer.port,
            otherPeersAndSelf
        );
    }

    private updateTableByReceived(table: IOtherPeer[]) {
        table.forEach(peer => {
            // Свой адрес нам там не нужен
            if (peer.address == getCurrentIpAddress()) return;

            const index = this.otherPeers.findIndex(p => p.address == peer.address && p.port == peer.port);
            if (index == -1) {
                this.otherPeers.push(peer);
            }
        });
    }
}