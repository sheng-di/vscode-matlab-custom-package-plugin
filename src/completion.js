const vscode = require("vscode")
const tool = require("./tool")

/**
 * Auto-completion
 * @param {*} document current document
 */
function provideCompletionItems(document) {
  const content = vscode.window.activeTextEditor.document.getText();
  const commands = tool.getCommands(document.fileName, content)

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

module.exports = function (context) {
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
