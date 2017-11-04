const path = require("path")
const rm = require("rimraf")

function clean(relPath) {
  return new Promise((resolve, reject) => {
    rm(path.resolve(__dirname, relPath), err => {
      if (err) {
        return reject(err)
      }
      resolve()
    })
  })
}

async function main() {
  await Promise.all([clean("../dist/"), clean("../types/")])
}

main()
