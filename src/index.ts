import { parseMathExpr } from "./parsing";
import { MathOperator } from "./models";
import { randomItem } from "./utils";

const value = randomItem(Object.values(MathOperator))

console.log(value)