import Promise from 'bluebird'
import crypto from 'crypto'

const len = 128
const iterations = 12000

export function salthash (pwd, salt) {
  return new Promise((resolve, reject) => {
    if (salt) {
      crypto.pbkdf2(pwd, salt, iterations, len, (err, hash) => {
        if (err) reject(err)
        else {
          hash = hash.toString('base64')
          resolve({salt, hash})
        }
      })
    } else {
      // generate a random salt
      crypto.randomBytes(len, (err, salt) => {
        if (err) reject(err)
        else {
          salt = salt.toString('base64')
          crypto.pbkdf2(pwd, salt, iterations, len, (err, hash) => {
            if (err) reject(err)
            else {
              hash = hash.toString('base64')
              resolve({salt, hash})
            }
          })
        }
      })
    }
  })
}

export function md5 (content) {
  let md5 = crypto.createHash('md5')
  md5.update(content)

  return md5.digest('hex')
}
