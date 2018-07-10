const fs = require('fs')
const ignorePwds = []
const staticResourceTable = {}
const staticFileReg = /^.+(\.js|\.css|\.png|\.jpg|\.jpeg|\.svg|\.ttf|\.scss|\.less)$/i

let rootPwd = process.argv[3]
if (rootPwd[rootPwd.length - 1] !== '/') {
  rootPwd = rootPwd + '/'
}
let relativePwd = rootPwd

const parseArgs = (args) => {
  if (args.length === 4) {
    return
  }

  for (let i = 4; i < args.length; i++) {
    if (args[i] === '-r') {
      relativePwd = rootPwd + args[i + 1]
      i++
    } else if (args[i] === '-i') {
      let ignores = args.splice(i + 1)
      ignores.map(ignorePwd => {
        ignorePwds.push(ignorePwd)
      })
      break
    }
  }
}

const next = (pwd) => {
  const files = fs.readdirSync(pwd)

  files.forEach((file, index) => {
    const isDirectory = fs.statSync(pwd + '/' + file).isDirectory()
    if (isDirectory) {
      if (!ignorePwds.includes(file)) {
        if (pwd[pwd.length - 1] !== '/') {
          pwd += '/'
        }
        next(pwd + file + '/')
      }
    } else {
      if (staticFileReg.test(file)) {
        if (pwd === rootPwd) {
          staticResourceTable[file] = '/' + file
        } else {
          staticResourceTable[pwd.replace(rootPwd, '') + file] = pwd.replace(rootPwd, '/') + file
        }
      }
      if (pwd === relativePwd && index === files.length - 1) {
        fs.open(`${rootPwd}` + '/staticResource.json', 'w+', null, (e, fd) => {
          if (e) {
            console.log('create json file err', e)
            return
          }
          fs.write(fd, JSON.stringify(staticResourceTable), (error) => {
            error ? console.log('write err', error) : console.log('add json success')
            fs.closeSync(fd)
          })
        })
      }
    }
  })
}

parseArgs(process.argv)
next(relativePwd)
