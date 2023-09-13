import { randomInt } from "crypto"
import { IMathExpr, MathOperator } from "../models"
import { randomItem } from "../utils/array"

export const generateRandomMathExpr = (): IMathExpr => {
    return {
        operator: randomItem(Object.values(MathOperator)),
        left: randomInt(0, 100),
        right: (randomInt(0, 2) == 0) ? randomInt(0, 100) : null,
    }
}