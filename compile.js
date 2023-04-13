import path from "path";
import fs from "fs";
import solc from "solc";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const lotteryPath = path.resolve(__dirname, "contracts", "lottery.sol");
const source = fs.readFileSync(lotteryPath, "utf-8");

export default solc.compile(source, 1).contracts[":Lottery"];
