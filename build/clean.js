const path = require("path")
const rm = require("rimraf")

function clean() {
  return new Promise((resolve, reject) => {
    rm(path.resolve(__dirname, "../dist"), err => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

async function main() {
  await clean()
}

main()
