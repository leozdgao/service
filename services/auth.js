import path from 'path'
import Promise from 'bluebird'
import fs from 'fs'
import {salthash, md5} from './encrypt'

// ensure promisify
Promise.promisifyAll(fs)

const authFilePath = path.join(__dirname, '../.auth')
const loginFilePath = path.join(__dirname, '../.login')
const initPwd = '123456'
const pwdExpired = 3600000 // 1 hour

/**
 * Password Service
 *
 * Description:
 *   Use a file for saving the salt hashed password, the first line is salt, the
 *   second line is hash
 */

export const pwdService = {
  init() {
    if(!fs.existsSync(authFilePath)) setToken(initPwd)
  },
  reset() {
    return setToken(initPwd)
  },
  setToken(val) {
    return salthash(val).then(({salt, hash}) => {
      return writeAuthFile(salt, hash)
    })
  },
  checkToken(input) {
    let cur
    return getAuthFileContent()
      .then(({salt, hash}) => {
        cur = hash
        return salthash(input, salt)
      })
      .then(({salt, hash}) => {
        return hash === cur
      })
  }
}

/**
 * Login Service
 *
 * Description:
 *   Use pwdService to check the pwd, and return a hash token, the token
 *   and the login date will be recorded to a file
 */

export const loginService = {
  login(pwd) { // actually it just check pwd
    return pwdService.checkToken(pwd)
      .then((ret) => {
        if(ret) return writeLoginFile(pwd)
        else throw Error('login failed')
      })
  },
  logout(utoken) {
    return loginService.checkAuth(utoken)
      .then(clearLoginFile)
      .catch(() => {})
  },
  checkAuth(utoken) { // also check expire
    return getLoginFileContent()
      .then(({token, date}) => {
        if(!token || utoken !== token || Number(date + pwdExpired) < Date.now()) throw Error('Invalid token or token has expired.')
      })
  }
}

function writeAuthFile(salt, hash) {
  return fs.writeFileAsync(authFilePath, `${salt}\n${hash}`)
}

function writeLoginFile(pwd) {
  let date = Date.now()
  let token = md5(pwd + date)
  return fs.writeFileAsync(loginFilePath, `${token}\t${date}`).then(() => token)
}

function clearLoginFile() {
  return fs.writeFileAsync(loginFilePath, '')
}

function getAuthFileContent() {
  return fs.readFileAsync(authFilePath, { encoding: 'utf-8' }).then((data) => {
    let [salt, hash] = data.split('\n')
    return { salt, hash }
  })
}

function getLoginFileContent() {
  return fs.readFileAsync(loginFilePath, { encoding: 'utf-8' }).then((data) => {
    let [token, date] = data.split('\t')
    return { token, date }
  })
}
