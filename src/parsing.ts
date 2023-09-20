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
    if (operator != MathOperator.Fact && (right == undefined || right == null)) {
        throw new Error('"right" is reguired with non fact operator')
    }
}

export const parseLogin = (stringMessage: string): string => {
    const json = JSON.parse(stringMessage);

    const login = json['login']
    if (!login) {
        throw new Error('"login" is required')
    }
    return login
}

export const parseStop = (stringMessage: string): boolean => {
    const json = JSON.parse(stringMessage);
    return json['stop'] || false
}

export const parseMathExpr = (stringMessage: string): IMathExpr => {
    const json = JSON.parse(stringMessage);

    const mathExprJson = json['expr']

    if (!mathExprJson) {
        throw new Error('"expr" is required')
    }

    try {
        validateMathExprJson(mathExprJson)
    } catch (e) {
        throw e
    }

    return {
        operator: mathExprJson['operator'],
        left: mathExprJson['left'],
        right: mathExprJson['right'],
    }
}