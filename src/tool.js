const path = require("path")
const fs = require("fs")

/**
 * Match and return dir paths in `addpath` command
 * @param {string} str current document content
 */
function matchAddPath(str) {
  let addPaths = []
  const regex = /^(?!\%)addpath\(["'](\S+)["']\)/gm
  let m
  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }

    // The result can be accessed through the `m`-variable.
    m.forEach(() => {
      addPaths.push(m[1])
    })
  }
  return addPaths
}

function getCommands(fileName, content) {
  const dirPath = path.dirname(fileName)
  const dirPaths = [dirPath]

  let arr = []
  let addPaths = matchAddPath(content)
  addPaths.forEach((v) => {
    if (!path.isAbsolute(v)) {
      // relative to absolute
      v = path.join(dirPath, v)
    }
    dirPaths.push(v)
  })

  dirPaths.forEach((v) => {
    console.log(v)
    const mFileNames = fs
      .readdirSync(v)
      .filter((v) => v.endsWith(".m"))
      .map((v) => v.slice(0, v.length - 2))
    console.log(mFileNames)
    arr = arr.concat(mFileNames)
  })

  return arr
}

module.exports = {
  getCommands,
}