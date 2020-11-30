const vscode = require('vscode')
/**
 * The entry
 * @param {*} context The context
 */
exports.activate = function(context) {
    // Auto-completion
    require('./completion')(context);
    require('./jump-to-definition')(context);
    vscode.window.showInformationMessage('Matlab Custom Package Plugin activated!')
};

/**
 * Triggered when a plug-in is released
 */
exports.deactivate = function() {
};