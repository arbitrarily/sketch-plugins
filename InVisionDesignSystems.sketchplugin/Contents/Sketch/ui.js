/* global NSRunLoop NSDate */

function UI(nib) {
  this.nib = nib;
}

UI.prototype.showProgressSheet = function(label, maxValue) {
  this.nib.progressIndicator.setDoubleValue(0);

  if (label) {
    this.nib.progressLabel.setStringValue(label);
  }

  if (maxValue) {
    this.nib.progressIndicator.setMaxValue(maxValue);
  }

  if (!this.nib.progressSheet.isEqualTo(this.nib.mainWindow.attachedSheet())) {
    // Only show sheet if not already attached.
    this.nib.mainWindow.beginSheet_completionHandler(this.nib.progressSheet, null);
  }
};

UI.prototype.hideProgressSheet = function() {
  this.nib.mainWindow.endSheet(this.nib.progressSheet);
};

UI.prototype.incrementProgress = function(incrementBy) {
  this.nib.progressIndicator.incrementBy(incrementBy || 1);

  // Work around to display progress bar updates even when
  // code is running in a loop on the main thread.
  NSRunLoop.mainRunLoop().runUntilDate(NSDate.dateWithTimeIntervalSinceNow(0.01));
};

module.exports = UI;
