// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import completion from './completion'
import jumpToDefinition from './jumpToDefinition'
import rename from './rename'


// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	completion(context)
	jumpToDefinition(context)
	rename(context)
	vscode.window.showInformationMessage('Matlab Custom Package Plugin activated!')
}

// this method is called when your extension is deactivated
export function deactivate() {}
