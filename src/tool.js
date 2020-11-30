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

/**
 * Get quick suggestions like ones provided by vscode
 * for the reason that custom completion will overwrite original quick subbestions.
 * @param {string}} content current file's content
 */
function getQuickSuggestions(content) {
  // Case 1: variableName = xxx
  // Case 2: at function line
  const regex = /\b([\w_]+)\b/gm
  let m
  let res = new Set()

  while ((m = regex.exec(content)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches
    if (m.index === regex.lastIndex) {
      regex.lastIndex++
    }

    // The result can be accessed through the `m`-variable.
    m.forEach((match, groupIndex) => {
      res.add(match)
    })
  }
  const keywordSet = new Set(['break', 'case', 'catch', 'classdef', 'continue', 'else', 'elseif', 'end', 'for', 'function', 'global', 'if', 'otherwise', 'parfor', 'persistent', 'return', 'spmd', 'switch', 'try', 'while'])

  return [...res].filter(v => /[^0-9]\S+/.test(v) && !keywordSet.has(v))
}

/**
 * Get the commands to show
 * @param {string} fileName file name
 * @param {string} content current file's content
 */
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

  const quickSuggestions = getQuickSuggestions(content)
  arr = arr.concat(quickSuggestions)

  return [...new Set(arr)]
}

/**
 * Get row / col from current file's content
 * @param {string} content current file's content
 * @param {string} word target word to search
 */
function getRowCol(content, word) {
  // Case 1: in body.
  const reg = new RegExp(`\\b${word}\\s*=`, "m")
  const res = content.match(reg)
  if (res) {
    const rows = content.slice(0, res.index).split("\n")
    // row start at 0
    const row = rows.length - 1
    // col is last line's length
    const col = rows[row].length
    return { row, col }
  }

  // Case 2: in function declaration
  const FUNCTION_PART = "function "
  if (content.indexOf(FUNCTION_PART) !== -1) {
    // contains 'function '
    const arr = content.split("\n")
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].indexOf(FUNCTION_PART) !== -1) {
        const functionLine = arr[i]
        const regSingle = new RegExp(`\\b${word}\\b`)
        const resSingle = functionLine.match(regSingle)
        if (resSingle) {
          return {
            row: i,
            col: resSingle.index,
          }
        }
        break
      }
    }
  }

  return null
}

module.exports = {
  getCommands,
  getRowCol,
  getCurrentFileVariables: getQuickSuggestions,
}
