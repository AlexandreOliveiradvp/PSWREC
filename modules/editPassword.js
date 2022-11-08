import inquirer from "inquirer"
import { openDb } from "../services/conectionDB.js"
import sqlite3 from "sqlite3"
import chalk from 'chalk'
import startOptions from "./startOptions.js"

function editPassword() {
    let optionsRef = []
    let reference
    openDb()
    const sqlite = sqlite3.verbose()

    // open the database
    let db = new sqlite.Database('./pswrec.db')
    let sql = `SELECT Reference FROM PASSWORDS;`
    let sqlUpd

    db.all(sql, [], (err, rows) => {
        if (err) {
            throw err
        }
        // building array options
        for (let i = 0; i < rows.length; i++) {
            optionsRef.push(rows[i].Reference)
        }
        inquirer.prompt([
            {
                type: "list",
                name: "refEdit",
                message: "Selecione senha que deseja editar.",
                choices: optionsRef
            }
        ]).then((answers) => {
            reference = answers.refEdit
            inquirer.prompt([
                {
                    name: "passEdit",
                    message: "Digite a nova senha.",
                }
            ]).then((answers) => {
                if (answers.passEdit === "") {
                    console.log(chalk.bgRed("Digite uma senha válida!"))
                    editData()
                } else {
                    sqlUpd = `UPDATE PASSWORDS set Password = '${answers.passEdit}' WHERE Reference ='${reference}';`
                    db.run(sqlUpd, [], (err) => {
                        if (err) {
                            throw err;
                        }
                        console.log(chalk.bgBlue("Dados salvos com sucesso!"))

                        // close the database connection
                        db.close()
                        setTimeout(startOptions, 1000)
                    });
                }
            }).catch((err) => console.log(err))

        }).catch((err) => console.log(err))
    });
}

export default editPassword