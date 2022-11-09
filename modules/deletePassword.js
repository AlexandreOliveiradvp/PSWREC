import inquirer from "inquirer";
import { openDb } from "../services/conectionDB.js";
import sqlite3 from "sqlite3";
import chalk from "chalk";
import startOptions from "./startOptions.js";

function deletePassword() {
  let optionsRef = [];
  openDb();
  const sqlite = sqlite3.verbose();

  // open database
  let db = new sqlite.Database("./pswrec.db");
  let sql = `SELECT Reference FROM PASSWORDS;`;
  let sqlDel;

  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    // building array options
    for (let i = 0; i < rows.length; i++) {
      optionsRef.push(rows[i].Reference);
    }
    inquirer
      .prompt([
        {
          type: "list",
          name: "refDelete",
          message: "Selecione senha que deseja deletar.",
          choices: optionsRef,
        },
      ])
      .then((answers) => {
        sqlDel = `DELETE FROM PASSWORDS WHERE Reference='${answers.refDelete}';`;
        db.run(sqlDel, [], (err) => {
          if (err) {
            throw err;
          }
          console.log(chalk.bgBlue("Dados apagados com sucesso!"));

          // close database connection
          db.close();
          setTimeout(startOptions, 1000);
        });
      })
      .catch((err) => console.log(err));
  });
}

export default deletePassword;
