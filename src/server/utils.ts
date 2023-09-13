import { Socket } from "net";
import { IMathExpr, MathOperator } from "../models";
import { mathExprToString } from "../utils";

const factorialize = (num: number): number => {
    var result = num;
    if (num === 0 || num === 1)
        return 1;
    while (num > 1) {
        num--;
        result *= num;
    }
    return result;
}

export const calculateMathExpr = (expr: IMathExpr): number => {
    if (expr.operator == MathOperator.Fact) {
        return factorialize(expr.left);
    }
    return eval(mathExprToString(expr));
}

export const sockAddress = (sock: Socket): string => {
    return sock.remoteAddress + ':' + sock.remotePort
}

export const log = (sock: Socket, message: string) => {
    console.log(`[from ${sockAddress(sock)}] ${message}`)
}