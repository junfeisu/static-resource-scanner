const fs = require('fs')
const path = require('path')

const ignorePwds = []
const staticResourceTable = {}
const staticFileReg = /^.+(\.js|\.css|\.png|\.jpg|\.jpeg|\.svg|\.ttf|\.scss|\.less)$/i

let rootPwd = process.argv[3]
let relativePwd = rootPwd
let specifiedName = ''

const parseArgs = (args) => {
  if (args.length === 4) {
    return
  }

  for (let i = 4; i < args.length; i++) {
    if (args[i] === '-r') {
      relativePwd = path.resolve(rootPwd, args[++i])
    } else if (args[i] === '-i') {
      ignorePwds.push(args[++i])
    } else if (args[i] === '-n') {
      specifiedName = args[++i]
    }
  }
}

const next = (pwd) => {
  const files = fs.readdirSync(pwd)

  files.forEach((file, index) => {
    const isDirectory = fs.statSync(path.resolve(pwd, file)).isDirectory()
    if (isDirectory) {
      if (!ignorePwds.includes(file)) {
        next(path.resolve(pwd, file))
      }
    } else {
      if (staticFileReg.test(file)) {
        if (path.resolve(pwd) === path.resolve(rootPwd)) {
          staticResourceTable[file] = '/' + file
        } else {
          staticResourceTable[path.join(pwd.replace(rootPwd, ''), file)] = path.join(pwd.replace(rootPwd, '/'), file)
        }
      }
      if (pwd === relativePwd && index === files.length - 1) {
        let fileName = specifiedName ? specifiedName + '.json' : 'staticResource.json' 
        fs.open(path.resolve(rootPwd, fileName), 'w+', null, (e, fd) => {
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
