module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = __webpack_require__(1);
const completion_1 = __webpack_require__(2);
const jumpToDefinition_1 = __webpack_require__(6);
const rename_1 = __webpack_require__(7);
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    completion_1.default(context);
    jumpToDefinition_1.default(context);
    rename_1.default(context);
    vscode.window.showInformationMessage('Matlab Custom Package Plugin activated!');
}
exports.activate = activate;
// this method is called when your extension is deactivated
function deactivate() { }
exports.deactivate = deactivate;


/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("vscode");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(1);
const tool_1 = __webpack_require__(3);
/**
 * Auto-completion
 * @param {*} document current document
 */
function provideCompletionItems(document) {
    const content = vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.getText();
    const commands = content ? tool_1.default.getCommands(document.fileName, content) : [];
    return commands.map((v) => new vscode.CompletionItem(v, vscode.CompletionItemKind.Field));
}
/**
 * When the cursor selects the current autocomplete item, the action will be triggered. In general, no processing is required
 */
function resolveCompletionItem() {
    return null;
}
function default_1(context) {
    // register the code
    context.subscriptions.push(vscode.languages.registerCompletionItemProvider("matlab", {
        provideCompletionItems,
        resolveCompletionItem,
    }));
}
exports.default = default_1;


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const path = __webpack_require__(4);
const fs = __webpack_require__(5);
/**
 * Match and return dir paths in `addpath` command
 * @param {string} str current document content
 */
function matchAddPath(str) {
    let addPaths = [];
    const regex = /^(?!\%)addpath\(["'](\S+)["']\)/gm;
    let m;
    while ((m = regex.exec(str)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        // The result can be accessed through the `m`-variable.
        m.forEach(() => {
            m && addPaths.push(m[1]);
        });
    }
    return addPaths;
}
/**
 * Get quick suggestions like ones provided by vscode
 * for the reason that custom completion will overwrite original quick subbestions.
 * @param {string}} content current file's content
 */
function getCurrentFileVariables(content) {
    // Case 1: variableName = xxx
    // Case 2: at function line
    const regex = /\b([\w_]+)\b/gm;
    let m;
    let res = new Set();
    while ((m = regex.exec(content)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        // The result can be accessed through the `m`-variable.
        m.forEach((match, groupIndex) => {
            res.add(match);
        });
    }
    const keywordSet = new Set([
        "break",
        "case",
        "catch",
        "classdef",
        "continue",
        "else",
        "elseif",
        "end",
        "for",
        "function",
        "global",
        "if",
        "otherwise",
        "parfor",
        "persistent",
        "return",
        "spmd",
        "switch",
        "try",
        "while",
    ]);
    return [...res].filter((v) => /[^0-9]\S+/.test(v) && !keywordSet.has(v));
}
/**
 * Get the commands to show
 * @param {string} fileName file name
 * @param {string} content current file's content
 */
function getCommands(fileName, content) {
    const dirPath = path.dirname(fileName);
    const dirPaths = [dirPath];
    let arr = [];
    let addPaths = matchAddPath(content);
    addPaths.forEach((v) => {
        if (!path.isAbsolute(v)) {
            // relative to absolute
            v = path.join(dirPath, v);
        }
        dirPaths.push(v);
    });
    dirPaths.forEach((v) => {
        console.log(v);
        const mFileNames = fs
            .readdirSync(v)
            .filter((v) => v.endsWith(".m"))
            .map((v) => v.slice(0, v.length - 2));
        console.log(mFileNames);
        arr = arr.concat(mFileNames);
    });
    const quickSuggestions = getCurrentFileVariables(content);
    arr = arr.concat(quickSuggestions);
    return [...new Set(arr)];
}
/**
 * Get row / col from current file's content
 * @param {string} content current file's content
 * @param {string} word target word to search
 */
function getRowCol(content, word) {
    // Case 1: in body.
    const reg = new RegExp(`\\b${word}\\s*=`, "m");
    const res = content.match(reg);
    if (res) {
        const rows = content.slice(0, res.index).split("\n");
        // row start at 0
        const row = rows.length - 1;
        // col is last line's length
        const col = rows[row].length;
        return { row, col };
    }
    // Case 2: in function declaration
    const FUNCTION_PART = "function ";
    if (content.indexOf(FUNCTION_PART) !== -1) {
        // contains 'function '
        const arr = content.split("\n");
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].indexOf(FUNCTION_PART) !== -1) {
                const functionLine = arr[i];
                const regSingle = new RegExp(`\\b${word}\\b`);
                const resSingle = functionLine.match(regSingle);
                if (resSingle) {
                    return {
                        row: i,
                        col: resSingle.index,
                    };
                }
                break;
            }
        }
    }
    return null;
}
function getRangesByName(content, name) {
    const regex = new RegExp(`\\b${name}\\b`, "g");
    let result = [];
    content.split("\n").forEach((v, i) => {
        let m;
        while ((m = regex.exec(v)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }
            result.push({
                row: i,
                column: m.index
            });
        }
    });
    return result;
}
exports.default = {
    getCommands: getCommands,
    getRowCol,
    getCurrentFileVariables,
    getRangesByName,
};


/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vscode = __webpack_require__(1);
const tool = __webpack_require__(3);
/**
 * Find the provider defined by the file, return a location if it matches, otherwise it will not be handled
 * @param {*} document current document
 * @param {*} position current position
 */
function provideDefinition(document, position) {
    const fileName = document.fileName;
    const word = document.getText(document.getWordRangeAtPosition(position));
    const p = tool.getRowCol(document.getText(), word);
    if (p) {
        // Only match current file.
        // The plug-in with the most stars already supports cross-file definition-jump.
        return new vscode.Location(vscode.Uri.file(fileName), new vscode.Position(p.row, p.col));
    }
}
function default_1(context) {
    // 注册如何实现跳转到定义，第一个参数表示仅对json文件生效
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(['matlab'], {
        provideDefinition
    }));
}
exports.default = default_1;
;


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = __webpack_require__(1);
const vscode = __webpack_require__(1);
const tool_1 = __webpack_require__(3);
// const vscode = require('vscode')
class MatlabRenameProvider {
    provideRenameEdits(document, position, newName, token) {
        // throw new Error("Method not implemented.")
        const edit = new vscode_1.WorkspaceEdit();
        // edit.replace(document.uri, )
        // const range = new Range();
        const nameRange = document.getWordRangeAtPosition(position);
        const name = document.getText(nameRange);
        const ranges = tool_1.default.getRangesByName(document.getText(), name);
        ranges.forEach(v => {
            const start = new vscode_1.Position(v.row, v.column);
            const end = new vscode_1.Position(v.row, v.column + name.length);
            const range = new vscode_1.Range(start, end);
            edit.replace(document.uri, range, newName);
        });
        return edit;
    }
}
function default_1(context) {
    context.subscriptions.push(vscode.languages.registerRenameProvider('matlab', new MatlabRenameProvider()));
}
exports.default = default_1;


/***/ })
/******/ ]);
//# sourceMappingURL=extension.js.map