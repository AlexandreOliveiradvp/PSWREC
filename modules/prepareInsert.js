import inquirer from "inquirer"
import { openDb } from "../services/conectionDB.js"
import sqlite3 from "sqlite3"
import chalk from 'chalk'
import startOptions from "./startOptions.js"

function prepareInsert() {
    // Reference and password variables 
    let reference
    let password
    inquirer.prompt([
        {
            name: "recRef",
            message: "Digite a referência da senha que deseja salvar."
        }
    ]).then((answers) => {
        if (answers.recRef === "") {
            console.log("Digite uma referência válida.")
            questionPassword()
        } else {
            reference = answers.recRef
            inquirer.prompt([
                {
                    name: "recPsw",
                    message: "Digite a senha que deseja salvar."
                }
            ]).then((answers) => {
                password = answers.recPsw
                insertData(reference, password)
            }).catch((err) => console.log(err))
        }
    }).catch((err) => console.log(err))

}

function insertData(ref, psw) {
    openDb();

    const sqlite = sqlite3.verbose();

    // open the database
    let db = new sqlite.Database('./pswrec.db');
    let sql = `INSERT INTO PASSWORDS (Reference, Password) VALUES ('${ref}','${psw}');`;

    db.run(sql, [], (err) => {
        if (err) {
            throw err;
        }
    });

    // close the database connection
    db.close();
    console.log(chalk.bgBlue("Dados salvos com sucesso!"))
    setTimeout(startOptions, 1000)
}

export default prepareInsert