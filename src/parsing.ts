import { MathOperator, IMathExpr } from "./models"

const validateMathExprJson = (json: any): void => {
    const operator: MathOperator = json['operator']
    const left: number = json['left']
    const right: number = json['right']

    if (!operator) {
        throw new Error('"operator" is required')
    }
    if (!left) {
        throw new Error('"left" is required')
    }
    if (operator != MathOperator.Fact && !right) {
        throw new Error('"right" is reguired with non fact operation')
    }
}

export const parseMathExpr = (jsonString: string): IMathExpr => {
    const json = JSON.parse(jsonString);

    try {
        validateMathExprJson(json)
    } catch (e) {
        throw e
    }
    return {
        operator: json['operator'],
        left: json['left'],
        right: json['right'],
    }
}