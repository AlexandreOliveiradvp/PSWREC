import chalk from 'chalk'
import sqlite3 from 'sqlite3'

function createDatabase() {
    let newdb = new sqlite3.Database('pswrec.db', (err) => {
        if (err) {
            console.log("Getting error " + err)
            exit(1)
        }
        createDatabase(newdb);
        newdb.exec("CREATE TABLE PASSWORDS ( id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,Reference TEXT NOT NULL,Password TEXT NOT NULL)")
        console.log(chalk.bgGreen("Banco de dados criado com sucesso!\nExecute o aplicativo novamente."))
        process.exit()
    });
}

export default createDatabase