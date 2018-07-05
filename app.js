const fs = require('fs')

const initialPwd = process.argv[2]
const staticResourceTable = {}

const next = (pwd) => {
  const files = fs.readdirSync(pwd)

  files.forEach((file, index) => {
    const isDirectory = fs.statSync(pwd + '/' + file).isDirectory()
    if (isDirectory) {
      next(pwd + '/' + file)
    } else {
      staticResourceTable[pwd + '/' + file] = pwd + '/' + file
      if (pwd === initialPwd && index === files.length - 1) {
        fs.open(`${initialPwd}` + '/staticResource.json', 'w+', null, (e, fd) => {
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

next(initialPwd)
