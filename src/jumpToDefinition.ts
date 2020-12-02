import { ExtensionContext, Position } from 'vscode'
import { TextDocument } from 'vscode'
import * as vscode from 'vscode'
import tool from './tool'

/**
 * Find the provider defined by the file, return a location if it matches, otherwise it will not be handled
 * @param {*} document current document
 * @param {*} position current position
 */
function provideDefinition(document: TextDocument, position: Position) {
    const fileName = document.fileName;
    const word = document.getText(document.getWordRangeAtPosition(position));

    const p = tool.getRowCol(document.getText(), word);
    if (p) {
        // Only match current file.
        // The plug-in with the most stars already supports cross-file definition-jump.
        return new vscode.Location(vscode.Uri.file(fileName), new vscode.Position(p.row, p.col))
    }
}

export default function (context: ExtensionContext) {
    // 注册如何实现跳转到定义，第一个参数表示仅对json文件生效
    context.subscriptions.push(vscode.languages.registerDefinitionProvider(['matlab'], {
        provideDefinition
    }));
};