import presentation from "./modules/presentation.js";
import startOptions from "./modules/startOptions.js";
import * as fs from "node:fs";
import createDatabase from "./services/creatingDb.js";

const checkBd = fs.existsSync("./pswrec.db");
if (checkBd == false) {
  createDatabase();
} else {
  // Start System
  presentation();
  startOptions();
}
