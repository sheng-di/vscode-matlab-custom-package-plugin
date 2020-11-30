/**
 * The entry
 * @param {*} context The context
 */
exports.activate = function(context) {
    // Auto-completion
    require('./completion')(context);
};

/**
 * Triggered when a plug-in is released
 */
exports.deactivate = function() {
};