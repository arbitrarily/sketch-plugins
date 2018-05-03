/* global NSApplication AppController */

function getMainPluginWindow() {
  const windows = NSApplication.sharedApplication().windows();
  var window;
  for (var i = 0; i < windows.count(); i++) {
    window = windows.objectAtIndex(i);
    if (window.identifier() == 'com.invision.dsm.mainWindow') {
      return window;
    }
  }
}

function onOpenFromCraftPanel(context) { // eslint-disable-line no-unused-vars
  const mainPluginWindow = getMainPluginWindow();

  if (!mainPluginWindow || !mainPluginWindow.isVisible()) {
    // If the plugin has no main window or the window is hidden, treat this
    // exacly like an invocation from the menu that opens the plugin.
    const toggleOpenCommand = context.command.pluginBundle().commands()['dsm-display'];
    context.command = toggleOpenCommand;
    AppController.sharedInstance().runPluginCommand_fromMenu_context(
      toggleOpenCommand,
      false,
      context
    );
  }

}

function onCloseFromCraftPanel(context) { // eslint-disable-line no-unused-vars
  const mainPluginWindow = getMainPluginWindow();

  if (mainPluginWindow && mainPluginWindow.isVisible()) {
    mainPluginWindow.performClose(null);
  }
}
