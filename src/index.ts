import { parseMathExpr } from "./parsing";

const expr = parseMathExpr('{"operator": "+", "left": 4, "right": 3}')

console.log(expr)