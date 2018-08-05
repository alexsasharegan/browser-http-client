const path = require("path");
const rm = require("rimraf");

main();

async function main() {
  await Promise.all(["../dist", "../lib", "../types"].map(path => clean(path)));
}

function clean(relPath) {
  return new Promise((resolve, reject) => {
    rm(path.resolve(__dirname, relPath), err => {
      if (err) {
        return reject(err);
      }
      resolve();
    });
  });
}
