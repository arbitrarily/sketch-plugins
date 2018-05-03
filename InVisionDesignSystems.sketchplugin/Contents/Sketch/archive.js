/*
  globals
  MSImmutableLayer
  MSJSONDataArchiver
  MSJSONDataUnarchiver
  MSKeyedUnarchiver
  MSLayerArray
  MSPasteboardLayersBase
  MSPasteboardLayersReaderWriter
  NSData
  NSDictionary
  NSMutableDictionary
  NSSet
  NSString
  NSUTF8StringEncoding
*/

const util = require('./util');
const $ = require('./collection-helpers');

const SKETCH_47_JSON_FORMAT_VERSION = 95;

function archiveDataFromSketchObject(object, options) {
  if (options && options.includeDependencies) {
    if (!options.document) {
      throw 'Options must include "document" when "includeDependencies" is true';
    }
    const documentData = options.document.documentData();
    const reader = MSPasteboardLayersReaderWriter.new();

    var symbols = null;
    if (reader.usedSymbolsInContainer_document) {
      symbols = reader.usedSymbolsInContainer_document(
        MSLayerArray.arrayWithLayer(object),
        documentData
      );
    } else {
      symbols = MSPasteboardLayersBase.usedSymbolsInContainer_document(
        MSLayerArray.arrayWithLayer(object),
        documentData
      );

    }

    // In Sketch 48 the symbols are returned as a set of
    // ids, but what we need is a map of those ids to the
    // symbols themselves.
    if (symbols.class().isSubclassOfClass(NSSet)) {
      const symbolsDict = NSMutableDictionary.new();
      const documentSymbols = util.getSymbolsMastersByID(options.document);
      $.forEach(symbols.allObjects(), function(symbolID) {
        const symbol = documentSymbols[symbolID].immutableModelObject();
        symbolsDict.setObject_forKey(symbol, symbolID);
      });
      symbols = symbolsDict;
    }

    object = NSDictionary.dictionaryWithDictionary({
      layers: [object.immutableModelObject()],
      symbols: symbols
    });
  }

  const immutableObject = object.immutableModelObject();
  const archiver = MSJSONDataArchiver.new();
  archiver.setArchiveObjectIDs(true);
  const archiveData = archiver.archivedDataWithRootObject_error(immutableObject, null);

  return wrapArchiveDataInHeader(archiveData);
}

function sketchObjectFromArchiveData(archiveData) {
  if (archiveData && archiveData.class().isSubclassOfClass(NSData)) {
    const jsonString = stringFromData(archiveData);

    // The default format version to use is the one exported
    // by Sketch 47. This is the last version for which we
    // did not store the format version so we would know
    // what to use when unarchiving. This is not exact
    // because of course customers do not always upgrade at
    // the same time, but because of backwards compatibility
    // going back several format versions, it is fine.
    var formatVersion = SKETCH_47_JSON_FORMAT_VERSION;

    var jsData;
    try {
      jsData = JSON.parse(jsonString);
    } catch (err) {
      jsData = null; // No-op.
    }

    if (!jsData) {
      // Format is not JSON, use the keyed unarchiver.
      return MSKeyedUnarchiver.unarchiveObjectWithData(archiveData);
    }

    if (jsData._class === 'MSArchiveHeader') {
      // If there is a wrapping header, take the format
      // version from it.
      formatVersion = jsData.version;

      // Also unwrap the archive data from the header
      // because the header throws Sketch off even though it
      // contains the correct version information.
      jsData = jsData.root;
    }

    return sketchObjectFromArchiveJSONUsingFormatVersion(
      JSON.stringify(jsData),
      formatVersion
    );

  } else {
    // Object has already been unarchived.
    return archiveData;
  }
}

function wrapArchiveDataInHeader(archiveData) {
  const archiveJSONString = stringFromData(archiveData);
  const archiveJSData = JSON.parse(archiveJSONString);

  const headerJSData = createArchiveHeaderJSData();
  headerJSData.root = archiveJSData;

  const archiveWithHeaderJSONString = JSON.stringify(headerJSData);
  return dataFromString(archiveWithHeaderJSONString);
}

function createArchiveHeaderJSData() {
  // Creating a header directly with MSArchiveHeader.new()
  // results in a header with no properties --- not what we
  // want. Instead, export a stub object and use the header
  // from that.
  const object = MSImmutableLayer.new();
  const archiveWithHeaderData = MSJSONDataArchiver.archivedDataWithHeaderAndRootObject(object);
  const archiveWithHeaderJSONString = stringFromData(archiveWithHeaderData);
  const archiveWithHeaderJSData = JSON.parse(archiveWithHeaderJSONString);
  delete archiveWithHeaderJSData.root;
  return archiveWithHeaderJSData;
}

// Unarchive with a known version of the JSON format.
function sketchObjectFromArchiveJSONUsingFormatVersion(jsonString, formatVersion) {
  return MSJSONDataUnarchiver.unarchiveObjectWithString_asVersion_corruptionDetected_error(
    jsonString,
    formatVersion,
    null,
    null
  );
}

function stringFromData(data) {
  return NSString.alloc().initWithData_encoding(data, NSUTF8StringEncoding);
}

function dataFromString(string) {
  return NSString.stringWithString(string).dataUsingEncoding(NSUTF8StringEncoding);
}


module.exports = {
  archiveDataFromSketchObject: archiveDataFromSketchObject,
  sketchObjectFromArchiveData: sketchObjectFromArchiveData
};
