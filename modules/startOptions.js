import chalk from 'chalk'
import inquirer from 'inquirer'
import showPasswords from './showPasswords.js'
import prepareInsert from './prepareInsert.js'
import editPassword from './editPassword.js'
import deletePassword from './deletePassword.js'

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
            editPassword()
        } else if (answers.options === "Deletar senha") {
            deletePassword()
        } else {
            console.log(chalk.bgCyan("Obrigado por usar o PSWREC!"))
            process.exit()
        }
    }).catch((err) => console.log(err))
}

export default startOptions