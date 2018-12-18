var that = this;
function run (key, context) {
  that.context = context;

var exports=function(e){function t(n){if(r[n])return r[n].exports;var o=r[n]={i:n,l:!1,exports:{}};return e[n].call(o.exports,o,o.exports,t),o.l=!0,o.exports}var r={};return t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=3)}([function(e,t,r){"use strict";function n(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)}function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}Object.defineProperty(t,"__esModule",{value:!0}),t.nsArrayToJSON=t.getSavedPreferences=t.saveToPreference=void 0;var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var n in r)Object.prototype.hasOwnProperty.call(r,n)&&(e[n]=r[n])}return e},i=r(7),s=function(e){return e&&e.__esModule?e:{default:e}}(i),l={bannerClosed:!1,previewed:[],licensedUrls:[],downloadsFolder:"",showScrollbar:!1,page:"",visited:{},pluginVersion:"",language:"",showInitToolTip:"show",media_resolution:"low-res"},c=function(){var e=NSDateFormatter.alloc().init();return e.setDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"),e.stringFromDate(NSDate.date())},u=function(e){var t=NSJSONSerialization.dataWithJSONObject_options_error(e,NSJSONWritingPrettyPrinted,"");return t?NSString.alloc().initWithData_encoding(t,NSUTF8StringEncoding):""},d=function(e){var t={};return e.forEach(function(e){t[e]=l[e]}),s.default.getUserPreferences("shutterstock",t)},f=function(e,t){var r="";switch(e){case"showScrollbar":r={showScrollbar:t.show};break;case"previewed":if(t.clearPreviewed)r={previewed:[]};else{var i=d([e]),l=[],u=0;if(i.previewed.forEach(function(e){e.id!==t.id?l.push({id:e.id,date:e.date?e.date:c()}):u=1}),0===u){var f=c();r={previewed:[{id:t.id,date:f}].concat(l)}}}break;case"licensedUrls":var p=d([e]),h=p.licensedUrls,S=t.size,g=t.url,y=t.id,v=[];if(h.forEach(function(e){v.push(NSMutableDictionary.dictionaryWithDictionary(e))}),h.length){var b=h.findIndex(function(e){return e.id==y});b>-1?v[b][S]=g:v=[o({id:y},S,g)].concat(n(h))}else v.push(o({id:y},S,g));r={licensedUrls:v};break;case"downloadsFolder":r={downloadsFolder:t.folder_path};break;case"bannerClosed":r={bannerClosed:t.show};break;case"tutorial":r={page:t.page,visited:t.visited};break;case"pluginVersion":r={pluginVersion:t};break;case"language":r={language:t.language};break;case"showInitToolTip":r={showInitToolTip:t.showInitToolTip};break;case"media_resolution":r={media_resolution:t.media_resolution};break;default:log("save default preferences")}r&&s.default.setUserPreferences("shutterstock",a({},r))};t.saveToPreference=f,t.getSavedPreferences=d,t.nsArrayToJSON=u},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(e,t){var r,n,o=/(\.0+)+$/,a=e.replace(o,"").split("."),i=t.replace(o,"").split("."),s=Math.min(a.length,i.length);for(r=0;r<s;r++)if(n=parseInt(a[r],10)-parseInt(i[r],10))return n;return a.length-i.length},o=function(){return context.plugin.version()},a=function(e){return n(o(),e)};t.cmpVersions=n,t.currentPluginVersion=o,t.isNewVersion=a},function(e,t,r){"use strict";(function(e){function n(e,t){for(var r,o=[],a=[],i={},s=0;s<e.allHeaderFields().allKeys().length;s++){var l=e.allHeaderFields().allKeys()[s].toLowerCase(),c=e.allHeaderFields()[l];o.push(l),a.push([l,c]),r=i[l],i[l]=r?r+","+c:c}return{ok:1==(e.statusCode()/200|0),status:e.statusCode(),statusText:NSHTTPURLResponse.localizedStringForStatusCode(e.statusCode()),url:e.URL(),clone:n.bind(this,e,t),text:function(){return new Promise(function(e,r){var n=NSString.alloc().initWithData_encoding(t,NSASCIIStringEncoding);n?e(n):r(new Error("Couldn't parse body"))})},json:function(){return new Promise(function(e,r){var n=NSString.alloc().initWithData_encoding(t,NSUTF8StringEncoding);if(n){e(JSON.parse(n))}else r(new Error("Could not parse JSON because it is not valid UTF-8 data."))})},blob:function(){return Promise.resolve(t)},headers:{keys:function(){return o},entries:function(){return a},get:function(e){return i[e.toLowerCase()]},has:function(e){return e.toLowerCase()in i}}}}function o(e,t){var r=t.payloadFromWebView,n=r.video_thumb_url,o=r.id,a=r.preview,i=t.totalLength;e.eval('addToQueue({\n    video_thumb_url: "'+n+'",\n    totalLength: '+i+",\n    id: "+o+",\n    preview: "+a+",\n  })")}function a(e,t){var r=t.downloadedBytes,n=t.id,o=t.preview;e.eval("updatedQueue({\n    downloaded: "+r+",\n    id: "+n+",\n    preview: "+o+",\n  })")}function i(e,t,r){e.eval("removeFromQueue({\n    id: "+t+",\n    preview: "+r+",\n  })")}function s(e,t){var r=t.id;f[r]&&(f[r].cancel(),delete f[r])}function l(e,t,r,s){return t=t||{},coscript.setShouldKeepAround(!0),new Promise(function(l,u){var p=NSURL.alloc().initWithString(e),h=NSMutableURLRequest.requestWithURL(p);if(h.setHTTPMethod(t.method||"GET"),Object.keys(t.headers||{}).forEach(function(e){h.setValue_forHTTPHeaderField(t.headers[e],e)}),t.body){var S;if("string"==typeof t.body){S=NSString.alloc().initWithString(t.body).dataUsingEncoding(NSUTF8StringEncoding)}else{S=NSJSONSerialization.dataWithJSONObject_options_error(t.body,NSJSONWritingPrettyPrinted,void 0),h.setValue_forHTTPHeaderField(""+S.length(),"Content-Length")}h.setHTTPBody(S)}c||(c=d({classname:"FetchPolyfillDelegateSstk",data:null,httpResponse:null,callbacks:null,webViewUI:null,payloadFromWebView:null,downloadedBytes:0,filePath:null,"connectionDidFinishLoading:":function(e){coscript.setShouldKeepAround(!0);var t=this.payloadFromWebView.payloadFromWebView,r=t.id,o=t.preview,a=this.webViewUI.webViewUI,s=NSFileHandle.fileHandleForReadingAtPath(this.filePath),l=s.readDataToEndOfFile();return i(a,r,o),this.callbacks.resolve(n(this.httpResponse,l))},"connection:didReceiveResponse:":function(e,t){var r=t.allHeaderFields()["Content-Length"],n=this.payloadFromWebView,a=n.payloadFromWebView,i=n.payloadFromWebView,s=(i.id,i.preview,i.fileName),l=i.image_directory,c=this.webViewUI.webViewUI,u={payloadFromWebView:a,totalLength:r},d=NSURL.URLWithString(""+l+s),f=d.path(),p=NSFileManager.defaultManager().createDirectoryAtURL_withIntermediateDirectories_attributes_error(NSURL.URLWithString(l),!0,null,""),h=NSFileManager.defaultManager().createFileAtPath_contents_attributes(f,null,null);p&&h&&(o(c,u),this.filePath=f),this.httpResponse=t},"connection:didFailWithError:":function(e,t){return coscript.setShouldKeepAround(!0),this.callbacks.reject(t)},"connection:didReceiveData:":function(e,t){if(this.filePath){this.downloadedBytes=this.downloadedBytes+t.length();var r=this.payloadFromWebView.payloadFromWebView,n=r.id,o=(r.folder_path,r.preview),i={id:n,downloadedBytes:this.downloadedBytes,preview:o};a(this.webViewUI.webViewUI,i);var s=NSFileHandle.fileHandleForWritingAtPath(this.filePath),l=NSMutableData.alloc().init();l.appendData(t),s.seekToEndOfFile(),s.writeData(l)}}}));var g=c.new();g.callbacks=NSDictionary.dictionaryWithDictionary({resolve:l,reject:u}),g.payloadFromWebView=NSDictionary.dictionaryWithDictionary({payloadFromWebView:s}),g.webViewUI=NSDictionary.dictionaryWithDictionary({webViewUI:r});var y=s.id;f[y]=NSURLConnection.alloc().initWithRequest_delegate(h,g)})}Object.defineProperty(t,"__esModule",{value:!0});var c,u=r(12),d=u.default,f={},p=void 0!==e?e:void 0;p.fetch=p.fetch||l,t.fetch=l,t.cancelDownload=s}).call(t,r(11))},function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){};var o=r(4),a=n(o),i=r(0),s=r(8),l=n(s),c=r(17),u=n(c),d={identifier:"shutterstock.sketch",x:0,y:0,width:360,height:800,background:NSColor.whiteColor(),onlyShowCloseButton:!0,title:"Shutterstock",hideTitleBar:!1,shouldKeepAround:!0,resizable:!0,frameLoadDelegate:{"webView:didFinishLoadForFrame:":function(e,t){var r=(0,i.getSavedPreferences)(["bannerClosed","showScrollbar","previewed","licensedUrls","downloadsFolder","page","visited","pluginVersion","language","media_resolution","showInitToolTip"]),n=(0,i.nsArrayToJSON)(r.previewed),o=(0,i.nsArrayToJSON)(r.licensedUrls),a=(0,i.nsArrayToJSON)(r.visited);(0,u.default)(r.pluginVersion),f.eval("saveLocalStorage({\n        data: {\n          previewed: "+n+",\n          showScrollbar: "+r.showScrollbar+",\n          bannerClosed: "+r.bannerClosed+",\n          licensedUrls: "+o+",\n          downloadsFolder: "+r.downloadsFolder+',\n          page: "'+r.page+'",\n          visited: '+a+',\n          language: "'+r.language+'",\n          showInitToolTip: "'+r.showInitToolTip+'",\n          media_resolution: "'+r.media_resolution+'"\n        }\n      })');var s=(0,l.default)(f);e.windowScriptObject().setValue_forKey_(s,"sstk_webscript_obj")}},uiDelegate:{},onPanelClose:function(){}},f=new a.default(context,"https://plugins.shutterstock.com?host_app=sketch&bannerClosed="+(0,i.getSavedPreferences)(["bannerClosed"]).bannerClosed+"&showScrollbar="+(0,i.getSavedPreferences)(["showScrollbar"]).showScrollbar+"&lang="+(0,i.getSavedPreferences)(["language"]).language,d)},function(e,t,r){"use strict";function n(e,t,r,n){r.addConstraint(NSLayoutConstraint.constraintWithItem_attribute_relatedBy_toItem_attribute_multiplier_constant(t,e,NSLayoutRelationEqual,r,e,1,n))}function o(e,t,r){e.setTranslatesAutoresizingMaskIntoConstraints(!1),n(NSLayoutAttributeLeft,e,t,r[0]),n(NSLayoutAttributeTop,e,t,r[1]),n(NSLayoutAttributeRight,e,t,r[2]),n(NSLayoutAttributeBottom,e,t,r[3])}function a(e,t,r){function n(){if(r.onPanelClose){if(!1===r.onPanelClose())return}a.close(),f.removeObjectForKey(r.identifier),l.setShouldKeepAround(!1)}r=r||{};var a,u,d=r.identifier||NSUUID.UUID().UUIDString(),f=NSThread.mainThread().threadDictionary();if(f[d]){a=f[d],a.makeKeyAndOrderFront(null);for(var p=a.contentView().subviews(),h=0;h<p.length;h++)p[h].isKindOfClass(WebView.class())&&(u=p[h]);if(!u)throw new Error("Tried to reuse panel but couldn't find the webview inside");return{panel:a,eval:u.stringByEvaluatingJavaScriptFromString,webView:u}}a=NSPanel.alloc().init();var S=r.width||240,g=r.height||180;a.setFrame_display(NSMakeRect(r.x||0,r.y||0,S,g),!0),a.setTitle(r.title||e.plugin.name()),r.hideTitleBar&&(a.setTitlebarAppearsTransparent(!0),a.setTitleVisibility(NSWindowTitleHidden)),r.onlyShowCloseButton&&(a.standardWindowButton(NSWindowMiniaturizeButton).setHidden(!0),a.standardWindowButton(NSWindowZoomButton).setHidden(!0));var y=a.standardWindowButton(NSWindowCloseButton);y.setCOSJSTargetFunction(n),y.setAction("callAction:"),a.setStyleMask(r.styleMask||(r.resizable?NSTexturedBackgroundWindowMask|NSTitledWindowMask|NSResizableWindowMask|NSClosableWindowMask|NSFullSizeContentViewWindowMask:NSTexturedBackgroundWindowMask|NSTitledWindowMask|NSClosableWindowMask|NSFullSizeContentViewWindowMask)),a.becomeKeyWindow(),a.setLevel(NSFloatingWindowLevel);var v=r.background||NSColor.whiteColor();if(a.setBackgroundColor(v),r.blurredBackground){var b=NSVisualEffectView.alloc().initWithFrame(NSMakeRect(0,0,S,g));b.setAppearance(NSAppearance.appearanceNamed(NSAppearanceNameVibrantLight)),b.setBlendingMode(NSVisualEffectBlendingModeBehindWindow),a.contentView().addSubview(b),o(b,a.contentView(),[0,0,0,0])}if(f[d]=a,!1!==r.shouldKeepAround&&l.setShouldKeepAround(!0),u=WebView.alloc().initWithFrame(NSMakeRect(0,r.hideTitleBar?-24:0,r.width||240,(r.height||180)-(r.hideTitleBar?0:24))),r.frameLoadDelegate||r.handlers){var m=r.frameLoadDelegate||{};if(r.handlers){var w;m[c]=function(t,n){var o=t.windowScriptObject().evaluateWebScript("window.location.hash");if(o=s(o),o.pluginAction&&o.actionId&&o.actionId!==w&&o.pluginAction in r.handlers){w=o.actionId;try{o.pluginArgs=JSON.parse(o.pluginArgs)}catch(e){}r.handlers[o.pluginAction].apply(e,o.pluginArgs)}}}var _=new i(m);u.setFrameLoadDelegate_(_.getClassInstance())}if(r.uiDelegate){var N=new i(r.uiDelegate);u.setUIDelegate_(N.getClassInstance())}return r.blurredBackground?u.setDrawsBackground(!1):(u.setOpaque(!0),u.setBackgroundColor(v)),/^(?!http|localhost|www|file).*\.html?$/.test(t)&&(t=e.plugin.urlForResourceNamed(t).path()),u.setMainFrameURL_(t),a.contentView().addSubview(u),o(u,a.contentView(),[0,(r.hideTitleBar,0),0,0]),a.center(),a.makeKeyAndOrderFront(null),{panel:a,eval:u.stringByEvaluatingJavaScriptFromString,webView:u,close:n}}var i=r(5),s=r(6),l=COScript.currentCOScript(),c="webView:didChangeLocationWithinPageForFrame:";a.clean=function(){l.setShouldKeepAround(!1)},e.exports=a},function(module,exports,__webpack_require__){"use strict";var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};module.exports=function(selectorHandlerDict,superclass){var uniqueClassName="MochaJSDelegate_DynamicClass_"+NSUUID.UUID().UUIDString(),delegateClassDesc=MOClassDescription.allocateDescriptionForClassWithName_superclass_(uniqueClassName,superclass||NSObject);delegateClassDesc.registerClass();var handlers={};if(this.setHandlerForSelector=function(selectorString,func){var handlerHasBeenSet=selectorString in handlers,selector=NSSelectorFromString(selectorString);if(handlers[selectorString]=func,!handlerHasBeenSet){for(var args=[],regex=/:/g;regex.exec(selectorString);)args.push("arg"+args.length);var dynamicFunction=eval("(function ("+args.join(", ")+") { return handlers[selectorString].apply(this, arguments); })");delegateClassDesc.addInstanceMethodWithSelector_function_(selector,dynamicFunction)}},this.removeHandlerForSelector=function(e){delete handlers[e]},this.getHandlerForSelector=function(e){return handlers[e]},this.getAllHandlers=function(){return handlers},this.getClass=function(){return NSClassFromString(uniqueClassName)},this.getClassInstance=function(){return NSClassFromString(uniqueClassName).new()},"object"===(void 0===selectorHandlerDict?"undefined":_typeof(selectorHandlerDict)))for(var selectorString in selectorHandlerDict)this.setHandlerForSelector(selectorString,selectorHandlerDict[selectorString])}},function(e,t,r){"use strict";e.exports=function(e){if(e=e.split("?")[1])return e=e.split("&").reduce(function(e,t){var r=t.split("=");return 2===r.length&&(e[decodeURIComponent(r[0])]=decodeURIComponent(r[1])),e},{})}},function(e,t,r){"use strict";function n(e){return null!=e}e.exports={getUserPreferences:function(e,t){var r={},o=NSUserDefaults.alloc().initWithSuiteName("plugin.sketch."+e);return Object.keys(t).forEach(function(e){"boolean"==typeof t[e]?r[e]=n(o.boolForKey(e))?Boolean(o.boolForKey(e)):t[e]:"number"==typeof t[e]?r[e]=n(o.doubleForKey(e))?o.doubleForKey(e):t[e]:"string"==typeof t[e]?r[e]=n(o.stringForKey(e))?""+o.stringForKey(e):t[e]:Array.isArray(t[e])?r[e]=o.arrayForKey(e)||t[e]:r[e]=o.dictionaryForKey(e)||t[e]}),r},setUserPreferences:function(e,t){var r=NSUserDefaults.alloc().initWithSuiteName("plugin.sketch."+e);Object.keys(t).forEach(function(e){"boolean"==typeof t[e]?r.setBool_forKey(t[e],e):"number"==typeof t[e]?r.setDouble_forKey(t[e],e):r.setObject_forKey(t[e],e)}),r.synchronize()}}},function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var o=r(9),a=n(o),i=r(10),s=n(i),l=r(14),c=n(l),u=r(15),d=n(u),f=r(0),p=r(16),h=n(p),S=r(2),g=function(e,t){return e.valueForKey(t).JSValue().toObject()},y=function(e){return(0,a.default)({insertImage:function(t){var r=g(t,"media_payload");(0,f.saveToPreference)("previewed",r),(0,s.default)(r,!0,e)},replaceImage:function(t){var r=g(t,"media_payload");(0,f.saveToPreference)("licensedUrls",r),(0,s.default)(r,!1,e)},openOutBoundLink:function(e){var t=e.valueForKey("href");(0,d.default)(t)},savePreferences:function(e){var t=g(e,"media_payload");(0,f.saveToPreference)(""+t.prefKey,t)},webViewSelectFolder:function(t){var r=g(t,"media_payload");log("payload"),log(r),(0,h.default)(e,r)},cancelDownloading:function(t){var r=g(t,"id");(0,S.cancelDownload)(e,r)},openDownloadFolder:function(e){(0,c.default)(e)}})};t.default=y},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(e){var t="MochaJSWebScriptingObject_DynamicClass_"+NSUUID.UUID().UUIDString(),r=MOClassDescription.allocateDescriptionForClassWithName_superclass_(t,NSObject),n=JSContext.new(),o=function(e){return JSValue.valueWithObject_inContext_(e,n).toObject()};return r.addInstanceMethodWithSelector_function_("invokeUndefinedMethodFromWebScript:withArguments:",function(t,r){var n=e[t];if(!n)return null;var a=n.apply(null,r);return o(a)}),r.registerClass(),NSClassFromString(t).new()};t.default=n},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(2),o=r(1),a=function(){return NSDocumentController.sharedDocumentController().currentDocument()},i=function(e){var t=MSApplicationMetadata.metadata().appVersion,r=t>"47.1"?a().contentDrawView():a().currentView(),n=Math.round((r.frame().size.width/2-r.horizontalRuler().baseLine())/r.zoomValue()),o=Math.round((r.frame().size.height/2-r.verticalRuler().baseLine())/r.zoomValue()),i=e.frame(),s=i.width(),l=i.height();e.absoluteRect().setRulerX(n-s/2),e.absoluteRect().setRulerY(o-l/2)},s=function(e,t,r,n){return e.filteredArrayUsingPredicate(t)},l=function(e,t){var r=Date.now();t.objectID=e+"-"+r},c=function(e,t){var r=MSPDFImporter.epsImporter();r.prepareToImportFromURL(e);var n=r.importAsLayer();return n.setName(t),l(t,n),n},u=function(e){var t=NSImage.alloc().initWithContentsOfURL(e);if(MSApplicationMetadata.metadata().appVersion<47)var r=MSImageData.alloc().initWithImage_convertColorSpace(t,!1);else var r=MSImageData.alloc().initWithImage(t);return r},d=function(e,t,r){var n=t.style().fills().firstObject();n.setFillType(4),n.setImage(u(r)),n.isEnabled=1,l(e,t)},f=function(e,t){var r=e.frame().height(),n=e.frame().width(),o=r>n||r===n?r:n;e.multiplyBy(500/o),i(e)},p=function(e,t,r,n,o){var a="";if(o){var i=c(e,t);r?n.addLayer(i):n.currentPage().addLayers([i]),a=i}else a=MSBitmapLayer.alloc().initWithFrame(CGRectMake(0,0,100,100)),a.image=u(e),n.addLayer(a),a.setName(""+t),l(""+t,a),a.resizeToOriginalSize();f(a)},h=function(e,t,r){var n=a(),o=n.selectedLayers().layers();if(o.length){var i=NSPredicate.predicateWithFormat("(className == %@) OR (className == %@) OR (className == %@)","MSShapeGroup","MSLayerGroup","MSArtboardGroup"),l=s(o,i);if(l.length)return void l.forEach(function(n){var o=n.class();"MSShapeGroup"==o&&d(t,n,e),"MSLayerGroup"!=o&&"MSArtboardGroup"!=o||p(e,t,o,n,r)})}p(e,t,"",n,r)},S=function(e,t,r,n){var o=t+"-preview",i=t+"-comped",u=t+"-"+(r?r+"-":"")+"licensed",f=a().pages(),p=!1;f.forEach(function(r){var a=r.children(),f=n?NSPredicate.predicateWithFormat("(objectID contains %@) ",o):NSPredicate.predicateWithFormat("(objectID contains %@) OR (objectID contains %@) ",o,i);s(a,f).forEach(function(r){p=!0,"MSBitmapLayer"==r.class()&&(r.name=u,l(u,r));var o=r.frame().width(),a=r.frame().height(),i=r.frame().left(),s=r.frame().top();if(n){var f=c(e,u),h=r.parentGroup();h.insertLayers_beforeLayer([f],r),f.frame().width=o,f.frame().height=a,f.frame().left=i,f.frame().top=s,h.removeLayer(r)}else if("MSShapeGroup"==r.class())d(t,r,e);else{var S=NSImage.alloc().initByReferencingURL(e),g=MSReplaceImageAction.alloc().init();g.applyImage_tolayer(S,r),r.frame().setWidth(o),r.frame().setHeight(a)}})}),p||h(e,u,n)},g=function(e,t,r){var a=e.url.split(".").pop(),i="eps"===a;e.fileName=e.id+"-"+(t?e.is_comped?"comped":"preview":e.size+"-licensed")+"."+a,e.folder_type=t?"previewed":"licensed";var s=e.folder_path+"shutterstock";(0,o.isNewVersion)("1.0.1")&&(s="shutterstock"===e.folder_path.split("/").filter(function(e){return""!==e}).pop(-1)?e.folder_path:e.folder_path+"shutterstock"),e.image_directory=s+"/"+e.folder_type+"/";var l=NSURL.URLWithString(""+e.image_directory+e.fileName);try{(0,n.fetch)(e.url,{},r,e).then(function(e){return e.blob()}).then(function(r){t?h(l,e.id+"-"+(0!=e.is_comped?"comped":"preview"),!1):S(l,e.id,e.size,i)}).catch(function(e){return log(e)})}catch(e){log(e)}};t.default=g},function(e,t,r){"use strict";var n,o="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};n=function(){return this}();try{n=n||Function("return this")()||(0,eval)("this")}catch(e){"object"===("undefined"==typeof window?"undefined":o(window))&&(n=window)}e.exports=n},function(e,t,r){"use strict";function n(e){var t=e.superclass||NSObject,r=(e.className||e.classname||"ObjCClass")+NSUUID.UUID().UUIDString(),n=new Set(["className","classname","superclass"]),s=MOClassDescription.allocateDescriptionForClassWithName_superclass_(r,t),l=[];for(var c in e){var u=e[c];if("function"==typeof u&&"init"!==c){var d=NSSelectorFromString(c);s.addInstanceMethodWithSelector_function_(d,u)}else n.has(c)||(l.push(c),s.addInstanceVariableWithName_typeEncoding(c,"@"))}return s.addInstanceMethodWithSelector_function_(NSSelectorFromString("init"),function(){var t=i.call(this);return l.map(function(r){Object.defineProperty(t,r,{get:function(){return o(t,r)},set:function(e){(0,a.object_setInstanceVariable)(t,r,e)}}),t[r]=e[r]}),"function"==typeof e.init&&e.init.call(this),t}),s.registerClass()}function o(e,t){var r=MOPointer.new();return(0,a.object_getInstanceVariable)(e,t,r),r.value().retain().autorelease()}Object.defineProperty(t,"__esModule",{value:!0}),t.SuperCall=void 0,t.default=n;var a=r(13);t.SuperCall=a.SuperCall;var i=(0,a.SuperCall)(NSStringFromSelector("init"),[],{type:"@"})},function(module,exports,__webpack_require__){"use strict";function _toConsumableArray(e){if(Array.isArray(e)){for(var t=0,r=Array(e.length);t<e.length;t++)r[t]=e[t];return r}return Array.from(e)}function SuperCall(selector,argTypes,returnType){var func=CFunc("objc_msgSendSuper",[{type:"^"+objc_super_typeEncoding},{type:":"}].concat(_toConsumableArray(argTypes)),returnType);return function(){var struct=make_objc_super(this,this.superclass()),structPtr=MOPointer.alloc().initWithValue_(struct),params=["structPtr","selector"].concat([].slice.apply(arguments).map(function(e,t){return"arguments["+t+"]"}));return eval("func("+params.join(", ")+")")}}function makeStruct(e){if("object"!==(void 0===e?"undefined":_typeof(e))||0==Object.keys(e).length)return e;var t=Object.keys(e)[0],r=e[t],n=MOStruct.structureWithName_memberNames_runtime(t,Object.keys(r),Mocha.sharedRuntime());return Object.keys(r).map(function(e){n[e]=makeStruct(r[e])}),n}function make_objc_super(e,t){return makeStruct({objc_super:{receiver:e,super_class:t}})}function setKeys(e,t){var r=NSMutableDictionary.dictionary();r.o=e,Object.keys(t).map(function(e){return r.setValue_forKeyPath(t[e],"o."+e)})}function CFunc(e,t,r){function n(e){if(!e)return null;var t=MOBridgeSupportArgument.alloc().init();return setKeys(t,{type64:e.type}),t}var o=MOBridgeSupportFunction.alloc().init();return setKeys(o,{name:e,arguments:t.map(n),returnValue:n(r)}),o}function addStructToBridgeSupport(e,t){var r=MOBridgeSupportStruct.alloc().init();setKeys(r,{name:e,type:t.type}),log("adding def: "+r);var n=MOBridgeSupportController.sharedController().valueForKey("symbols");if(!n)throw Error("Something has changed within bridge support so we can't add our definitions");n[NSString.stringWithString(e)]=r}var _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e};Object.defineProperty(exports,"__esModule",{value:!0}),exports.SuperCall=SuperCall,exports.CFunc=CFunc;var objc_super_typeEncoding='{objc_super="receiver"@"super_class"#}',object_getInstanceVariable=exports.object_getInstanceVariable=CFunc("object_getInstanceVariable",[{type:"@"},{type:"*"},{type:"^@"}],{type:"^{objc_ivar=}"}),object_setInstanceVariable=exports.object_setInstanceVariable=CFunc("object_setInstanceVariable",[{type:"@"},{type:"*"},{type:"@"}],{type:"^{objc_ivar=}"});addStructToBridgeSupport("objc_super",{type:objc_super_typeEncoding})},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(1),o=function(e){var t=e.replace("file://",""),r=t+"shutterstock";(0,n.isNewVersion)("1.0.1")&&(r="shutterstock"===t.split("/").filter(function(e){return""!==e}).pop(-1)?t:t+"shutterstock"),NSWorkspace.sharedWorkspace().openFile(r)};t.default=o},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(e){NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString(e))};t.default=n},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(0),o=function(e,t,r){(0,n.saveToPreference)("downloadsFolder",{folder_path:'"'+t+'"'});var o=(0,n.nsArrayToJSON)(r);e.eval('setDownloadFolder({\n    folder_path: "'+t+'",\n    payload: '+o+",\n  })")},a=function(e,t){var r=NSOpenPanel.openPanel();if(r.setAllowsMultipleSelection(!1),r.setCanChooseDirectories(!0),r.setCanChooseFiles(!1),r.runModal()!=NSFileHandlingPanelOKButton)return null;o(e,r.URLs().lastObject(),t)};t.default=a},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=r(0),o=r(1),a=function(){var e="google.analytics.shutterstock.uuid",t=NSUserDefaults.standardUserDefaults().objectForKey(e);return t||(t=NSUUID.UUID().UUIDString(),NSUserDefaults.standardUserDefaults().setObject_forKey(t,e)),t},i=function(e){return"?"+Object.keys(e).map(function(t){return encodeURIComponent(t)+"="+encodeURIComponent(e[t])}).join("&")},s=function(){var e={v:1,tid:"UA-32034-41",ds:"sketch "+NSBundle.mainBundle().objectForInfoDictionaryKey("CFBundleShortVersionString"),cid:a(),t:"event",an:context.plugin.name(),aid:context.plugin.identifier(),av:context.plugin.version(),ec:"install",ea:"success",el:"sketch"},t=NSURL.URLWithString(NSString.stringWithFormat("https://www.google-analytics.com/collect%@",i(e)));t&&NSURLSession.sharedSession().dataTaskWithURL(t).resume()},l=function(e){var t=(context.plugin.name(),context.plugin.identifier()),r=context.plugin.version();(e?(0,o.cmpVersions)(r,e):1)&&"com.shutterstock.plugin.sketch"==t&&((0,n.saveToPreference)("pluginVersion",r),s())};t.default=l}]);
  if (key === 'default' && typeof exports === 'function') {
    exports(context);
  } else {
    exports[key](context);
  }
}
that['onRun'] = run.bind(this, 'default')