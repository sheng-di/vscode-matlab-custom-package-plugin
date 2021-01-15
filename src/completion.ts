import { TextDocument } from "vscode";
import * as vscode from 'vscode'
import tool from './tool'


/**
 * Auto-completion
 * @param {*} document current document
 */
function provideCompletionItems(document: TextDocument, position: vscode.Position) {
  const content = vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.getText();
  if (content) {
    let res: vscode.CompletionItem[]
    // struct member names
    const structNames = tool.getStructNames(document.fileName, content)
    const structCompletions = structNames.map(name => {
      const completion = new vscode.CompletionItem(name)
      completion.commitCharacters = ['.']
      return completion
    })
    // common commands
    let commands = tool.getCommands(document.fileName, content)
    commands = commands.filter(v => !structNames.includes(v))
    const commandsCompletions = commands.map(
      (v) => new vscode.CompletionItem(v, vscode.CompletionItemKind.Field)
    )
    res = commandsCompletions.concat(structCompletions)
    return res
  }
  return []
}
/**
 * When the cursor selects the current autocomplete item, the action will be triggered. In general, no processing is required
 */
function resolveCompletionItem() {
  return null
}


export default function (context: vscode.ExtensionContext) {
  const provider1 = vscode.languages.registerCompletionItemProvider(
    "matlab",
    {
      provideCompletionItems,
      resolveCompletionItem,
    }
  )
  const provider2 = vscode.languages.registerCompletionItemProvider(
		'matlab',
		{
			provideCompletionItems(document: vscode.TextDocument, position: vscode.Position) {

				// get all text until the `position` and check if it reads `console.`
				// and if so then complete if `log`, `warn`, and `error`
        const linePrefix = document.lineAt(position).text.substr(0, position.character);
        console.log('linePrefix', linePrefix)

        const structNames = tool.getStructNames(document.fileName, document.getText())
        for (let name of structNames) {
          const prefix = `${name}.`
          if (linePrefix.endsWith(prefix)) {
            const members = tool.findMemberNames(document.fileName, document.getText(), name)
            return members.map(v => new vscode.CompletionItem(
              v, vscode.CompletionItemKind.Method
            ))
          }
        }
        return undefined
			}
		},
		'.' // triggered whenever a '.' is being typed
  )
  // register the code
  context.subscriptions.push(provider1, provider2)
}
