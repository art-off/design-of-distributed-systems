export enum MathOperator {
    Add = "+",
    Sub = "-",
    Mul = "*",
    Div = "/",
    Fact = "!",
}

export interface IMathExpr {
    left: number
    right?: number
    operator: MathOperator
}