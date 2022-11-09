import { openDb } from "../services/conectionDB.js"
import sqlite3 from "sqlite3"
import startOptions from "./startOptions.js"
import decrypt from "../services/decrypting.js";
import chalk from "chalk";

function showPasswords() {
    openDb();
    const sqlite = sqlite3.verbose()

    // open the database
    let db = new sqlite.Database('./pswrec.db')
    let sql = `SELECT Reference, Password FROM PASSWORDS;`

    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err
        }
        if (rows.length == 0) {
            console.log(chalk.bgRed("Você ainda não possui senhas salvas."))
        } else {
            for (let i = 0; i < rows.length; i++) {
                rows[i].Password = decrypt(rows[i].Password)
            }
            console.table(rows)
        }
    });

    // close the database connection
    db.close()
    setTimeout(startOptions, 1000)
}

export default showPasswords