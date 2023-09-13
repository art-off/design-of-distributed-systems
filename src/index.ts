import { parseMathExpr } from "./parsing";
import { MathOperator } from "./models";
import { randomItem } from "./utils/array";

const value = randomItem(Object.values(MathOperator))

console.log(value)