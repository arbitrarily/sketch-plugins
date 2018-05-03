/*
  global
  MOClassDescription
  NSClassFromString
  NSFont
  NSMakeRange
  NSObject
  NSProcessInfo
  NSScrollView
  NSSelectorFromString
  NSString
  NSTemporaryDirectory
  NSTextView
  NSUUID
  NSUserDefaults
  coscript
  log
*/

const $ = require('./collection-helpers');

const DEBUG = NSUserDefaults.standardUserDefaults().boolForKey('BrandAIDebug');

function debug(msg) {
  if (DEBUG) {
    log(msg);
  }
}

function getTempFilePath(name, ext, ignoreUnique) {
  var fileName = name;

  if (!ignoreUnique) {
    var unique = NSProcessInfo.processInfo().globallyUniqueString();
    fileName = name + '__' + unique;
  }
  if (ext) {
    fileName += '.' + ext;
  }
  return NSTemporaryDirectory().stringByAppendingPathComponent(fileName);
}

function dataURLFromData(data, type) {
  return NSString.stringWithFormat(
    'data:%@;base64,%@',
    type,
    data.base64EncodedStringWithOptions(0)
  );
}

function mimeTypeForExt(extension) {
  switch(extension) {
    case 'svg':
      return 'image/svg+xml';
    case 'png':
      return 'image/png';
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg';
    case 'eps':
    case 'ai':
      return 'application/postscript';
    default:
      return 'application/x-skla';
  }
}

function defer(func) {
  coscript.scheduleWithInterval_jsFunction(0, func);
}

function createCocoaObject(methods, superclass) {
  var uniqueClassName = 'com.invision.dsm_dynamic_class_' + NSUUID.UUID().UUIDString();
  var classDesc = MOClassDescription.allocateDescriptionForClassWithName_superclass_(uniqueClassName, superclass || NSObject);
  classDesc.registerClass();
  for (var selectorString in methods) {
    var selector = NSSelectorFromString(selectorString);
    classDesc.addInstanceMethodWithSelector_function(selector, methods[selectorString]);
  }
  return NSClassFromString(uniqueClassName).new();
}

// Get all symbols master for specific document.
function getSymbolsMastersByID(document) {
  const symbols = document.documentData().allSymbols();
  return $.mapObject(symbols, function(symbol) {
    return [symbol.symbolID(), symbol];
  });
}

function createScrollingTextView(contentString, frame, fontSize) {
  fontSize = fontSize || NSFont.systemFontSize();

  const scrollView = NSScrollView.alloc().initWithFrame(frame);
  scrollView.setHasVerticalScroller(true);

  const textView = NSTextView.alloc().initWithFrame(frame);
  textView.setVerticallyResizable(true);
  textView.setEditable(false);
  const attributedString = textView.textStorage();
  attributedString.replaceCharactersInRange_withString(
    NSMakeRange(0, 0),
    contentString
  );
  attributedString.setAttributes_range(
    { NSFont: NSFont.systemFontOfSize(fontSize) },
    NSMakeRange(0, attributedString.characters().count())
  );

  scrollView.setDocumentView(textView);
  return scrollView;
}

exports.debug = debug;
exports.getTempFilePath = getTempFilePath;
exports.dataURLFromData = dataURLFromData;
exports.mimeTypeForExt = mimeTypeForExt;
exports.defer = defer;
exports.createCocoaObject = createCocoaObject;
exports.getSymbolsMastersByID = getSymbolsMastersByID;
exports.createScrollingTextView = createScrollingTextView;
