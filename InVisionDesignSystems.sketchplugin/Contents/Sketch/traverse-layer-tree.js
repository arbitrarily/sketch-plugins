/* global NSMutableSet */

const $ = require('./collection-helpers');
const coerceString = require('./coerce').coerceString;

//since this flow is invoked several times from upload process we wouldn't want to report the error from each, so just choosing to invoke it from processLayertree
function traverseLayerTree(layer, func, reportError) {
  const visitedLayers = NSMutableSet.new();

  function visitLayer(layer, isInsideSymbol, isRoot) {
    if (visitedLayers.containsObject(layer)) {
      // Skip layers already visited. This can happen when
      // a layer contains multiple instances of the same
      // symbol.
      return;
    }
    visitedLayers.addObject(layer);

    // Look inside symbols.
    if (layer.className() == 'MSSymbolInstance') {
      var symbolInstance = layer;
      layer = layer.symbolMaster();
      isInsideSymbol = !isRoot;

      if (!layer) {
        if (reportError) {
          reportError('error', { message: 'Skipping layer without symbol master', layerInstance: coerceString(symbolInstance.name()) });
        }
        return;
      }
    }


    if (layer) {
      // debug(layer.children());
      $.forEach(layer.children(), function(child) {

        if (child.className() == 'MSSymbolInstance') {
          // Recurse on symbol instances.
          visitLayer(child, isInsideSymbol, false);
        } else {
          // For other layers, call the user provided function.
          func(child, !!isInsideSymbol);
        }

      });
    }
  }

  visitLayer(layer, false, true);
}

exports.traverseLayerTree = traverseLayerTree;
