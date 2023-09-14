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