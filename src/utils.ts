import { networkInterfaces } from "os";

import { IMathExpr, MathOperator } from "./models";
import { createSocket } from "dgram";

export const randomItem = <T>(items: T[]): T => {
    return items[Math.floor(Math.random() * items.length)];
}

export const mathExprToString = (expr: IMathExpr): string => {
    if (expr.operator == MathOperator.Fact) {
        return `${expr.left}${expr.operator}`;
    }
    return `${expr.left} ${expr.operator} ${expr.right}`
}

export const sleep = async (seconds: number) => {
    await new Promise(r => setTimeout(r, seconds * 1000))
}

export const getCurrentIpAddress = (): string | undefined => {
    const ni = networkInterfaces();
    const activeInvetrace = ni['Ethernet'] || ni['Wi-Fi'] || ni[Object.keys(ni)[0]];

    if (activeInvetrace && activeInvetrace.length > 0) {
        return activeInvetrace[0].address;
    } else {
        return undefined;
    }
}

export const getUdpBroadcastAddress = (): string | undefined => {
    // Если отправлять на "127.0.0.255", то не прилетает в другие контейнеры. Что странно. Так что будем пулить в весь интернет.
    return '255.255.255.255';

    const currIp = getCurrentIpAddress();

    if (!currIp) { return undefined; }

    let arr = currIp.split('.');
    arr[3] = '255'

    return arr.join('.')
}

const startUpdBroadcast = async (address: string, port: number, onUpdBroadcastMessage: (message: Buffer, address: string) => void) => {
    const udpBroadcastSocket = createSocket('udp4');
    udpBroadcastSocket.on('message', (message, rinfo) => {
        onUpdBroadcastMessage(message, rinfo.address)
    });
    udpBroadcastSocket.bind(() => {
        udpBroadcastSocket.setBroadcast(true);
        console.log(`[BROADCAST] udp broadcast client is started`)
        udpBroadcastSocket.send('i_am_client', port, address)
    });
}

export const startUdpBroadcastOnUdpAddress = (port: number, onUpdBroadcastMessage: (message: Buffer, address: string) => void) => {
    const udpBroadcastAddress = getUdpBroadcastAddress();
    console.log(`[BROADCAST] udp broadcast address is ${udpBroadcastAddress}`)
    startUpdBroadcast(udpBroadcastAddress, port, onUpdBroadcastMessage);
}