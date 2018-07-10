const fs = require('fs')
const ignorePwds = []
const staticResourceTable = {}

let rootPwd = process.env.PWD
let relativePwd = rootPwd

const parseArgs = (args) => {
  if (args.length === 1) {
    return
  }

  for (let i = 1; i < process.argv.length; i++) {
    if (process.argv[i] === '-r') {
      relativePwd = process.argv[i + 1]
      i++
    } else if (process.argv[i] === '-i') {
      let ignores = process.argv.splice(i + 1)
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
      next(pwd + '/' + file)
    } else {
      staticResourceTable[pwd + '/' + file] = pwd + '/' + file
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
