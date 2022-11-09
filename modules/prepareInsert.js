import inquirer from "inquirer";
import { openDb } from "../services/conectionDB.js";
import sqlite3 from "sqlite3";
import chalk from "chalk";
import startOptions from "./startOptions.js";
import encrypt from "../services/crypting.js";

function prepareInsert() {
  // Reference and password variables
  let reference;
  let password;
  inquirer
    .prompt([
      {
        name: "recRef",
        message: "Digite a referência da senha que deseja salvar.",
      },
    ])
    .then((answers) => {
      if (answers.recRef === "") {
        console.log(chalk.bgRed("Digite uma referência válida."));
        prepareInsert();
      } else {
        reference = answers.recRef;
        inquirer
          .prompt([
            {
              name: "recPsw",
              message: "Digite a senha que deseja salvar.",
            },
          ])
          .then((answers) => {
            if (answers.recPsw === "") {
              console.log(chalk.bgRed("Digite uma senha válida!"));
              prepareInsert();
            } else {
              password = answers.recPsw;
              insertData(reference, password);
            }
          })
          .catch((err) => console.log(err));
      }
    })
    .catch((err) => console.log(err));
}

function insertData(ref, psw) {
  let pswEncrypted = encrypt(psw);
  openDb();
  const sqlite = sqlite3.verbose();

  // open database
  let db = new sqlite.Database("./pswrec.db");
  let sql = `INSERT INTO PASSWORDS (Reference, Password) VALUES ('${ref}','${pswEncrypted}');`;

  db.run(sql, [], (err) => {
    if (err) {
      throw err;
    }
  });

  // close database connection
  db.close();
  console.log(chalk.bgBlue("Dados salvos com sucesso!"));
  setTimeout(startOptions, 1000);
}

export default prepareInsert;
