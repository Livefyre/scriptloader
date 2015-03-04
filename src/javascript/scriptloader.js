/**
 * @fileOverview Script loader.
 * @author Ross Pfahler
 */

var ObjUtil = require('scriptloader/object');

/**
 * Callback array. Tracks callbacks when scripts are loading
 * @type {Object.<string, Array>}
 */
var callbacks = {};

/**
 * Tracks scripts that have been loaded via the script loader.
 * @type {Object.<string, string>}
 */
var loaded = {};

/**
 * Loader object.
 * @type {object}
 */
var Loader = {};

/**
 * Adds a stylesheet to the page.
 * @param {string} src The url of the stylesheet to load.
 * @param {Document=} opt_doc
 * @param {Object=} opt_attrs Additional attributes to add to the link tag.
 * @param {Element=} opt_attachEl Optional element to attach the stylesheet
 */
Loader.loadCSS = function(src, opt_doc, opt_attrs, opt_attachEl) {
    var doc = opt_doc || document;
    var el = opt_attachEl ? opt_attachEl : doc.getElementsByTagName('head')[0];
    var link = doc.createElement('link');

    if (existsOnPage('link', 'href', src, doc)) {
        return;
    }

    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = src;
    link.media = 'all';

    if (ObjUtil.isObject(opt_attrs)) {
        ObjUtil.extend(link, opt_attrs);
    }

    el.appendChild(link);
};

/**
 * Adds a script to the page.
 * @param {string} src The url of the script to load.
 * @param {Document=} opt_doc
 * @param {object=} opt_attrs Additional attributes to add to the script tag.
 * @param {function()=} opt_callback
 * @param {Element=} opt_attachEl Optional element to attach the script
 */
Loader.loadScript = function(src, opt_doc, opt_attrs, opt_callback, opt_attachEl) {
    var callback = typeof(opt_callback) === 'function' ? opt_callback : function(){};
    var doc = opt_doc || document;
    var el = opt_attachEl ? opt_attachEl : doc.getElementsByTagName('head')[0];
    var script = doc.createElement('script');

    // If loaded..
    if (loaded[src]) {
        callback();
        return;
    }

    // If loading...
    if (callbacks[src]) {
        callbacks[src].push(callback);
        return;
    }

    script.type = 'text/javascript';
    script.src = src;
    script.async = true;
    script.defer = true;

    if (ObjUtil.isObject(opt_attrs)) {
        ObjUtil.extend(link, opt_attrs);
    }

    attachCallback(script, callback);
    el.appendChild(script);
};


/**
 * Attach a callback to be executed after the provided script has loaded.
 * @param {!Element} script
 * @param {!Function} callback
 */
var attachCallback = function(script, callback) {
    callbacks[script.src] = [callback];

    /** @this {Element} */
    script.onload = script.onreadystatechange = function() {
        if (!script.readyState || /loaded|complete/.test(script.readyState)) {
            executeCallbacks(script.src);
            loaded[script.src] = true;
            // IE memory leaks
            script.onload = script.onreadystatechange = null;
            script = undefined;
        }
    };
};

/** @param {!string} scriptSrc */
var executeCallbacks = function(scriptSrc) {
    var _callbacks = callbacks[scriptSrc];
    if (_callbacks.length) {
        for (var i=0, l=_callbacks.length; i<l; i++) {
            _callbacks[i]();
        }
    }
    delete callbacks[scriptSrc];
};

/**
 * Checks whether an element exists on the page with the given
 * tag having an attribute whose value contains the string val.
 * @param {string} tag The tag to use to search elements.
 * @param {string} attr The attribute to compare against the value.
 * @param {string} val The value.
 * @param {Document=} opt_doc
 * @return {boolean} If a matching element exists on the page.
 */
var existsOnPage = function(tag, attr, val, opt_doc) {
    var doc = opt_doc || document;
    var i = 0;
    var tags = doc.getElementsByTagName(tag);
    var len = tags.length;
    var element;

    // set to lowercase to support case insensitive matching
    val = val.toLowerCase();

    // Cannot use Array.prototype.some in this case because older versions of prototype.js may hijack it.
    // This only should matter when looping over array-like objects
    // (node lists, arguments, etc) rather than Arrays.
    for (; i<len; i++) {
        element = tags[i];
        if (typeof(element[attr]) === 'string' && element[attr].toLowerCase().indexOf(val) > -1) {
            return true;
        }
    }
    return false;
};

module.exports = Loader;
