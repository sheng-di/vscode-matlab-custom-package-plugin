import { TextDocument } from "vscode";
import * as vscode from 'vscode'
import tool from './tool'


/**
 * Auto-completion
 * @param {*} document current document
 */
function provideCompletionItems(document: TextDocument) {
  const content = vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.getText();
  const commands = content ? tool.getCommands(document.fileName, content) : []

  return commands.map(
    (v) => new vscode.CompletionItem(v, vscode.CompletionItemKind.Field)
  )
}

/**
 * When the cursor selects the current autocomplete item, the action will be triggered. In general, no processing is required
 */
function resolveCompletionItem() {
  return null
}

export default function (context: vscode.ExtensionContext) {
  // register the code
  context.subscriptions.push(
    vscode.languages.registerCompletionItemProvider(
      "matlab",
      {
        provideCompletionItems,
        resolveCompletionItem,
      }
    )
  )
}
