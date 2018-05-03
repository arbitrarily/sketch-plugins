/* global NSMutableSet */

const $ = require('./collection-helpers');
const fonts = require('./fonts');
const typeStyles = require('./type-styles');
const coerceString = require('./coerce').coerceString;
const traverseLayerTree = require('./traverse-layer-tree').traverseLayerTree;

function sharedObjectsForLayer(layer, documentTextStylesMap, documentSharedStylesMap) {

  const sharedObjects = [];
  const directNestedSymbolIDs = [];

  const children = layer.children();

  if (children) {
    $.forEach(children, function(descendant) {
      if (descendant.className() == 'MSTextLayer') {
        const sharedTextStyleID = descendant.style().sharedObjectID();
        const textStyle = documentTextStylesMap[sharedTextStyleID];
        //todo: can I not have the layer at this point?
        if (textStyle) {
          sharedObjects.push({ type: 'text', id: sharedTextStyleID });
        }

      } else if (descendant.className() == 'MSShapeGroup') {
        const sharedLayerStyleID = descendant.style().sharedObjectID();
        const layerStyle = documentSharedStylesMap[sharedLayerStyleID];
        if (layerStyle) {
          sharedObjects.push({ type: 'layerStyle', id: sharedLayerStyleID });
        }

      } else if (descendant.className() == 'MSSymbolInstance' ||
                 descendant.className() == 'MSSymbolMaster') {

        if (!layer.symbolID || descendant.symbolID() !== layer.symbolID()) {
          //is it enough to have only symbol ids or do we want the layer ids as well?
          directNestedSymbolIDs.push(descendant.symbolID());
        }
      }
    });
  }

  return {
    sharedObjects: sharedObjects,
    directNestedSymbolIDs: directNestedSymbolIDs
  };
}

function styleDependenciesForLayers(styleData, layersMap, documentTextStylesById, documentSharedStylesById, brandAITypeStyleIDsByTextStyleID, brandAISharedStyleIDsByLayerStyleID) {

  const sharedLayerStyleDependencies = NSMutableSet.new();
  const sharedTextStyleDepencendies = NSMutableSet.new();

  //find styles of each uploaded layer (including same size)
  Object.keys(layersMap).forEach(function(key) {
    var origLayer = layersMap[key];
    traverseLayerTree(origLayer, function(layer) {
      if (layer.className() == 'MSShapeGroup') {
        const sharedLayerStyleID = layer.style().sharedObjectID();
        const layerStyle = documentSharedStylesById[sharedLayerStyleID];
        if (layerStyle) {
          sharedLayerStyleDependencies.addObject(layerStyle);
        }

      } else if (layer.className() == 'MSTextLayer') {
        const sharedTextStyleID = layer.style().sharedObjectID();
        const textStyle = documentTextStylesById[sharedTextStyleID];
        if (textStyle) {
          sharedTextStyleDepencendies.addObject(textStyle);
        }
      }
    });
  });

  //get parent libraries styles to prevent uploading them to children
  const parentLibraryBrandAISharedStyleIDs = NSMutableSet.new();
  styleData.globalAssets.sharedStyles.forEach(function(style) {
    if (style.styleguideId != styleData.styleguide._id) {
      parentLibraryBrandAISharedStyleIDs.addObject(style._id);
    }
  });
  const parentLibraryBrandAITypeStyleIDs = NSMutableSet.new();
  styleData.globalAssets.typeStyles.forEach(function(style) {
    if (style.styleguideId != styleData.styleguide._id) {
      parentLibraryBrandAITypeStyleIDs.addObject(style._id);
    }
  });

  //create data needed to upload each shared style
  const sharedLayerStylesToUpload = [];
  const sharedStylesFolderId = getDefaultFolder(styleData.styleguide, 'sharedStyles');

  $.forEach(sharedLayerStyleDependencies.allObjects(), function(layerStyle) {
    const uploadData = {
      objectID: coerceString(layerStyle.objectID()),
      name: coerceString(layerStyle.name()),
      folderId: sharedStylesFolderId
    };
    const brandAIID = brandAISharedStyleIDsByLayerStyleID[layerStyle.objectID()];
    if (!brandAIID || !parentLibraryBrandAISharedStyleIDs.containsObject(brandAIID)) {
      if (brandAIID) {
        uploadData._id = coerceString(brandAIID);
      }
      sharedLayerStylesToUpload.push(uploadData);
    }
  });

  //create data needed to upload each shared style including font families
  const fontVariantsToUpload = {};
  const sharedTypeStylesToUpload = [];

  const typeStylesFolderId = getDefaultFolder(styleData.styleguide, 'sharedStyles');

  $.forEach(sharedTextStyleDepencendies.allObjects(), function(textStyle) {
    const typeStyle = typeStyles.brandAITypeStyleFromSketchSharedStyle(textStyle);
    const brandAIID = brandAITypeStyleIDsByTextStyleID[textStyle.objectID()];
    if (!brandAIID || !parentLibraryBrandAITypeStyleIDs.containsObject(brandAIID)) {
      if (brandAIID) {
        typeStyle._id = coerceString(brandAIID);
      }
      if (!fontVariantsToUpload[typeStyle.fontFamily]) {
        fontVariantsToUpload[typeStyle.fontFamily] =
          fonts.fontVariantsInFontFamily(typeStyle.fontFamily);
      }
      typeStyle.folderId = typeStylesFolderId;
      sharedTypeStylesToUpload.push(typeStyle);
    }
  });

  return {
    sharedTypeStylesToUpload: sharedTypeStylesToUpload,
    sharedLayerStylesToUpload: sharedLayerStylesToUpload,
    fontVariantsToUpload: fontVariantsToUpload
  };
}

function getDefaultFolder(styleguide, entityTypeKey) {
  const typeFolders = styleguide.foldersByType[entityTypeKey];
  if (typeFolders && typeFolders.length > 0) {
    return typeFolders[0]._id;
  }

  return undefined;
}

exports.sharedObjectsForLayer = sharedObjectsForLayer;
exports.styleDependenciesForLayers = styleDependenciesForLayers;
