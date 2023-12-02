import { networkInterfaces } from "os";

import { IMathExpr, MathOperator } from "./models";

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