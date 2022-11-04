import figlet from 'figlet'
import chalk from 'chalk'
import inquirer from 'inquirer'
import { openDb } from "./conectionDB.js"
import sqlite3 from "sqlite3"


function startOptions() {
    inquirer.prompt([
        {
            type: "list",
            name: "options",
            message: "Selecione abaixo a opção que deseja.",
            choices: ["Minhas senhas", "Salvar senha", "Editar senha", "Deletar senha", "Sair"]
        }
    ]).then((answers) => {
        if (answers.options === "Minhas senhas") {
            showPasswords()
        } else if (answers.options === "Salvar senha") {
            prepareInsert()
        } else if (answers.options === "Editar senha") {
            editData()
        } else if (answers.options === "Deletar senha") {
            deleteData()
        } else {
            console.log(chalk.bgCyan("Obrigado por usar o PSWREC!"))
            process.exit()
        }
    }).catch((err) => console.log(err))
}

function presentation() {
    console.log(figlet.textSync('PSWREC', {
        font: '3-D',
        horizontalLayout: 'default',
        verticalLayout: 'default',
        width: 100,
        whitespaceBreak: true
    }))
}


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
            console.table(rows)
        }
    });

    // close the database connection
    db.close()
    setTimeout(startOptions, 1000)
}


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

/* UPDATE PASSWORDS set Password="Alexandre" WHERE Reference = "senhas"; */
function editData() {
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

function deleteData() {
    let optionsRef = []
    openDb()
    const sqlite = sqlite3.verbose()

    // open the database
    let db = new sqlite.Database('./pswrec.db')
    let sql = `SELECT Reference FROM PASSWORDS;`
    let sqlDel

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
                name: "refDelete",
                message: "Selecione senha que deseja deletar.",
                choices: optionsRef
            }
        ]).then((answers) => {
            sqlDel = `DELETE FROM PASSWORDS WHERE Reference='${answers.refDelete}';`
            db.run(sqlDel, [], (err) => {
                if (err) {
                    throw err;
                }
                console.log(chalk.bgBlue("Dados apagados com sucesso!"))

                // close the database connection
                db.close()
                setTimeout(startOptions, 1000)
            });
        }).catch((err) => console.log(err))
    });

}

// Start System
presentation()
startOptions()