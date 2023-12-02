import { networkInterfaces } from "os";

export const getCurrentIpAddress = (): string | undefined => {
    const ni = networkInterfaces();
    const activeInvetrace = ni['eth0'] || ni[Object.keys(ni)[0]];

    if (activeInvetrace && activeInvetrace.length > 0) {
        return activeInvetrace[0].address;
    } else {
        return undefined;
    }
}

export const getUdpBroadcastAddress = (): string | undefined => {
    const currIp = getCurrentIpAddress();

    if (!currIp) { return undefined; }

    let arr = currIp.split('.');
    arr[2] = '255'
    arr[3] = '255'

    return arr.join('.')
}