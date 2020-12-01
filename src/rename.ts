import { Position, Range, RenameProvider, TextDocument, WorkspaceEdit } from "vscode"
import * as vscode from 'vscode'
import tool from './tool'

// const vscode = require('vscode')

class MatlabRenameProvider implements RenameProvider {
  provideRenameEdits(document: TextDocument, position: Position, newName: string, token: vscode.CancellationToken): vscode.ProviderResult<WorkspaceEdit> {
    // throw new Error("Method not implemented.")
    const edit = new WorkspaceEdit()
    // edit.replace(document.uri, )
    // const range = new Range();
    const nameRange = document.getWordRangeAtPosition(position)
    const name = document.getText(nameRange) 
    const ranges = tool.getRangesByName(document.getText(), name)
    ranges.forEach(v => {
      const start = new Position(v.row, v.column)
      const end = new Position(v.row, v.column + name.length)
      const range = new Range(start, end)
      edit.replace(document.uri, range, newName)
    })
    return edit
  }
}

export default function (context: vscode.ExtensionContext) {
  context.subscriptions.push(vscode.languages.registerRenameProvider(
    'matlab',
    new MatlabRenameProvider()
  ))
}