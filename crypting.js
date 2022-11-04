/* const crypto = require('crypto') */
import crypto from 'crypto'

const keySecret = "asdfqwerasdfqwerasdfqwerasdfqwer"

//Senha a ser criptografada
const psw = "alexandre_oliveira"

function encrypt(value) {
  const iv = Buffer.from(crypto.randomBytes(16))
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(keySecret), iv)
  let encrypted = cipher.update(value)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`
}
export default encrypt;
/* console.log(encrypt(psw)) */