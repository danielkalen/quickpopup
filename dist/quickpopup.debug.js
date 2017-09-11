(function (require, global) {
require = (function (cache, modules, cx) {
return function (r) {
if (!modules[r]) throw new Error(r + ' is not a module');
return cache[r] ? cache[r].exports : ((cache[r] = {
exports: {}
}, cache[r].exports = modules[r].call(cx, require, cache[r], cache[r].exports)));
};
})({}, {
"entry.js": function (require, module, exports) {
var DOM, IS, Popup, QuickPopup, defaults, extend, newBuilder, templates;

DOM = require("../node_modules/quickdom/src/index.coffee");

extend = require("../node_modules/smart-extend/src/index.coffee");

Popup = require("popup.coffee");

IS = require("checks.coffee");

defaults = require("defaults.coffee");

templates = require("template.coffee");

var __templatecoffee = require("template.coffee"), htmlTemplate = __templatecoffee.html;;

newBuilder = function(defaults, templates) {
  var builder;
  builder = function(arg) {
    var args;
    args = arguments;
    switch (false) {
      case arguments.length !== 0:
        return new Popup(null, defaults, templates);
      case typeof arg !== 'string':
        return new Popup({
          content: htmlTemplate.spawn({
            data: {
              html: arg
            }
          })
        }, defaults, templates);
      case !DOM.isEl(arg):
      case !DOM.isQuickEl(arg):
        return new Popup({
          content: arg
        }, defaults, templates);
      case !DOM.isTemplate(arg):
        return new Popup({
          content: arg.spawn()
        }, defaults, templates);
      case !(arg && typeof arg === 'object'):
        return new Popup(arg, defaults, templates);
      default:
        throw new Error('invalid argument provided to QuickPopup');
    }
  };
  builder.config = function(newSettings, newTemplates) {
    var name, outputSettings, outputTemplates, template;
    if (!IS.object(newSettings)) {
      throw new Error("QuickPopup Config: invalid config object provided " + (String(newSettings)));
    }
    outputSettings = extend.clone.deep(defaults, newSettings);
    if (!IS.object(newTemplates)) {
      outputTemplates = templates;
    } else {
      outputTemplates = Object.create(null);
      for (name in templates) {
        template = templates[name];
        if (newTemplates[name]) {
          outputTemplates[name] = template.extend(newTemplates[name]);
        } else {
          outputTemplates[name] = template;
        }
      }
    }
    return newBuilder(outputSettings, outputTemplates);
  };
  builder.wrapBody = function() {
    return Popup.wrapBody();
  };
  builder.unwrapBody = function() {
    return Popup.unwrapBody();
  };
  builder.destroyAll = function() {
    return Popup.destroyAll();
  };
  builder.version = "1.0.0";
  builder.defaults = defaults;
  builder.templates = templates;
  return builder;
};

QuickPopup = newBuilder(defaults, templates);

module.exports = QuickPopup;

;
return module.exports;
},
"../node_modules/quickdom/src/index.coffee": function (require, module, exports) {
var QuickDom, svgNamespace;

svgNamespace = 'http://www.w3.org/2000/svg';


/* istanbul ignore next */

var CSS = require("../node_modules/quickcss/src/index.coffee");


/* istanbul ignore next */

var extend = require("../node_modules/smart-extend/src/index.coffee");

var allowedOptions, allowedTemplateOptions;
 
 allowedTemplateOptions = ['id', 'name', 'type', 'href', 'selected', 'checked', 'className'];
 
 allowedOptions = ['id', 'ref', 'type', 'name', 'text', 'style', 'class', 'className', 'url', 'href', 'selected', 'checked', 'props', 'attrs', 'passStateToChildren', 'stateTriggers'];
 
 ;

var helpers, styleCache;

helpers = {};

helpers.includes = function(target, item) {
  return target && target.indexOf(item) !== -1;
};

helpers.removeItem = function(target, item) {
  var itemIndex;
  itemIndex = target.indexOf(item);
  if (itemIndex !== -1) {
    target.splice(itemIndex, 1);
  }
  return target;
};

helpers.normalizeGivenEl = function(targetEl) {
  switch (false) {
    case !IS.string(targetEl):
      return QuickDom.text(targetEl);
    case !IS.domNode(targetEl):
      return QuickDom(targetEl);
    case !IS.template(targetEl):
      return targetEl.spawn();
    default:
      return targetEl;
  }
};

helpers.isStateStyle = function(string) {
  return string[0] === '$' || string[0] === '@';
};

helpers.registerStyle = function(rule, level, important) {
  var cached, i, len, output, prop, props;
  level || (level = 0);
  cached = styleCache.get(rule, level);
  if (cached) {
    return cached;
  }
  output = {
    className: [CSS.register(rule, level, important)],
    fns: [],
    rule: rule
  };
  props = Object.keys(rule);
  for (i = 0, len = props.length; i < len; i++) {
    prop = props[i];
    if (typeof rule[prop] === 'function') {
      output.fns.push([prop, rule[prop]]);
    }
  }
  return styleCache.set(rule, output, level);
};

styleCache = new ((function() {
  function _Class() {
    this.keys = Object.create(null);
    this.values = Object.create(null);
  }

  _Class.prototype.get = function(key, level) {
    var index;
    if (this.keys[level]) {
      index = this.keys[level].indexOf(key);
      if (index !== -1) {
        return this.values[level][index];
      }
    }
  };

  _Class.prototype.set = function(key, value, level) {
    if (!this.keys[level]) {
      this.keys[level] = [];
      this.values[level] = [];
    }
    this.keys[level].push(key);
    this.values[level].push(value);
    return value;
  };

  return _Class;

})());

;

var IS;

IS = require("../node_modules/@danielkalen/is/src/index.coffee");

IS = IS.create('natives', 'dom');

IS.load({
  quickDomEl: function(subject) {
    return subject && subject.constructor.name === QuickElement.name;
  },
  template: function(subject) {
    return subject && subject.constructor.name === QuickTemplate.name;
  }
});

;

var QuickElement;

QuickElement = (function() {
  function QuickElement(type, options) {
    this.type = type;
    this.options = options;
    if (this.type[0] === '*') {
      this.svg = true;
    }
    this.el = this.options.existing || (this.type === 'text' ? document.createTextNode(typeof this.options.text === 'string' ? this.options.text : '') : this.svg ? document.createElementNS(svgNamespace, this.type.slice(1)) : document.createElement(this.type));
    if (this.type === 'text') {
      this.append = this.prepend = this.attr = function() {};
    }
    this._parent = null;
    this._styles = {};
    this._state = [];
    this._children = [];
    this._normalizeOptions();
    this._applyOptions();
    this._attachStateEvents();
    this._proxyParent();
    if (this.options.existing) {
      this._refreshParent();
    }
    this.el._quickElement = this;
  }

  QuickElement.prototype.toJSON = function() {
    var child, children, i, len, output;
    output = [this.type, extend.clone.keys(allowedOptions)(this.options)];
    children = this.children;
    for (i = 0, len = children.length; i < len; i++) {
      child = children[i];
      output.push(child.toJSON());
    }
    return output;
  };

  return QuickElement;

})();


/* istanbul ignore next */

if (QuickElement.name == null) {
  QuickElement.name = 'QuickElement';
}

Object.defineProperties(QuickElement.prototype, {
  'raw': {
    get: function() {
      return this.el;
    }
  },
  '0': {
    get: function() {
      return this.el;
    }
  },
  'css': {
    get: function() {
      return this.style;
    }
  },
  'replaceWith': {
    get: function() {
      return this.replace;
    }
  },
  'removeListener': {
    get: function() {
      return this.off;
    }
  }
});

;

var _getChildRefs, _getIndexByProp, _getParents;

QuickElement.prototype.parentsUntil = function(filter) {
  return _getParents(this, filter);
};

QuickElement.prototype.parentMatching = function(filter) {
  var isRef, nextParent;
  if (IS["function"](filter) || (isRef = IS.string(filter))) {
    nextParent = this.parent;
    while (nextParent) {
      if (isRef) {
        if (nextParent.ref === filter) {
          return nextParent;
        }
      } else {
        if (filter(nextParent)) {
          return nextParent;
        }
      }
      nextParent = nextParent.parent;
    }
  }
};

QuickElement.prototype.query = function(selector) {
  return QuickDom(this.raw.querySelector(selector));
};

QuickElement.prototype.queryAll = function(selector) {
  var i, item, len, output, result;
  result = this.raw.querySelectorAll(selector);
  output = [];
  for (i = 0, len = result.length; i < len; i++) {
    item = result[i];
    output.push(item);
  }
  return new QuickBatch(output);
};

Object.defineProperties(QuickElement.prototype, {
  'children': {
    get: function() {
      var child, i, len, ref1;
      if (this.el.childNodes.length !== this._children.length) {
        this._children.length = 0;
        ref1 = this.el.childNodes;
        for (i = 0, len = ref1.length; i < len; i++) {
          child = ref1[i];
          if (child.nodeType < 4) {
            this._children.push(QuickDom(child));
          }
        }
      }
      return this._children;
    }
  },
  'parent': {
    get: function() {
      if ((!this._parent || this._parent.el !== this.el.parentNode) && !IS.domDoc(this.el.parentNode)) {
        this._parent = QuickDom(this.el.parentNode);
      }
      return this._parent;
    }
  },
  'parents': {
    get: function() {
      return _getParents(this);
    }
  },
  'next': {
    get: function() {
      return QuickDom(this.el.nextSibling);
    }
  },
  'prev': {
    get: function() {
      return QuickDom(this.el.previousSibling);
    }
  },
  'nextAll': {
    get: function() {
      var nextSibling, siblings;
      siblings = [];
      nextSibling = QuickDom(this.el.nextSibling);
      while (nextSibling) {
        siblings.push(nextSibling);
        nextSibling = nextSibling.next;
      }
      return siblings;
    }
  },
  'prevAll': {
    get: function() {
      var prevSibling, siblings;
      siblings = [];
      prevSibling = QuickDom(this.el.previousSibling);
      while (prevSibling) {
        siblings.push(prevSibling);
        prevSibling = prevSibling.prev;
      }
      return siblings;
    }
  },
  'siblings': {
    get: function() {
      return this.prevAll.reverse().concat(this.nextAll);
    }
  },
  'child': {
    get: function() {
      return this._childRefs || _getChildRefs(this);
    }
  },
  'childf': {
    get: function() {
      return _getChildRefs(this, true);
    }
  },
  'firstChild': {
    get: function() {
      return this.children[0];
    }
  },
  'lastChild': {
    get: function() {
      var children;
      children = this.children;
      return children[children.length - 1];
    }
  },
  'index': {
    get: function() {
      var parent;
      if (!(parent = this.parent)) {
        return null;
      } else {
        return parent.children.indexOf(this);
      }
    }
  },
  'indexType': {
    get: function() {
      return _getIndexByProp(this, 'type');
    }
  },
  'indexRef': {
    get: function() {
      return _getIndexByProp(this, 'ref');
    }
  }
});

_getParents = function(targetEl, filter) {
  var isRef, nextParent, parents;
  if (!IS["function"](filter) && !(isRef = IS.string(filter))) {
    filter = void 0;
  }
  parents = [];
  nextParent = targetEl.parent;
  while (nextParent) {
    parents.push(nextParent);
    nextParent = nextParent.parent;
    if (isRef) {
      if (nextParent && nextParent.ref === filter) {
        nextParent = null;
      }
    } else if (filter) {
      if (filter(nextParent)) {
        nextParent = null;
      }
    }
  }
  return parents;
};

_getChildRefs = function(target, freshCopy) {
  var child, childRefs, children, el, i, len, ref, refs;
  if (freshCopy || !target._childRefs) {
    target._childRefs = {};
  }
  refs = target._childRefs;
  if (target.ref) {
    refs[target.ref] = target;
  }
  children = target.children;
  if (children.length) {
    for (i = 0, len = children.length; i < len; i++) {
      child = children[i];
      childRefs = _getChildRefs(child, freshCopy);
      for (ref in childRefs) {
        el = childRefs[ref];
        refs[ref] || (refs[ref] = el);
      }
    }
  }
  return refs;
};

_getIndexByProp = function(main, prop) {
  var parent;
  if (!(parent = main.parent)) {
    return null;
  } else {
    return parent.children.filter(function(child) {
      return child[prop] === main[prop];
    }).indexOf(main);
  }
};

;

var baseStateTriggers;

baseStateTriggers = {
  'hover': {
    on: 'mouseenter',
    off: 'mouseleave',
    bubbles: true
  },
  'focus': {
    on: 'focus',
    off: 'blur',
    bubbles: true
  }
};

QuickElement.prototype._normalizeOptions = function() {
  var base1, base2, base3;
  if (this.options["class"]) {
    this.options.className = this.options["class"];
  }
  if (this.options.url) {
    this.options.href = this.options.url;
  }
  this.related = (base1 = this.options).relatedInstance != null ? base1.relatedInstance : base1.relatedInstance = this;
  if ((base2 = this.options).unpassableStates == null) {
    base2.unpassableStates = [];
  }
  if ((base3 = this.options).passStateToChildren == null) {
    base3.passStateToChildren = true;
  }
  this.options.stateTriggers = this.options.stateTriggers ? extend.clone.deep(baseStateTriggers, this.options.stateTriggers) : baseStateTriggers;
  if (this.type === 'text') {
    extend(this, this._parseTexts(this.options.text, this._texts));
  } else {
    extend(this, this._parseStyles(this.options.style, this._styles));
  }
};

QuickElement.prototype._parseStyles = function(styles, store) {
  var _mediaStates, _providedStates, _providedStatesShared, _stateShared, _styles, base, flattenNestedStates, forceStyle, i, keys, len, specialStates, state, stateStyles, state_, states;
  if (!IS.objectPlain(styles)) {
    return;
  }
  keys = Object.keys(styles);
  states = keys.filter(function(key) {
    return helpers.isStateStyle(key);
  });
  specialStates = helpers.removeItem(states.slice(), '$base');
  _mediaStates = states.filter(function(key) {
    return key[0] === '@';
  }).map(function(state) {
    return state.slice(1);
  });
  _providedStates = states.map(function(state) {
    return state.slice(1);
  });
  _styles = store || {};
  _stateShared = _providedStatesShared = void 0;
  base = !helpers.includes(states, '$base') ? styles : styles.$base;
  _styles.base = helpers.registerStyle(base, 0, forceStyle = this.options.forceStyle);
  if (specialStates.length) {
    flattenNestedStates = function(styleObject, chain, level) {
      var hasNonStateProps, i, len, output, state, stateChain, state_, styleKeys;
      styleKeys = Object.keys(styleObject);
      output = {};
      hasNonStateProps = false;
      for (i = 0, len = styleKeys.length; i < len; i++) {
        state = styleKeys[i];
        if (!helpers.isStateStyle(state)) {
          hasNonStateProps = true;
          output[state] = styleObject[state];
        } else {
          chain.push(state_ = state.slice(1));
          stateChain = new (require("../node_modules/quickdom/src/parts/element/stateChain.coffee"))(chain);
          if (_stateShared == null) {
            _stateShared = [];
          }
          if (_providedStatesShared == null) {
            _providedStatesShared = [];
          }
          _providedStatesShared.push(stateChain);
          if (state[0] === '@') {
            _mediaStates.push(state_);
          }
          _styles[stateChain.string] = helpers.registerStyle(flattenNestedStates(styleObject[state], chain, level + 1), level + 1, forceStyle);
        }
      }
      if (hasNonStateProps) {
        return output;
      }
    };
    for (i = 0, len = specialStates.length; i < len; i++) {
      state = specialStates[i];
      state_ = state.slice(1);
      stateStyles = flattenNestedStates(styles[state], [state_], 1);
      if (stateStyles) {
        _styles[state_] = helpers.registerStyle(stateStyles, 1);
      }
    }
  }
  return {
    _styles: _styles,
    _mediaStates: _mediaStates,
    _stateShared: _stateShared,
    _providedStates: _providedStates,
    _providedStatesShared: _providedStatesShared
  };
};

QuickElement.prototype._parseTexts = function(texts, store) {
  var _providedStates, _texts, i, len, state, states;
  if (!IS.objectPlain(texts)) {
    return;
  }
  states = Object.keys(texts).map(function(state) {
    return state.slice(1);
  });
  _providedStates = states.filter(function(state) {
    return state !== 'base';
  });
  _texts = store || {};
  _texts = {
    base: ''
  };
  for (i = 0, len = states.length; i < len; i++) {
    state = states[i];
    _texts[state] = texts['$' + state];
  }
  return {
    _texts: _texts,
    _providedStates: _providedStates
  };
};

QuickElement.prototype._applyOptions = function() {
  var event, handler, key, method, ref, ref1, ref2, ref3, ref4, value;
  if (ref = this.options.id || this.options.ref) {
    this.attr('data-ref', this.ref = ref);
  }
  if (this.options.id) {
    this.el.id = this.options.id;
  }
  if (this.options.className) {
    this.el.className = this.options.className;
  }
  if (this.options.src) {
    this.el.src = this.options.src;
  }
  if (this.options.href) {
    this.el.href = this.options.href;
  }
  if (this.options.type) {
    this.el.type = this.options.type;
  }
  if (this.options.name) {
    this.el.name = this.options.name;
  }
  if (this.options.value) {
    this.el.value = this.options.value;
  }
  if (this.options.selected) {
    this.el.selected = this.options.selected;
  }
  if (this.options.checked) {
    this.el.checked = this.options.checked;
  }
  if (this.options.props) {
    ref1 = this.options.props;
    for (key in ref1) {
      value = ref1[key];
      this.prop(key, value);
    }
  }
  if (this.options.attrs) {
    ref2 = this.options.attrs;
    for (key in ref2) {
      value = ref2[key];
      this.attr(key, value);
    }
  }
  this._applyRegisteredStyle(this._styles.base, null, null, this.options.styleAfterInsert);
  if (this._texts) {
    this.text = this._texts.base;
  }
  this.on('inserted', function() {
    var _, mediaStates;
    if (this.options.styleAfterInsert) {
      this.recalcStyle();
    }
    _ = this._inserted = this;
    if ((mediaStates = this._mediaStates) && this._mediaStates.length) {
      return this._mediaStates = new function() {
        var i, len, queryString;
        for (i = 0, len = mediaStates.length; i < len; i++) {
          queryString = mediaStates[i];
          this[queryString] = MediaQuery.register(_, queryString);
        }
        return this;
      };
    }
  }, false, true);
  if (this.options.recalcOnResize) {
    window.addEventListener('resize', (function(_this) {
      return function() {
        return _this.recalcStyle();
      };
    })(this));
  }
  if (this.options.events) {
    ref3 = this.options.events;
    for (event in ref3) {
      handler = ref3[event];
      this.on(event, handler);
    }
  }
  if (this.options.methods) {
    ref4 = this.options.methods;
    for (method in ref4) {
      value = ref4[method];
      if (!this[method]) {
        if (IS["function"](value)) {
          this[method] = value;
        } else if (IS.object(value)) {
          Object.defineProperty(this, method, {
            configurable: true,
            get: value.get,
            set: value.set
          });
        }
      }
    }
  }
};

QuickElement.prototype._attachStateEvents = function(force) {
  var fn, ref1, state, trigger;
  ref1 = this.options.stateTriggers;
  fn = (function(_this) {
    return function(state, trigger) {
      var disabler, enabler;
      if (!helpers.includes(_this._providedStates, state) && !force && !trigger.force) {
        return;
      }
      enabler = IS.string(trigger) ? trigger : trigger.on;
      if (IS.object(trigger)) {
        disabler = trigger.off;
      }
      _this._listenTo(enabler, function() {
        return _this.state(state, true, trigger.bubbles);
      });
      if (disabler) {
        return _this._listenTo(disabler, function() {
          return _this.state(state, false, trigger.bubbles);
        });
      }
    };
  })(this);
  for (state in ref1) {
    trigger = ref1[state];
    fn(state, trigger);
  }
};

QuickElement.prototype._proxyParent = function() {
  var parent;
  parent = void 0;
  return Object.defineProperty(this, '_parent', {
    get: function() {
      return parent;
    },
    set: function(newParent) {
      var lastParent;
      if (parent = newParent) {
        lastParent = this.parents.slice(-1)[0];
        if (lastParent.raw === document.documentElement) {
          this._unproxyParent(newParent);
        } else {
          parent.on('inserted', (function(_this) {
            return function() {
              if (parent === newParent) {
                return _this._unproxyParent(newParent);
              }
            };
          })(this));
        }
      }
    }
  });
};

QuickElement.prototype._unproxyParent = function(newParent) {
  delete this._parent;
  this._parent = newParent;
  this.emitPrivate('inserted', newParent);
};

;

var regexWhitespace;

regexWhitespace = /\s+/;

QuickElement.prototype.on = function(eventNames, callback, useCapture, isPrivate) {
  var callbackRef, split;
  if (this._eventCallbacks == null) {
    this._eventCallbacks = {
      __refs: {}
    };
  }
  if (IS.string(eventNames) && IS["function"](callback)) {
    split = eventNames.split('.');
    callbackRef = split[1];
    eventNames = split[0];
    if (eventNames === 'inserted' && this._inserted) {
      callback.call(this, this._parent);
      return this;
    }
    eventNames.split(regexWhitespace).forEach((function(_this) {
      return function(eventName) {
        if (!_this._eventCallbacks[eventName]) {
          _this._eventCallbacks[eventName] = [];
          if (!isPrivate) {
            _this._listenTo(eventName, function(event) {
              return _this._invokeHandlers(eventName, event);
            }, useCapture);
          }
        }
        if (callbackRef) {
          _this._eventCallbacks.__refs[callbackRef] = callback;
        }
        return _this._eventCallbacks[eventName].push(callback);
      };
    })(this));
  }
  return this;
};

QuickElement.prototype.once = function(eventNames, callback) {
  var onceCallback;
  if (IS.string(eventNames) && IS["function"](callback)) {
    this.on(eventNames, onceCallback = (function(_this) {
      return function(event) {
        _this.off(eventNames, onceCallback);
        return callback.call(_this, event);
      };
    })(this));
  }
  return this;
};

QuickElement.prototype.off = function(eventNames, callback) {
  var callbackRef, eventName, split;
  if (this._eventCallbacks == null) {
    this._eventCallbacks = {
      __refs: {}
    };
  }
  if (!IS.string(eventNames)) {
    for (eventName in this._eventCallbacks) {
      this.off(eventName);
    }
  } else {
    split = eventNames.split('.');
    callbackRef = split[1];
    eventNames = split[0];
    eventNames.split(regexWhitespace).forEach((function(_this) {
      return function(eventName) {
        if (_this._eventCallbacks[eventName]) {
          if (callback == null) {
            callback = _this._eventCallbacks.__refs[callbackRef];
          }
          if (IS["function"](callback)) {
            return helpers.removeItem(_this._eventCallbacks[eventName], callback);
          } else if (!callbackRef) {
            return _this._eventCallbacks[eventName].length = 0;
          }
        }
      };
    })(this));
  }
  return this;
};

QuickElement.prototype.emit = function(eventName, bubbles, cancelable) {
  var event;
  if (bubbles == null) {
    bubbles = true;
  }
  if (cancelable == null) {
    cancelable = true;
  }
  if (eventName && IS.string(eventName)) {
    event = document.createEvent('Event');
    event.initEvent(eventName, bubbles, cancelable);
    this.el.dispatchEvent(event);
  }
  return this;
};

QuickElement.prototype.emitPrivate = function(eventName, arg) {
  var ref;
  if (eventName && IS.string(eventName) && ((ref = this._eventCallbacks) != null ? ref[eventName] : void 0)) {
    this._invokeHandlers(eventName, arg);
  }
  return this;
};

QuickElement.prototype._invokeHandlers = function(eventName, arg) {
  var callbacks, cb, i, len;
  callbacks = this._eventCallbacks[eventName].slice();
  for (i = 0, len = callbacks.length; i < len; i++) {
    cb = callbacks[i];
    cb.call(this, arg);
  }
};


/* istanbul ignore next */

QuickElement.prototype._listenTo = function(eventName, callback, useCapture) {
  var eventNameToListenFor, listenMethod;
  listenMethod = this.el.addEventListener ? 'addEventListener' : 'attachEvent';
  eventNameToListenFor = this.el.addEventListener ? eventName : "on" + eventName;
  this.el[listenMethod](eventNameToListenFor, callback, useCapture);
  return this;
};

;

var DUMMY_ARRAY;

DUMMY_ARRAY = [];

QuickElement.prototype.state = function(targetState, value, bubbles, source) {
  var activeStates, child, desiredValue, i, j, key, keys, len, prop, ref, toggle;
  if (arguments.length === 1) {
    if (IS.string(targetState)) {
      return helpers.includes(this._state, targetState);
    } else if (IS.object(targetState)) {
      keys = Object.keys(targetState);
      i = -1;
      while (key = keys[++i]) {
        this.state(key, targetState[key]);
      }
      return this;
    }
  } else if (this._statePipeTarget && source !== this) {
    this._statePipeTarget.state(targetState, value, bubbles, this);
    return this;
  } else if (IS.string(targetState)) {
    if (targetState[0] === '$') {
      targetState = targetState.slice(1);
    }
    if (targetState === 'base') {
      return this;
    }
    desiredValue = !!value;
    activeStates = this._getActiveStates(targetState, false);
    if (this.state(targetState) !== desiredValue) {
      prop = this.type === 'text' ? 'Text' : 'Style';
      if (desiredValue) {
        this._state.push(targetState);
        toggle = 'ON';
      } else {
        helpers.removeItem(this._state, targetState);
        toggle = 'OFF';
      }
      this['_turn' + prop + toggle](targetState, activeStates);
      this.emitPrivate("stateChange:" + targetState, desiredValue);
    }
    if (!helpers.includes(this.options.unpassableStates, targetState)) {
      if (bubbles) {
        if (this.parent) {
          this._parent.state(targetState, value, true, source || this);
        }
      } else if (this.options.passStateToChildren) {
        ref = this._children;
        for (j = 0, len = ref.length; j < len; j++) {
          child = ref[j];
          child.state(targetState, value, false, source || this);
        }
      }
    }
    return this;
  }
};

QuickElement.prototype.resetState = function() {
  var activeState, j, len, ref;
  ref = this._state.slice();
  for (j = 0, len = ref.length; j < len; j++) {
    activeState = ref[j];
    this.state(activeState, false);
  }
  return this;
};

QuickElement.prototype.pipeState = function(targetEl) {
  var activeState, j, len, ref;
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl) && targetEl !== this) {
      this._statePipeTarget = targetEl;
      ref = this._state;
      for (j = 0, len = ref.length; j < len; j++) {
        activeState = ref[j];
        targetEl.state(activeState, true);
      }
    }
  } else if (targetEl === false) {
    delete this._statePipeTarget;
  }
  return this;
};

QuickElement.prototype._applyRegisteredStyle = function(targetStyle, superiorStates, includeBase, skipFns) {
  var className, entry, j, k, len, len1, ref, ref1, superiorStyles;
  if (targetStyle) {
    ref = targetStyle.className;
    for (j = 0, len = ref.length; j < len; j++) {
      className = ref[j];
      this.addClass(className);
    }
    if (targetStyle.fns.length && !skipFns) {
      if (superiorStates) {
        superiorStyles = this._resolveFnStyles(superiorStates, includeBase);
      }
      ref1 = targetStyle.fns;
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        entry = ref1[k];
        if (!(superiorStyles && superiorStyles[entry[0]])) {
          this.style(entry[0], entry[1]);
        }
      }
    }
  }
};

QuickElement.prototype._removeRegisteredStyle = function(targetStyle, superiorStates, includeBase) {
  var className, entry, j, k, len, len1, ref, ref1, resetValue, superiorStyles;
  ref = targetStyle.className;
  for (j = 0, len = ref.length; j < len; j++) {
    className = ref[j];
    this.removeClass(className);
  }
  if (targetStyle.fns.length) {
    if (superiorStates) {
      superiorStyles = this._resolveFnStyles(superiorStates, includeBase);
    }
    ref1 = targetStyle.fns;
    for (k = 0, len1 = ref1.length; k < len1; k++) {
      entry = ref1[k];
      resetValue = superiorStyles && superiorStyles[entry[0]] || null;
      this.style(entry[0], resetValue);
    }
  }
};

QuickElement.prototype._turnStyleON = function(targetState, activeStates) {
  var j, len, sharedStates, skipFns, stateChain;
  skipFns = this.options.styleAfterInsert && !this._inserted;
  if (this._styles[targetState]) {
    this._applyRegisteredStyle(this._styles[targetState], this._getSuperiorStates(targetState, activeStates), false, skipFns);
  }
  if (this._providedStatesShared) {
    sharedStates = this._getSharedStates(targetState);
    for (j = 0, len = sharedStates.length; j < len; j++) {
      stateChain = sharedStates[j];
      if (!helpers.includes(this._stateShared, stateChain.string)) {
        this._stateShared.push(stateChain.string);
      }
      this._applyRegisteredStyle(this._styles[stateChain.string], null, null, skipFns);
    }
  }
};

QuickElement.prototype._turnStyleOFF = function(targetState, activeStates) {
  var activeSharedStates, j, len, sharedStates, stateChain, targetStyle;
  if (this._styles[targetState]) {
    this._removeRegisteredStyle(this._styles[targetState], activeStates, true);
  }
  if (this._providedStatesShared) {
    sharedStates = this._getSharedStates(targetState);
    if (sharedStates.length === 0) {
      return;
    }
    for (j = 0, len = sharedStates.length; j < len; j++) {
      stateChain = sharedStates[j];
      helpers.removeItem(this._stateShared, stateChain.string);
      targetStyle = this._styles[stateChain.string];
      if (targetStyle.fns.length && this._stateShared.length && !activeSharedStates) {
        activeSharedStates = this._stateShared.filter(function(state) {
          return !helpers.includes(state, targetState);
        });
        activeStates = activeStates.concat(activeSharedStates);
      }
      this._removeRegisteredStyle(targetStyle, activeStates, true);
    }
  }
};

QuickElement.prototype._turnTextON = function(targetState, activeStates) {
  var superiorStates, targetText;
  if (this._texts && IS.string(targetText = this._texts[targetState])) {
    superiorStates = this._getSuperiorStates(targetState, activeStates);
    if (!superiorStates.length) {
      this.text = targetText;
    }
  }
};

QuickElement.prototype._turnTextOFF = function(targetState, activeStates) {
  var targetText;
  if (this._texts && IS.string(targetText = this._texts[targetState])) {
    activeStates = activeStates.filter(function(state) {
      return state !== targetState;
    });
    targetText = this._texts[activeStates[activeStates.length - 1]];
    if (targetText == null) {
      targetText = this._texts.base;
    }
    this.text = targetText;
  }
};

QuickElement.prototype._getActiveStates = function(stateToExclude, includeSharedStates) {
  var activeStates, j, len, plainStates, state;
  if (includeSharedStates == null) {
    includeSharedStates = true;
  }
  if (!this._providedStates) {
    return DUMMY_ARRAY;
  }
  activeStates = plainStates = this._state;
  if (stateToExclude) {
    plainStates = [];
    for (j = 0, len = activeStates.length; j < len; j++) {
      state = activeStates[j];
      if (state !== stateToExclude) {
        plainStates.push(state);
      }
    }
  }
  if (!includeSharedStates || !this._providedStatesShared) {
    return plainStates;
  } else {
    return plainStates.concat(this._stateShared);
  }
};

QuickElement.prototype._getSuperiorStates = function(targetState, activeStates) {
  var candidate, j, len, superior, targetStateIndex;
  targetStateIndex = this._providedStates.indexOf(targetState);
  if (targetStateIndex === this._providedStates.length - 1) {
    return DUMMY_ARRAY;
  }
  superior = [];
  for (j = 0, len = activeStates.length; j < len; j++) {
    candidate = activeStates[j];
    if (this._providedStates.indexOf(candidate) > targetStateIndex) {
      superior.push(candidate);
    }
  }
  return superior;
};

QuickElement.prototype._getSharedStates = function(targetState) {
  var activeStates, j, len, ref, sharedStates, stateChain;
  activeStates = this._state;
  sharedStates = [];
  ref = this._providedStatesShared;
  for (j = 0, len = ref.length; j < len; j++) {
    stateChain = ref[j];
    if (stateChain.includes(targetState) && stateChain.isApplicable(targetState, activeStates)) {
      sharedStates.push(stateChain);
    }
  }
  return sharedStates;
};

QuickElement.prototype._resolveFnStyles = function(states, includeBase) {
  var entry, j, k, len, len1, output, ref, state;
  if (includeBase) {
    states = ['base'].concat(states);
  }
  output = {};
  for (j = 0, len = states.length; j < len; j++) {
    state = states[j];
    if (this._styles[state] && this._styles[state].fns.length) {
      ref = this._styles[state].fns;
      for (k = 0, len1 = ref.length; k < len1; k++) {
        entry = ref[k];
        output[entry[0]] = entry[1];
      }
    }
  }
  return output;
};

;


/**
 * Sets/gets the value of a style property. In getter mode the computed property of
 * the style will be returned unless the element is not inserted into the DOM. In
 * webkit browsers all computed properties of a detached node are always an empty
 * string but in gecko they reflect on the actual computed value, hence we need
 * to "normalize" this behavior and make sure that even on gecko an empty string
 * is returned
 * @return {[type]} [description]
 */
var aspectRatioGetter, orientationGetter;

QuickElement.prototype.style = function(property) {
  var args, i, key, keys, result, value;
  if (this.type === 'text') {
    return;
  }
  args = arguments;
  if (IS.string(property)) {
    value = typeof args[1] === 'function' ? args[1].call(this, this.related) : args[1];
    if (args[1] === null && IS.defined(this.currentStateStyle(property)) && !IS["function"](this.currentStateStyle(property))) {
      value = CSS.UNSET;
    }
    result = CSS(this.el, property, value, this.options.forceStyle);
    if (args.length === 1) {

      /* istanbul ignore next */
      if (this._inserted) {
        return result;
      } else if (!result) {
        return result;
      } else {
        return '';
      }
    }
  } else if (IS.object(property)) {
    keys = Object.keys(property);
    i = -1;
    while (key = keys[++i]) {
      this.style(key, property[key]);
    }
  }
  return this;
};


/**
 * Attempts to resolve the value for a given property in the following order if each one isn't a valid value:
 * 1. from computed style (for dom-inserted els)
 * 2. from DOMElement.style object (for non-inserted els; if options.styleAfterInsert, will only have state styles)
 * 3. from provided style options
 * (for non-inserted els; checking only $base since state styles will always be applied to the style object even for non-inserted)
 */

QuickElement.prototype.styleSafe = function(property, skipComputed) {
  var computed, result, sample;
  if (this.type === 'text') {
    return;
  }
  sample = this.el.style[property];
  if (IS.string(sample) || IS.number(sample)) {
    computed = skipComputed ? 0 : this.style(property);
    result = computed || this.el.style[property] || this.currentStateStyle(property) || '';
    if (typeof result === 'function') {
      return result.call(this, this.related);
    } else {
      return result;
    }
  }
  return this;
};

QuickElement.prototype.styleParsed = function(property, skipComputed) {
  return parseFloat(this.styleSafe(property, skipComputed));
};

QuickElement.prototype.recalcStyle = function(recalcChildren) {
  var child, j, len, ref, targetStyles;
  targetStyles = this._resolveFnStyles(this._getActiveStates(), true);
  this.style(targetStyles);
  if (recalcChildren) {
    ref = this._children;
    for (j = 0, len = ref.length; j < len; j++) {
      child = ref[j];
      child.recalcStyle();
    }
  }
  return this;
};

QuickElement.prototype.currentStateStyle = function(property) {
  var i, state, states;
  if (property) {
    if (this._state.length) {
      states = this._state.slice();
      if (this._stateShared && this._stateShared.length) {
        states.push.apply(states, this._stateShared);
      }
      i = states.length;
      while (state = states[--i]) {
        if (this._styles[state] && IS.defined(this._styles[state].rule[property])) {
          return this._styles[state].rule[property];
        }
      }
    }
    if (this._styles.base) {
      return this._styles.base.rule[property];
    }
  }
};

QuickElement.prototype.hide = function() {
  return this.style('display', 'none');
};

QuickElement.prototype.show = function(display) {
  var ref;
  if (!display) {
    display = this.currentStateStyle('display');
    if (display === 'none' || !display) {
      display = 'block';
    }
  }
  if (display == null) {
    display = ((ref = this._styles.base) != null ? ref.display : void 0) || 'block';
  }
  return this.style('display', display);
};

Object.defineProperties(QuickElement.prototype, {
  'orientation': orientationGetter = {
    get: function() {
      if (this.width > this.height) {
        return 'landscape';
      } else {
        return 'portrait';
      }
    }
  },
  'aspectRatio': aspectRatioGetter = {
    get: function() {
      return this.width / this.height;
    }
  },
  'rect': {
    get: function() {
      return this.el.getBoundingClientRect();
    }
  },
  'width': {
    get: function() {
      return parseFloat(this.style('width'));
    },
    set: function(value) {
      return this.style('width', value);
    }
  },
  'height': {
    get: function() {
      return parseFloat(this.style('height'));
    },
    set: function(value) {
      return this.style('height', value);
    }
  }
});

;

QuickElement.prototype.attr = function(attrName, newValue) {
  switch (newValue) {
    case void 0:
      return this.el.getAttribute(attrName);
    case null:
      return this.el.removeAttribute(attrName);
    default:
      this.el.setAttribute(attrName, newValue);
      return this;
  }
};

QuickElement.prototype.prop = function(propName, newValue) {
  switch (newValue) {
    case void 0:
      return this.el[propName];
    default:
      this.el[propName] = newValue;
      return this;
  }
};

;

QuickElement.prototype.toTemplate = function() {
  return QuickDom.template(this);
};

QuickElement.prototype.clone = function() {
  var activeState, callback, callbacks, child, elClone, eventName, i, j, k, len, len1, len2, newEl, options, ref, ref1, ref2;
  elClone = this.el.cloneNode(false);
  options = extend.clone(this.options, {
    existing: elClone
  });
  newEl = new QuickElement(this.type, options);
  ref = this._state;
  for (i = 0, len = ref.length; i < len; i++) {
    activeState = ref[i];
    newEl.state(activeState, true);
  }
  ref1 = this.children;
  for (j = 0, len1 = ref1.length; j < len1; j++) {
    child = ref1[j];
    newEl.append(child.clone());
  }
  ref2 = this._eventCallbacks;
  for (eventName in ref2) {
    callbacks = ref2[eventName];
    for (k = 0, len2 = callbacks.length; k < len2; k++) {
      callback = callbacks[k];
      newEl.on(eventName, callback);
    }
  }
  return newEl;
};

QuickElement.prototype.append = function(targetEl) {
  var prevParent;
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl)) {
      prevParent = targetEl.parent;
      if (prevParent) {
        prevParent._removeChild(targetEl);
      }
      this._children.push(targetEl);
      this.el.appendChild(targetEl.el);
      targetEl._refreshParent();
    }
  }
  return this;
};

QuickElement.prototype.appendTo = function(targetEl) {
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl)) {
      targetEl.append(this);
    }
  }
  return this;
};

QuickElement.prototype.prepend = function(targetEl) {
  var prevParent;
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl)) {
      prevParent = targetEl.parent;
      if (prevParent) {
        prevParent._removeChild(targetEl);
      }
      this._children.unshift(targetEl);
      this.el.insertBefore(targetEl.el, this.el.firstChild);
      targetEl._refreshParent();
    }
  }
  return this;
};

QuickElement.prototype.prependTo = function(targetEl) {
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl)) {
      targetEl.prepend(this);
    }
  }
  return this;
};

QuickElement.prototype.after = function(targetEl) {
  var myIndex;
  if (targetEl && this.parent) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl)) {
      myIndex = this.parent._children.indexOf(this);
      this.parent._children.splice(myIndex + 1, 0, targetEl);
      this.el.parentNode.insertBefore(targetEl.el, this.el.nextSibling);
      targetEl._refreshParent();
    }
  }
  return this;
};

QuickElement.prototype.insertAfter = function(targetEl) {
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl)) {
      targetEl.after(this);
    }
  }
  return this;
};

QuickElement.prototype.before = function(targetEl) {
  var myIndex;
  if (targetEl && this.parent) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl)) {
      myIndex = this.parent._children.indexOf(this);
      this.parent._children.splice(myIndex, 0, targetEl);
      this.el.parentNode.insertBefore(targetEl.el, this.el);
      targetEl._refreshParent();
    }
  }
  return this;
};

QuickElement.prototype.insertBefore = function(targetEl) {
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl)) {
      targetEl.before(this);
    }
  }
  return this;
};

QuickElement.prototype.detach = function() {
  var ref;
  if ((ref = this.parent) != null) {
    ref._removeChild(this);
  }
  return this;
};

QuickElement.prototype.remove = function() {
  var eventName;
  this.detach();
  this.resetState();
  if (this._eventCallbacks) {
    for (eventName in this._eventCallbacks) {
      this._eventCallbacks[eventName].length = 0;
    }
  }
  return this;
};

QuickElement.prototype.empty = function() {
  var child, i, len, ref;
  ref = this.children.slice();
  for (i = 0, len = ref.length; i < len; i++) {
    child = ref[i];
    this._removeChild(child);
  }
  return this;
};

QuickElement.prototype.wrap = function(targetEl) {
  var currentParent;
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    currentParent = this.parent;
    if (IS.quickDomEl(targetEl) && targetEl !== this && targetEl !== this.parent) {
      if (currentParent) {
        currentParent._removeChild(this, !targetEl.parent ? targetEl : void 0);
      }
      targetEl.append(this);
    }
  }
  return this;
};

QuickElement.prototype.unwrap = function() {
  var grandParent, parent, parentChildren, parentSibling;
  parent = this.parent;
  if (parent) {
    parentChildren = QuickDom.batch(parent.children);
    parentSibling = parent.next;
    grandParent = parent.parent;
    if (grandParent) {
      parent.detach();
      if (parentSibling) {
        parentChildren.insertBefore(parentSibling);
      } else {
        parentChildren.appendTo(grandParent);
      }
    }
  }
  return this;
};

QuickElement.prototype.replace = function(targetEl) {
  var ref;
  if (targetEl) {
    targetEl = helpers.normalizeGivenEl(targetEl);
    if (IS.quickDomEl(targetEl) && targetEl !== this) {
      targetEl.detach();
      if ((ref = this.parent) != null) {
        ref._removeChild(this, targetEl);
      }
      targetEl._refreshParent();
    }
  }
  return this;
};

QuickElement.prototype.hasClass = function(target) {
  return helpers.includes(this.classList, target);
};

QuickElement.prototype.addClass = function(target) {
  var classList, targetIndex;
  classList = this.classList;
  targetIndex = classList.indexOf(target);
  if (targetIndex === -1) {
    classList.push(target);
    this.className = classList.length > 1 ? classList.join(' ') : classList[0];
  }
  return this;
};

QuickElement.prototype.removeClass = function(target) {
  var classList, targetIndex;
  classList = this.classList;
  targetIndex = classList.indexOf(target);
  if (targetIndex !== -1) {
    classList.splice(targetIndex, 1);
    this.className = classList.length ? classList.join(' ') : '';
  }
  return this;
};

QuickElement.prototype.toggleClass = function(target) {
  if (this.hasClass(target)) {
    this.removeClass(target);
  } else {
    this.addClass(target);
  }
  return this;
};

QuickElement.prototype._refreshParent = function() {
  return this.parent;
};

QuickElement.prototype._removeChild = function(targetChild, replacementChild) {
  var indexOfChild;
  indexOfChild = this.children.indexOf(targetChild);
  if (indexOfChild !== -1) {
    if (replacementChild) {
      this.el.replaceChild(replacementChild.el, targetChild.el);
      this._children.splice(indexOfChild, 1, replacementChild);
    } else {
      this.el.removeChild(targetChild.el);
      this._children.splice(indexOfChild, 1);
    }
  }
  return this;
};

Object.defineProperties(QuickElement.prototype, {
  'html': {
    get: function() {
      return this.el.innerHTML;
    },
    set: function(newValue) {
      return this.el.innerHTML = newValue;
    }
  },
  'text': {
    get: function() {
      return this.el.textContent;
    },
    set: function(newValue) {
      return this.el.textContent = newValue;
    }
  },
  'className': {
    get: function() {
      if (this.svg) {
        return this.attr('class') || '';
      } else {
        return this.raw.className;
      }
    },
    set: function(newValue) {
      if (this.svg) {
        return this.attr('class', newValue);
      } else {
        return this.raw.className = newValue;
      }
    }
  },
  'classList': {
    get: function() {
      var list;
      list = this.className.split(/\s+/);
      if (list[list.length - 1] === '') {
        list.pop();
      }
      if (list[0] === '') {
        list.shift();
      }
      return list;
    }
  }
});

;

QuickElement.prototype.updateOptions = function(options) {
  if (IS.object(options)) {
    this.options = options;
    this._normalizeOptions();
    this._applyOptions(this.options);
  }
  return this;
};

QuickElement.prototype.updateStateStyles = function(styles) {
  var i, len, parsed, state, updatedStates;
  if (IS.objectPlain(styles)) {
    extend.deep.concat(this, parsed = this._parseStyles(styles));
    if (parsed._styles) {
      updatedStates = Object.keys(parsed._styles);
      for (i = 0, len = updatedStates.length; i < len; i++) {
        state = updatedStates[i];
        if (this.state(state) || state === 'base') {
          this._applyRegisteredStyle(this._styles[state], this._getActiveStates(state), false);
        }
      }
    }
  }
  return this;
};

QuickElement.prototype.updateStateTexts = function(texts) {
  var parsed;
  if (IS.objectPlain(texts)) {
    extend.deep.concat(this, parsed = this._parseTexts(texts));
  }
  return this;
};

QuickElement.prototype.applyData = function(data) {
  var child, computers, defaults, i, j, key, keys, len, len1, ref;
  if (computers = this.options.computers) {
    defaults = this.options.defaults;
    keys = Object.keys(computers);
    for (i = 0, len = keys.length; i < len; i++) {
      key = keys[i];
      if (data && data.hasOwnProperty(key)) {
        this._runComputer(key, data[key]);
      } else if (defaults && defaults.hasOwnProperty(key)) {
        this._runComputer(key, defaults[key]);
      }
    }
  }
  ref = this._children;
  for (j = 0, len1 = ref.length; j < len1; j++) {
    child = ref[j];
    child.applyData(data);
  }
};

QuickElement.prototype._runComputer = function(computer, arg) {
  return this.options.computers[computer].call(this, arg);
};

;

;

var QuickWindow;

QuickWindow = {
  type: 'window',
  el: window,
  raw: window,
  _eventCallbacks: {
    __refs: {}
  }
};

QuickWindow.on = QuickElement.prototype.on;

QuickWindow.off = QuickElement.prototype.off;

QuickWindow.emit = QuickElement.prototype.emit;

QuickWindow.emitPrivate = QuickElement.prototype.emitPrivate;

QuickWindow._listenTo = QuickElement.prototype._listenTo;

QuickWindow._invokeHandlers = QuickElement.prototype._invokeHandlers;

Object.defineProperties(QuickWindow, {
  'width': {
    get: function() {
      return window.innerWidth;
    }
  },
  'height': {
    get: function() {
      return window.innerHeight;
    }
  },
  'orientation': orientationGetter,
  'aspectRatio': aspectRatioGetter
});

;

var MediaQuery, ruleDelimiter;

MediaQuery = new function() {
  var callbacks, testRule;
  callbacks = [];
  window.addEventListener('resize', function() {
    var callback, i, len;
    for (i = 0, len = callbacks.length; i < len; i++) {
      callback = callbacks[i];
      callback();
    }
  });
  this.parseQuery = function(target, queryString) {
    var querySplit, rules, source;
    querySplit = queryString.split('(');
    source = querySplit[0];
    source = (function() {
      switch (source) {
        case 'window':
          return QuickWindow;
        case 'parent':
          return target.parent;
        case 'self':
          return target;
        default:
          return target.parentMatching(function(parent) {
            return parent.ref === source.slice(1);
          });
      }
    })();
    rules = querySplit[1].slice(0, -1).split(ruleDelimiter).map(function(rule) {
      var getter, key, keyPrefix, max, min, split, value;
      split = rule.split(':');
      value = parseFloat(split[1]);
      if (isNaN(value)) {
        value = split[1];
      }
      key = split[0];
      keyPrefix = key.slice(0, 4);
      max = keyPrefix === 'max-';
      min = !max && keyPrefix === 'min-';
      if (max || min) {
        key = key.slice(4);
      }
      getter = (function() {
        switch (key) {
          case 'orientation':
            return function() {
              return source.orientation;
            };
          case 'aspect-ratio':
            return function() {
              return source.aspectRatio;
            };
          case 'width':
          case 'height':
            return function() {
              return source[key];
            };
          default:
            return function() {
              var parsedValue, stringValue;
              stringValue = source.style(key);
              parsedValue = parseFloat(stringValue);
              if (isNaN(parsedValue)) {
                return stringValue;
              } else {
                return parsedValue;
              }
            };
        }
      })();
      return {
        key: key,
        value: value,
        min: min,
        max: max,
        getter: getter
      };
    });
    return {
      source: source,
      rules: rules
    };
  };
  this.register = function(target, queryString) {
    var callback, query;
    query = this.parseQuery(target, queryString);
    if (query.source) {
      callbacks.push(callback = function() {
        return testRule(target, query, queryString);
      });
      callback();
    }
    return query;
  };
  testRule = function(target, query, queryString) {
    var currentValue, i, len, passed, ref, rule;
    passed = true;
    ref = query.rules;
    for (i = 0, len = ref.length; i < len; i++) {
      rule = ref[i];
      currentValue = rule.getter();
      passed = (function() {
        switch (false) {
          case !rule.min:
            return currentValue >= rule.value;
          case !rule.max:
            return currentValue <= rule.value;
          default:
            return currentValue === rule.value;
        }
      })();
      if (!passed) {
        break;
      }
    }
    return target.state(queryString, passed);
  };
  return this;
};

ruleDelimiter = /,\s*/;

;

QuickDom = function() {
  var args, argsLength, child, children, element, i, j, len, options, type;
  args = arguments;
  switch (false) {
    case !IS.array(args[0]):
      return QuickDom.apply(null, args[0]);
    case !IS.template(args[0]):
      return args[0].spawn();
    case !IS.quickDomEl(args[0]):
      if (args[1]) {
        return args[0].updateOptions(args[1]);
      } else {
        return args[0];
      }
    case !(IS.domNode(args[0]) || IS.domDoc(args[0])):
      if (args[0]._quickElement) {
        return args[0]._quickElement;
      }
      type = args[0].nodeName.toLowerCase().replace('#', '');
      options = args[1] || {};
      options.existing = args[0];
      return new QuickElement(type, options);
    case args[0] !== window:
      return QuickWindow;
    case !IS.string(args[0]):
      type = args[0].toLowerCase();
      if (type === 'text') {
        options = IS.object(args[1]) ? args[1] : {
          text: args[1] || ''
        };
      } else {
        options = IS.object(args[1]) ? args[1] : {};
      }
      element = new QuickElement(type, options);
      if (args.length > 2) {
        children = [];
        i = 1;
        argsLength = args.length;
        while (++i < argsLength) {
          children.push(args[i]);
        }
        for (j = 0, len = children.length; j < len; j++) {
          child = children[j];
          if (IS.string(child)) {
            child = QuickDom.text(child);
          }
          if (IS.template(child)) {
            child = child.spawn(false);
          }
          if (IS.array(child)) {
            child = QuickDom.apply(null, child);
          }
          if (IS.quickDomEl(child)) {
            child.appendTo(element);
          }
        }
      }
      return element;
    case !(args[0] && (IS.domNode(args[0][0]) || IS.domDoc(args[0][0]))):
      return QuickDom(args[0][0]);
  }
};

QuickDom.template = function(tree) {
  return new QuickTemplate(tree, true);
};

QuickDom.html = function(innerHTML) {
  var children, container;
  container = document.createElement('div');
  container.innerHTML = innerHTML;
  children = Array.prototype.slice.call(container.childNodes);
  return QuickDom.batch(children);
};

QuickDom.query = function(target) {
  return QuickDom(document).query(target);
};

QuickDom.queryAll = function(target) {
  return QuickDom(document).queryAll(target);
};

QuickDom.isTemplate = function(target) {
  return IS.template(target);
};

QuickDom.isQuickEl = function(target) {
  return IS.quickDomEl(target);
};

QuickDom.isEl = function(target) {
  return IS.domEl(target);
};

var QuickBatch;

QuickBatch = (function() {
  function QuickBatch(elements, returnResults1) {
    this.returnResults = returnResults1;
    this.elements = elements.map(function(el) {
      return QuickDom(el);
    });
  }

  QuickBatch.prototype.reverse = function() {
    this.elements = this.elements.reverse();
    return this;
  };

  QuickBatch.prototype["return"] = function(returnNext) {
    if (returnNext) {
      this.returnResults = true;
      return this;
    } else {
      return this.lastResults;
    }
  };

  return QuickBatch;

})();


/* istanbul ignore next */

if (QuickBatch.name == null) {
  QuickBatch.name = 'QuickBatch';
}

Object.keys(QuickElement.prototype).concat('css', 'replaceWith', 'html', 'text').forEach(function(method) {
  return QuickBatch.prototype[method] = function(newValue) {
    var element, results;
    results = this.lastResults = (function() {
      var i, len, ref, results1;
      ref = this.elements;
      results1 = [];
      for (i = 0, len = ref.length; i < len; i++) {
        element = ref[i];
        if (method === 'html' || method === 'text') {
          if (newValue) {
            results1.push(element[method] = newValue);
          } else {
            results1.push(element[method]);
          }
        } else {
          results1.push(element[method].apply(element, arguments));
        }
      }
      return results1;
    }).apply(this, arguments);
    if (this.returnResults) {
      return results;
    } else {
      return this;
    }
  };
});

QuickDom.batch = function(elements, returnResults) {
  if (!IS.iterable(elements)) {
    throw new Error("Batch: expected an iterable, got " + (String(elements)));
  } else if (!elements.length) {
    throw new Error("Batch: expected a non-empty element collection");
  }
  return new QuickBatch(elements, returnResults);
};

;

var QuickTemplate,
  slice = [].slice;

var extendByRef, extendTemplate;

extendTemplate = function(currentOpts, newOpts, globalOpts) {
  var currentChild, currentChildren, globalOptsTransform, index, maxLength, needsTemplateWrap, newChild, newChildProcessed, newChildren, noChanges, output, ref, remainingNewChildren;
  if (globalOpts) {
    globalOptsTransform = {
      options: function(opts) {
        return extend(opts, globalOpts);
      }
    };
  }
  if (IS.array(newOpts)) {
    newOpts = parseTree(newOpts, false);
  }
  output = extend.deep.nullDeletes.notKeys('children').notDeep(['relatedInstance', 'data']).transform(globalOptsTransform).clone(currentOpts, newOpts);
  currentChildren = currentOpts.children;
  newChildren = (newOpts != null ? newOpts.children : void 0) || [];
  output.children = [];

  /* istanbul ignore next */
  if (IS.array(newChildren)) {
    maxLength = Math.max(currentChildren.length, newChildren.length);
    index = -1;
    while (++index !== maxLength) {
      needsTemplateWrap = noChanges = false;
      currentChild = currentChildren[index];
      newChild = newChildren[index];
      newChildProcessed = (function() {
        switch (false) {
          case !IS.template(newChild):
            return newChild;
          case !IS.array(newChild):
            return needsTemplateWrap = parseTree(newChild);
          case !IS.string(newChild):
            return needsTemplateWrap = {
              type: 'text',
              options: {
                text: newChild
              }
            };
          case !(!newChild && !globalOpts):
            return noChanges = true;
          default:
            return needsTemplateWrap = newChild || true;
        }
      })();
      if (noChanges) {
        newChildProcessed = currentChild;
      } else if (needsTemplateWrap) {
        newChildProcessed = currentChild ? currentChild.extend(newChildProcessed, globalOpts) : new QuickTemplate(extend.clone(schema, newChildProcessed));
      }
      output.children.push(newChildProcessed);
    }
  } else if (IS.object(newChildren)) {
    newChildren = extend.allowNull.clone(newChildren);
    output.children = extendByRef(newChildren, currentChildren, globalOpts);
    remainingNewChildren = newChildren;
    for (ref in remainingNewChildren) {
      newChild = remainingNewChildren[ref];
      newChildProcessed = IS.objectPlain(newChild) && !IS.template(newChild) ? newChild : parseTree(newChild);
      output.children.push(new QuickTemplate(newChildProcessed));
      delete remainingNewChildren[ref];
    }
  }
  return output;
};

extendByRef = function(newChildrenRefs, currentChildren, globalOpts) {
  var currentChild, i, len, newChild, newChildProcessed, output;
  if (!currentChildren.length) {
    return currentChildren;
  } else {
    output = [];
    for (i = 0, len = currentChildren.length; i < len; i++) {
      currentChild = currentChildren[i];
      newChild = newChildrenRefs[currentChild.ref];
      if (newChild) {
        newChildProcessed = currentChild.extend(newChild, globalOpts);
        delete newChildrenRefs[currentChild.ref];
      } else if (newChild === null) {
        delete newChildrenRefs[currentChild.ref];
        continue;
      } else {
        newChildProcessed = (function() {
          switch (false) {
            case !globalOpts:
              return currentChild.extend(null, globalOpts);
            case !Object.keys(newChildrenRefs).length:
              return currentChild.extend();
            default:
              return currentChild;
          }
        })();
      }
      newChildProcessed.children = extendByRef(newChildrenRefs, newChildProcessed.children);
      output.push(newChildProcessed);
    }
    return output;
  }
};

;

var parseErrorPrefix, parseTree;

parseTree = function(tree, parseChildren) {
  var output;
  switch (false) {
    case !IS.array(tree):
      output = {};
      if (!IS.string(tree[0])) {
        throw new Error(parseErrorPrefix + " string for 'type', got '" + (String(tree[0])) + "'");
      } else {
        output.type = tree[0];
      }
      if (tree.length > 1 && !IS.object(tree[1]) && tree[1] !== null) {
        throw new Error(parseErrorPrefix + " object for 'options', got '" + (String(tree[1])) + "'");
      } else {
        output.options = tree[1] ? extend.deep.clone(tree[1]) : schema.options;
        if (tree[1]) {
          output.ref = tree[1].id || tree[1].ref;
        }
      }
      output.children = tree.slice(2);
      if (parseChildren === false) {
        if (tree.length === 3 && IS.objectPlain(tree[2]) && !IS.template(tree[2])) {
          output.children = tree[2];
        }
      } else {
        output.children = output.children.map(QuickDom.template);
      }
      return output;
    case !(IS.string(tree) || IS.domText(tree)):
      return {
        type: 'text',
        options: {
          text: tree.textContent || tree
        },
        children: schema.children
      };
    case !IS.domEl(tree):
      return {
        type: tree.nodeName.toLowerCase(),
        ref: tree.id,
        options: extend.clone.keys(allowedTemplateOptions)(tree),
        children: schema.children.map.call(tree.childNodes, QuickDom.template)
      };
    case !IS.quickDomEl(tree):
      return {
        type: tree.type,
        ref: tree.ref,
        options: extend.clone.deep.notKeys('relatedInstance')(tree.options),
        children: tree.children.map(QuickDom.template)
      };
    case !IS.template(tree):
      return tree;
    default:
      throw new Error(parseErrorPrefix + " (array || string || domEl || quickDomEl || template), got " + (String(tree)));
  }
};

parseErrorPrefix = 'Template Parse Error: expected';

;

var schema;

schema = {
  type: 'div',
  ref: void 0,
  options: {},
  children: []
};

;

QuickTemplate = (function() {
  function QuickTemplate(config, isTree) {
    var child, i, len, ref;
    if (IS.template(config)) {
      return config;
    }
    config = isTree ? parseTree(config) : config;
    extend(this, config);
    this._hasComputers = !!this.options.computers;
    if (!this._hasComputers && this.children.length) {
      ref = this.children;
      for (i = 0, len = ref.length; i < len; i++) {
        child = ref[i];
        if (!(child._hasComputers || child.options.computers)) {
          continue;
        }
        this._hasComputers = true;
        break;
      }
    }
  }

  QuickTemplate.prototype.extend = function(newValues, globalOpts) {
    return new QuickTemplate(extendTemplate(this, newValues, globalOpts));
  };

  QuickTemplate.prototype.spawn = function(newValues, globalOpts) {
    var data, element, opts, ref;
    if (newValues && newValues.data) {
      data = newValues.data;
      if (Object.keys(newValues).length === 1) {
        newValues = null;
      }
    }
    if (newValues || globalOpts) {
      opts = extendTemplate(this, newValues, globalOpts);
    } else {
      opts = extend.clone(this);
      opts.options = extend.clone(opts.options);
    }
    element = QuickDom.apply(null, [opts.type, opts.options].concat(slice.call(opts.children)));
    if (this._hasComputers) {
      if (newValues !== false) {
        element.applyData(data);
      }
      if ((ref = element.options.computers) != null ? ref._init : void 0) {
        element._runComputer('_init', data);
      }
    }
    return element;
  };

  return QuickTemplate;

})();


/* istanbul ignore next */

if (QuickTemplate.name == null) {
  QuickTemplate.name = 'QuickTemplate';
}

Object.defineProperty(QuickTemplate.prototype, 'child', {
  get: function() {
    return this._childRefs || _getChildRefs(this);
  }
});

;

var fn, i, len, shortcut, shortcuts,
  slice = [].slice;

shortcuts = ['link:a', 'anchor:a', 'a', 'text', 'div', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'footer', 'section', 'button', 'br', 'ul', 'ol', 'li', 'fieldset', 'input', 'textarea', 'select', 'option', 'form', 'frame', 'hr', 'iframe', 'img', 'picture', 'main', 'nav', 'meta', 'object', 'pre', 'style', 'table', 'tbody', 'th', 'tr', 'td', 'tfoot', 'video'];

fn = function(shortcut) {
  var prop, split, type;
  prop = type = shortcut;
  if (helpers.includes(shortcut, ':')) {
    split = shortcut.split(':');
    prop = split[0];
    type = split[1];
  }
  return QuickDom[prop] = function() {
    return QuickDom.apply(null, [type].concat(slice.call(arguments)));
  };
};
for (i = 0, len = shortcuts.length; i < len; i++) {
  shortcut = shortcuts[i];
  fn(shortcut);
}

;

QuickDom.version = "1.0.77";

QuickDom.CSS = CSS;

module.exports = QuickDom;

;
return module.exports;
},
"../node_modules/smart-extend/src/index.coffee": function (require, module, exports) {
var exports, extend, modifiers, newBuilder, normalizeKeys;

extend = require("../node_modules/smart-extend/src/extend.coffee");

normalizeKeys = function(keys) {
  var i, key, len, output;
  if (keys) {
    output = {};
    if (typeof keys !== 'object') {
      output[keys] = true;
    } else {
      if (!Array.isArray(keys)) {
        keys = Object.keys(keys);
      }
      for (i = 0, len = keys.length; i < len; i++) {
        key = keys[i];
        output[key] = true;
      }
    }
    return output;
  }
};

newBuilder = function(isBase) {
  var builder;
  builder = function(target) {
    var theTarget;
    var $_len = arguments.length, $_i = -1, sources = new Array($_len); while (++$_i < $_len) sources[$_i] = arguments[$_i];
    if (builder.options.target) {
      theTarget = builder.options.target;
    } else {
      theTarget = target;
      sources.shift();
    }
    return extend(builder.options, theTarget, sources);
  };
  if (isBase) {
    builder.isBase = true;
  }
  builder.options = {};
  Object.defineProperties(builder, modifiers);
  return builder;
};

modifiers = {
  'deep': {
    get: function() {
      var _;
      _ = this.isBase ? newBuilder() : this;
      _.options.deep = true;
      return _;
    }
  },
  'own': {
    get: function() {
      var _;
      _ = this.isBase ? newBuilder() : this;
      _.options.own = true;
      return _;
    }
  },
  'allowNull': {
    get: function() {
      var _;
      _ = this.isBase ? newBuilder() : this;
      _.options.allowNull = true;
      return _;
    }
  },
  'nullDeletes': {
    get: function() {
      var _;
      _ = this.isBase ? newBuilder() : this;
      _.options.nullDeletes = true;
      return _;
    }
  },
  'concat': {
    get: function() {
      var _;
      _ = this.isBase ? newBuilder() : this;
      _.options.concat = true;
      return _;
    }
  },
  'clone': {
    get: function() {
      var _;
      _ = this.isBase ? newBuilder() : this;
      _.options.target = {};
      return _;
    }
  },
  'notDeep': {
    get: function() {
      var _;
      _ = this.isBase ? newBuilder() : this;
      return function(keys) {
        _.options.notDeep = normalizeKeys(keys);
        return _;
      };
    }
  },
  'deepOnly': {
    get: function() {
      var _;
      _ = this.isBase ? newBuilder() : this;
      return function(keys) {
        _.options.deepOnly = normalizeKeys(keys);
        return _;
      };
    }
  },
  'keys': {
    get: function() {
      var _;
      _ = this.isBase ? newBuilder() : this;
      return function(keys) {
        _.options.keys = normalizeKeys(keys);
        return _;
      };
    }
  },
  'notKeys': {
    get: function() {
      var _;
      _ = this.isBase ? newBuilder() : this;
      return function(keys) {
        _.options.notKeys = normalizeKeys(keys);
        return _;
      };
    }
  },
  'transform': {
    get: function() {
      var _;
      _ = this.isBase ? newBuilder() : this;
      return function(transform) {
        if (typeof transform === 'function') {
          _.options.globalTransform = transform;
        } else if (transform && typeof transform === 'object') {
          _.options.transforms = transform;
        }
        return _;
      };
    }
  },
  'filter': {
    get: function() {
      var _;
      _ = this.isBase ? newBuilder() : this;
      return function(filter) {
        if (typeof filter === 'function') {
          _.options.globalFilter = filter;
        } else if (filter && typeof filter === 'object') {
          _.options.filters = filter;
        }
        return _;
      };
    }
  }
};

module.exports = exports = newBuilder(true);

exports.version = "1.7.3";

;
return module.exports;
},
"popup.coffee": function (require, module, exports) {
var DOM, IS, Popup, body, helpers, promiseBreak, promiseEvent, template,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

promiseEvent = require("../node_modules/p-event/index.js");

promiseBreak = require("../node_modules/promise-break/index.js");

DOM = require("../node_modules/quickdom/src/index.coffee");

IS = require("checks.coffee");

template = require("template.coffee");

helpers = require("helpers.coffee");

body = DOM(document.body);

Popup = (function(superClass) {
  extend(Popup, superClass);

  Popup.instances = [];

  Popup.hasOpen = false;

  Popup.bodyWrapper = null;

  Popup.transitionEnd = helpers.transitionEnd();

  Popup.wrapBody = function() {
    var bodyChildren, child, i, len, ref1;
    if (!((ref1 = this.bodyWrapper) != null ? ref1.parent : void 0)) {
      this.bodyWrapper = template.bodyWrapper.spawn();
      bodyChildren = body.children.slice();
      this.bodyWrapper.prependTo(body);
      for (i = 0, len = bodyChildren.length; i < len; i++) {
        child = bodyChildren[i];
        this.bodyWrapper.append(child);
      }
    }
  };

  Popup.unwrapBody = function() {
    var bodyChildren, child, i, len;
    if (this.bodyWrapper) {
      bodyChildren = this.bodyWrapper.children.slice();
      for (i = 0, len = bodyChildren.length; i < len; i++) {
        child = bodyChildren[i];
        body.append(child);
      }
      this.bodyWrapper.remove();
      return this.bodyWrapper = null;
    }
  };

  Popup.destroyAll = function() {
    var i, instance, instances, len;
    instances = this.instances.slice();
    for (i = 0, len = instances.length; i < len; i++) {
      instance = instances[i];
      instance.destroy();
    }
    return this.unwrapBody();
  };

  function Popup(settings, defaults, template1) {
    this.template = template1;
    this.settings = helpers.extendSettings(defaults, settings);
    this.id = Math.round(Math.random() * 1e5).toString(16);
    this.state = {
      open: false,
      destroyed: false,
      offset: 0,
      count: 0
    };
    if (this.settings.content) {
      this.content = DOM(this.settings.content);
    }
    Popup.__super__.constructor.apply(this, arguments);
    Popup.instances.push(this);
    Popup.wrapBody();
    this._createElements();
    this._attachBindings();
    if (this.settings.template && typeof this.settings.template === 'object') {
      this._applyTemplate();
    }
    this.el.prependTo(body);
    if (this.settings.open) {
      this.open();
    }
  }

  Popup.prototype._createElements = function() {
    var close, config, content, data, overlay;
    data = {
      data: {
        content: this.content,
        placement: this.settings.placement
      }
    };
    config = {
      relatedInstance: this
    };
    this.el = this.template.popup.spawn(data, config);
    overlay = this.template.overlay.spawn(data, config).appendTo(this.el);
    content = this.template.content.spawn(data, config).appendTo(this.el);
    if (this.settings.close.show) {
      return close = this.template.close.spawn(data, config).appendTo(content);
    }
  };

  Popup.prototype._applyTemplate = function() {
    var custom, ref;
    custom = this.settings.template;
    for (ref in this.el.child) {
      if (custom[ref]) {
        this.el.child[ref].updateOptions(custom[ref]);
      }
    }
  };

  Popup.prototype._attachBindings = function() {
    var close, hidden, ref1, ref2, ref3, visibilitychange;
    close = this.close.bind(this);
    this.el.child.overlay.on('mouseup touchend', close);
    if ((ref1 = this.el.child.close) != null) {
      ref1.on('mouseup touchend', close);
    }
    if (this.settings.placement === 'center') {
      DOM(window).on("resize." + this.id, (function(_this) {
        return function() {
          if (_this.state.open) {
            return _this.alignToCenter();
          }
        };
      })(this));
    }
    if (this.settings.triggers.close.esc) {
      DOM(document).on("keyup." + this.id, (function(_this) {
        return function(event) {
          if (event.keyCode === 27 && _this.state.open) {
            event.stopPropagation();
            event.preventDefault();
            return _this.close();
          }
        };
      })(this));
    }
    if (this.settings.triggers.open.visibility) {
      ref2 = helpers.visibilityApiKeys(), visibilitychange = ref2.visibilitychange, hidden = ref2.hidden;
      DOM(document).on(visibilitychange + "." + this.id, (function(_this) {
        return function() {
          if (document[hidden]) {
            return _this.open('visibility');
          }
        };
      })(this));
    }
    if (this.settings.triggers.open.exitIntent) {
      DOM(window).on("mouseleave." + this.id, (function(_this) {
        return function(event) {
          if (event.clientY < 1) {
            return _this.open('exitIntent');
          }
        };
      })(this));
    }
    if (this.settings.triggers.open.navigation && ((ref3 = window.history) != null ? ref3.pushState : void 0)) {
      window.history.replaceState({
        id: 'quickpopup-origin'
      }, '', '');
      window.history.pushState({
        id: 'quickpopup'
      }, '', '');
      return DOM(window).on("popstate." + this.id, (function(_this) {
        return function(event) {
          if (event.state.state.id === 'quickpopup-origin' && _this.open('navigation')) {

          } else {
            return window.history.back();
          }
        };
      })(this));
    }
  };

  Popup.prototype._detachBindings = function() {
    var hidden, ref1, ref2, visibilitychange;
    this.el.child.overlay.off();
    if ((ref1 = this.el.child.close) != null) {
      ref1.off();
    }
    ref2 = helpers.visibilityApiKeys(), visibilitychange = ref2.visibilitychange, hidden = ref2.hidden;
    if (this.settings.placement === 'center') {
      DOM(window).off("resize." + this.id);
    }
    if (this.settings.triggers.open.exitIntent) {
      DOM(window).off("mouseleave." + this.id);
    }
    if (this.settings.triggers.open.navigation) {
      DOM(window).off("popstate." + this.id);
    }
    if (this.settings.triggers.open.visibility) {
      DOM(document).off(visibilitychange + "." + this.id);
    }
    if (this.settings.triggers.close.esc) {
      return DOM(document).off("keyup." + this.id);
    }
  };

  Popup.prototype._throwDestroyed = function() {
    throw new Error("invalid attempt to operate a destroyed popup instance");
  };

  Popup.prototype.setContent = function(target) {
    this.content = (function() {
      switch (false) {
        case !IS.quickEl(target):
          return target;
        case !IS.domEl(target):
          return DOM(target);
        case !IS.template(target):
          return target.spawn();
        case !IS.string(target):
          return template.html.spawn({
            data: {
              html: target
            }
          });
        default:
          throw new Error('invalid target provided to Popup::setContent()');
      }
    })();
    return this.el.child.content.children[1].replaceWith(this.content);
  };

  Popup.prototype.alignToCenter = function() {
    var contentHeight, offset, windowHeight;
    contentHeight = this.el.child.content.raw.clientHeight;
    windowHeight = window.innerHeight;
    if (contentHeight >= windowHeight - 80) {
      offset = window.innerWidth > 736 ? 100 : 60;
    } else {
      offset = (windowHeight - contentHeight) / 2;
    }
    return this.el.child.content.style('margin', offset + "px auto");
  };

  Popup.prototype.open = function(triggerName) {
    return Promise.resolve().then((function(_this) {
      return function() {
        if (_this.state.destroyed) {
          _this._throwDestroyed();
        }
        if (false || _this.state.open || (Popup.hasOpen && !_this.settings.forceOpen) || ++_this.state.count >= _this.settings.openLimit || window.innerWidth < _this.settings.triggers.open.minWidth || _this.settings.condition && !_this.settings.condition()) {
          return promiseBreak();
        }
      };
    })(this)).then((function(_this) {
      return function() {
        var openPopups;
        _this.emit('beforeopen', triggerName);
        if (!Popup.hasOpen) {
          return _this.state.offset = helpers.scrollOffset();
        } else {
          openPopups = Popup.instances.filter(function(popup) {
            return popup !== _this && popup.state.open;
          });
          return Promise.all(openPopups.map(function(popup) {
            _this.state.offset = popup.state.offset;
            return popup.close(true);
          }));
        }
      };
    })(this)).then((function(_this) {
      return function() {
        var promise;
        helpers.scheduleScrollReset(5);
        Popup.bodyWrapper.state('open', true);
        _this.el.state('open', true);
        _this.state.open = Popup.hasOpen = true;
        if (_this.settings.placement === 'center') {
          _this.alignToCenter();
        }
        _this.emit('open', triggerName);
        if (!_this.settings.animation || !Popup.transitionEnd) {
          return _this.emit('finishopen');
        } else {
          promise = promiseEvent(_this, 'finishopen');
          _this.el.child.content.on(Popup.transitionEnd, function(event) {
            if (event.target === _this.el.child.content.raw) {
              _this.emit('finishopen');
              return _this.el.child.content.off(Popup.transitionEnd);
            }
          });
          return promise;
        }
      };
    })(this))["catch"](promiseBreak.end).then((function(_this) {
      return function() {
        return _this;
      };
    })(this));
  };

  Popup.prototype.close = function(preventReset) {
    return Promise.resolve().then((function(_this) {
      return function() {
        if (!_this.state.open) {
          return promiseBreak();
        }
      };
    })(this)).then((function(_this) {
      return function() {
        var promise;
        _this.emit('beforeclose');
        if (preventReset !== true) {
          setTimeout(function() {
            var ref1;
            if (!Popup.hasOpen) {
              if ((ref1 = Popup.bodyWrapper) != null) {
                ref1.state('open', false);
              }
              return window.scroll(0, _this.state.offset + helpers.documentOffset());
            }
          });
          Popup.hasOpen = false;
        }
        _this.el.state('open', false);
        _this.state.open = false;
        _this.emit('close');
        if (!_this.settings.animation || !Popup.transitionEnd) {
          return _this.emit('finishclose');
        } else {
          promise = promiseEvent(_this, 'finishclose');
          _this.el.child.content.on(Popup.transitionEnd, function(event) {
            if (event.target === _this.el.child.content.raw) {
              _this.emit('finishclose');
              return _this.el.child.content.off(Popup.transitionEnd);
            }
          });
          return promise;
        }
      };
    })(this))["catch"](promiseBreak.end).then((function(_this) {
      return function() {
        return _this;
      };
    })(this));
  };

  Popup.prototype.destroy = function() {
    if (this.settings.destroyed) {
      this._throwDestroyed();
    }
    this.close();
    this._detachBindings();
    this.el.remove();
    Popup.instances.splice(Popup.instances.indexOf(this), 1);
    return true;
  };

  return Popup;

})(require("../node_modules/event-lite/event-lite.js"));

module.exports = Popup;

;
return module.exports;
},
"checks.coffee": function (require, module, exports) {
var DOM, IS;

IS = require("../node_modules/@danielkalen/is/src/index.coffee");

DOM = require("../node_modules/quickdom/src/index.coffee");

module.exports = IS = IS.create('natives');

IS.load({
  'domEl': DOM.isEl,
  'quickEl': DOM.isQuickEl,
  'template': DOM.isTemplate
});

;
return module.exports;
},
"defaults.coffee": function (require, module, exports) {
module.exports = {
  placement: 'center',
  open: false,
  forceOpen: false,
  template: null,
  condition: null,
  animation: 300,
  contentPadding: 0,
  openLimit: 2e308,
  overlayColor: 'rgba(0,0,0,0.88)',
  close: {
    show: false,
    padding: 20,
    inside: false,
    size: 22
  },
  triggers: {
    open: {
      navigation: false,
      visibility: false,
      exitIntent: false
    },
    close: {
      esc: true
    }
  }
};

;
return module.exports;
},
"template.coffee": function (require, module, exports) {
var DOM;

DOM = require("../node_modules/quickdom/src/index.coffee");

var popup = DOM.template([
  'div', {
    ref: 'popup',
    style: {
      position: 'absolute',
      zIndex: 1e4,
      top: 0,
      left: 0,
      width: '100vw',
      height: 0,
      minHeight: '100%',
      visibility: 'hidden',
      overflow: 'hidden',
      transition: function(popup) {
        return "all 0.001s linear " + (popup.settings.animation + 1) + "ms";
      },
      $open: {
        transition: function() {
          return 'all 0.001s linear 0s';
        },
        visibility: 'visible',
        overflow: 'visible',
        height: 'auto'
      }
    }
  }
]);
exports.popup = popup; 

var overlay = DOM.template([
  'div', {
    ref: 'overlay',
    style: {
      position: 'fixed',
      zIndex: 1,
      left: 0,
      top: 0,
      width: '100vw',
      minHeight: '100vh',
      opacity: 0,
      backgroundColor: function(popup) {
        return popup.settings.overlayColor;
      },
      transition: function(popup) {
        return "opacity " + popup.settings.animation + "ms";
      },
      $open: {
        opacity: 1
      }
    }
  }
]);
exports.overlay = overlay; 

var content = DOM.template([
   'div', {
     ref: 'content',
     style: {
       position: 'absolute',
       zIndex: 2,
       boxSizing: 'border-box',
       maxWidth: '100%',
       margin: '0 auto',
       padding: function(popup) {
         return popup.settings.contentPadding;
       },
       opacity: 0,
       transition: function(popup) {
         var duration;
         duration = popup.settings.animation;
         return "transform " + duration + "ms, -webkit-transform " + duration + "ms, opacity " + duration + "ms";
       },
       $open: {
         opacity: 1
       },
       $centerPlacement: {
         left: '50%',
         transform: 'translateX(-50%)'
       },
       $topPlacement: {
         top: 0,
         left: '50%',
         transform: 'translateX(-50%) translateY(-100%)',
         $open: {
           transform: 'translateX(-50%) translateY(0)'
         }
       },
       $bottomPlacement: {
         bottom: 0,
         left: '50%',
         transform: 'translateX(-50%) translateY(100%)',
         $open: {
           transform: 'translateX(-50%) translateY(0)'
         }
       }
     },
     computers: {
       placement: function(placement) {
         return this.state(placement + "Placement", true);
       },
       content: function(content) {
         if (content) {
           return this.append(content);
         }
       }
     },
     events: {
       'stateChange:visible': function(visible) {
         if (visible && DOM(this).related.settings.placement === 'center') {
           return DOM(this).related.alignToCenter();
         }
       }
     }
   }
 ]);
 exports.content = content; 

var close = DOM.template([
  'div', {
    ref: 'close',
    style: {
      position: 'absolute',
      display: function(popup) {
        if (popup.settings.close.show) {
          return 'block';
        } else {
          return 'none';
        }
      },
      top: function(popup) {
        if (popup.settings.close.inside) {
          return popup.settings.close.padding;
        } else {
          return popup.settings.close.size * 2.5 * -1;
        }
      },
      right: function(popup) {
        if (popup.settings.close.inside) {
          return popup.settings.close.padding;
        } else {
          return 0;
        }
      },
      width: function(popup) {
        return popup.settings.close.size;
      },
      height: function(popup) {
        return popup.settings.close.size;
      },
      color: function(popup) {
        return popup.settings.close.color;
      }
    }
  }, [
    '*svg', {
      attrs: {
        viewBox: "0 0 492 492"
      },
      style: {
        width: '100%',
        height: '100%'
      }
    }, [
      '*path', {
        attrs: {
          d: 'M300.2 246L484.1 62c5.1-5.1 7.9-11.8 7.9-19 0-7.2-2.8-14-7.9-19L468 7.9c-5.1-5.1-11.8-7.9-19-7.9 -7.2 0-14 2.8-19 7.9L246 191.8 62 7.9c-5.1-5.1-11.8-7.9-19-7.9 -7.2 0-14 2.8-19 7.9L7.9 24c-10.5 10.5-10.5 27.6 0 38.1L191.8 246 7.9 430c-5.1 5.1-7.9 11.8-7.9 19 0 7.2 2.8 14 7.9 19l16.1 16.1c5.1 5.1 11.8 7.9 19 7.9 7.2 0 14-2.8 19-7.9l184-184 184 184c5.1 5.1 11.8 7.9 19 7.9h0c7.2 0 14-2.8 19-7.9l16.1-16.1c5.1-5.1 7.9-11.8 7.9-19 0-7.2-2.8-14-7.9-19L300.2 246z'
        },
        style: {
          fill: function(popup) {
            return popup.settings.close.color;
          }
        }
      }
    ]
  ]
]);
exports.close = close; 

var bodyWrapper = DOM.template([
    'div', {
      id: 'bodyWrapper',
      passStateToChildren: false,
      style: {
        $open: {
          position: 'fixed',
          width: '100%',
          top: ''
        }
      }
    }
  ]);
  exports.bodyWrapper = bodyWrapper; 

var html = DOM.template([
   'div', {
     computers: {
       html: function(html) {
         return this.html = html;
       }
     }
   }
 ]);
 exports.html = html; 

;
return module.exports;
},
"../node_modules/quickcss/src/index.coffee": function (require, module, exports) {
var QuickCSS, constants, helpers;

constants = require("../node_modules/quickcss/src/constants.coffee");

helpers = require("../node_modules/quickcss/src/helpers.coffee");

QuickCSS = function(targetEl, property, value, important) {
  var computedStyle, i, len, subEl, subProperty, subValue;
  if (helpers.isIterable(targetEl)) {
    for (i = 0, len = targetEl.length; i < len; i++) {
      subEl = targetEl[i];
      QuickCSS(subEl, property, value);
    }
  } else if (typeof property === 'object') {
    for (subProperty in property) {
      subValue = property[subProperty];
      QuickCSS(targetEl, subProperty, subValue);
    }
  } else {
    property = helpers.normalizeProperty(property);
    if (typeof value === 'undefined') {
      computedStyle = targetEl._computedStyle || (targetEl._computedStyle = getComputedStyle(targetEl));
      return computedStyle[property];
    } else if (property) {
      targetEl.style.setProperty(property, helpers.normalizeValue(property, value), important ? constants.IMPORTANT : void 0);
    }
  }
};

QuickCSS.animation = function(name, frames) {
  var frame, generated, prefix, rules;
  if (name && typeof name === 'string' && frames && typeof frames === 'object') {
    prefix = helpers.getPrefix('animation');
    generated = '';
    for (frame in frames) {
      rules = frames[frame];
      generated += frame + " {" + (helpers.ruleToString(rules)) + "}";
    }
    generated = "@" + prefix + "keyframes " + name + " {" + generated + "}";
    return helpers.inlineStyle(generated, true, 0);
  }
};

QuickCSS.register = function(rule, level, important) {
  var className, ref, style;
  if (rule && typeof rule === 'object') {
    level || (level = 0);
    rule = helpers.ruleToString(rule, important);
    if (!(className = (ref = helpers.inlineStyleConfig[level]) != null ? ref[rule] : void 0)) {
      className = helpers.hash(rule);
      style = "." + className + " {" + rule + "}";
      helpers.inlineStyle(style, className, level);
    }
    return className;
  }
};

QuickCSS.clearRegistered = function(level) {
  return helpers.clearInlineStyle(level || 0);
};


/* istanbul ignore next */

QuickCSS.UNSET = (function() {
  switch (false) {
    case !helpers.isValueSupported('display', 'unset'):
      return 'unset';
    case !helpers.isValueSupported('display', 'initial'):
      return 'initial';
    case !helpers.isValueSupported('display', 'inherit'):
      return 'inherit';
  }
})();

QuickCSS.supports = helpers.isValueSupported;

QuickCSS.supportsProperty = helpers.isPropSupported;

QuickCSS.normalizeProperty = helpers.normalizeProperty;

QuickCSS.normalizeValue = helpers.normalizeValue;

QuickCSS.version = "1.3.4";

module.exports = QuickCSS;

;
return module.exports;
},
"../node_modules/smart-extend/src/extend.coffee": function (require, module, exports) {
var extend, isArray, isObject, shouldDeepExtend;

isArray = function(target) {
  return Array.isArray(target);
};

isObject = function(target) {
  return target && Object.prototype.toString.call(target) === '[object Object]' || isArray(target);
};

shouldDeepExtend = function(options, target, parentKey) {
  if (options.deep) {
    if (options.notDeep) {
      return !options.notDeep[target];
    } else {
      return true;
    }
  } else if (options.deepOnly) {
    return options.deepOnly[target] || parentKey && shouldDeepExtend(options, parentKey);
  }
};

module.exports = extend = function(options, target, sources, parentKey) {
  var i, key, len, source, sourceValue, subTarget, targetValue;
  if (!target || typeof target !== 'object' && typeof target !== 'function') {
    target = {};
  }
  for (i = 0, len = sources.length; i < len; i++) {
    source = sources[i];
    if (source != null) {
      for (key in source) {
        sourceValue = source[key];
        targetValue = target[key];
        if (sourceValue === target || sourceValue === void 0 || (sourceValue === null && !options.allowNull && !options.nullDeletes) || (options.keys && !options.keys[key]) || (options.notKeys && options.notKeys[key]) || (options.own && !source.hasOwnProperty(key)) || (options.globalFilter && !options.globalFilter(sourceValue, key, source)) || (options.filters && options.filters[key] && !options.filters[key](sourceValue, key, source))) {
          continue;
        }
        if (sourceValue === null && options.nullDeletes) {
          delete target[key];
          continue;
        }
        if (options.globalTransform) {
          sourceValue = options.globalTransform(sourceValue, key, source);
        }
        if (options.transforms && options.transforms[key]) {
          sourceValue = options.transforms[key](sourceValue, key, source);
        }
        switch (false) {
          case !(options.concat && isArray(sourceValue) && isArray(targetValue)):
            target[key] = targetValue.concat(sourceValue);
            break;
          case !(shouldDeepExtend(options, key, parentKey) && isObject(sourceValue)):
            subTarget = isObject(targetValue) ? targetValue : isArray(sourceValue) ? [] : {};
            target[key] = extend(options, subTarget, [sourceValue], key);
            break;
          default:
            target[key] = sourceValue;
        }
      }
    }
  }
  return target;
};

;
return module.exports;
},
"../node_modules/p-event/index.js": function (require, module, exports) {
'use strict';

var pTimeout = require("../node_modules/p-timeout/index.js");

module.exports = function (emitter, event, opts) {
	var cancel = void 0;

	var ret = new Promise(function (resolve, reject) {
		if (typeof opts === 'function') {
			opts = { filter: opts };
		}

		opts = Object.assign({
			rejectionEvents: ['error'],
			multiArgs: false
		}, opts);

		var addListener = emitter.on || emitter.addListener || emitter.addEventListener;
		var removeListener = emitter.off || emitter.removeListener || emitter.removeEventListener;

		if (!addListener || !removeListener) {
			throw new TypeError('Emitter is not compatible');
		}

		addListener = addListener.bind(emitter);
		removeListener = removeListener.bind(emitter);

		var resolveHandler = function resolveHandler(value) {
			if (opts.multiArgs) {
				value = [].slice.apply(arguments);
			}

			if (opts.filter && !opts.filter(value)) {
				return;
			}

			cancel();
			resolve(value);
		};

		var rejectHandler = function rejectHandler(reason) {
			cancel();

			if (opts.multiArgs) {
				reject([].slice.apply(arguments));
			} else {
				reject(reason);
			}
		};

		cancel = function cancel() {
			removeListener(event, resolveHandler);

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = opts.rejectionEvents[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var rejectionEvent = _step.value;

					removeListener(rejectionEvent, rejectHandler);
				}
			} catch (err) {
				_didIteratorError = true;
				_iteratorError = err;
			} finally {
				try {
					if (!_iteratorNormalCompletion && _iterator.return) {
						_iterator.return();
					}
				} finally {
					if (_didIteratorError) {
						throw _iteratorError;
					}
				}
			}
		};

		addListener(event, resolveHandler);

		var _iteratorNormalCompletion2 = true;
		var _didIteratorError2 = false;
		var _iteratorError2 = undefined;

		try {
			for (var _iterator2 = opts.rejectionEvents[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
				var rejectionEvent = _step2.value;

				addListener(rejectionEvent, rejectHandler);
			}
		} catch (err) {
			_didIteratorError2 = true;
			_iteratorError2 = err;
		} finally {
			try {
				if (!_iteratorNormalCompletion2 && _iterator2.return) {
					_iterator2.return();
				}
			} finally {
				if (_didIteratorError2) {
					throw _iteratorError2;
				}
			}
		}
	});

	ret.cancel = cancel;

	if (typeof opts.timeout === 'number') {
		return pTimeout(ret, opts.timeout);
	}

	return ret;
};;
return module.exports;
},
"../node_modules/promise-break/index.js": function (require, module, exports) {
'use strict';

function createEndBreak(value) {
	var instance = Object.create(Error.prototype);
	instance.value = value;
	instance.__isEndBreak = true;
	return instance;
}

module.exports = function (val) {
	var err = createEndBreak(val);
	throw err;
};

module.exports.end = function (err) {
	if (err.__isEndBreak) {
		return err.value;
	}

	throw err;
};
;
return module.exports;
},
"helpers.coffee": function (require, module, exports) {
var IS, detectAnimation, extend;

IS = require("checks.coffee");

extend = require("../node_modules/smart-extend/src/index.coffee");

detectAnimation = require("../node_modules/detect-animation-end-helper/index.js");

exports.extendSettings = function(defaults, settings) {
  return extend.filter({
    placement: IS.string,
    template: IS.objectPlain,
    condition: IS["function"],
    animation: IS.number,
    overlayColor: IS.string,
    open: IS.objectPlain,
    close: IS.objectPlain,
    triggers: IS.objectPlain
  }).clone.deep.notDeep('content')(defaults, settings);
};

exports.scheduleScrollReset = function(scheduleNext) {
  return setTimeout(function() {
    window.scroll(0, 0);
    if (scheduleNext) {
      return setTimeout(function() {
        return exports.scheduleScrollReset();
      }, scheduleNext);
    }
  });
};

exports.transitionEnd = function() {
  return detectAnimation('transition');
};

exports.scrollOffset = function() {
  return window.scrollY - exports.documentOffset();
};

exports.documentOffset = function() {
  var ref;
  return (((ref = document.body.getBoundingClientRect()) != null ? ref.top : void 0) || 0) + window.scrollY;
};

exports.visibilityApiKeys = function() {
  switch (false) {
    case !IS.defined(document.hidden):
      return {
        hidden: 'hidden',
        visibilitychange: 'visibilitychange'
      };
    case !IS.defined(document.msHidden):
      return {
        hidden: 'msHidden',
        visibilitychange: 'msvisibilitychange'
      };
    case !IS.defined(document.webkitHidden):
      return {
        hidden: 'webkitHidden',
        visibilitychange: 'webkitvisibilitychange'
      };
    default:
      return {};
  }
};

;
return module.exports;
},
"../node_modules/event-lite/event-lite.js": function (require, module, exports) {
/**
 * event-lite.js - Light-weight EventEmitter (less than 1KB when gzipped)
 *
 * @copyright Yusuke Kawasaki
 * @license MIT
 * @constructor
 * @see https://github.com/kawanet/event-lite
 * @see http://kawanet.github.io/event-lite/EventLite.html
 * @example
 * var EventLite = require("event-lite");
 *
 * function MyClass() {...}             // your class
 *
 * EventLite.mixin(MyClass.prototype);  // import event methods
 *
 * var obj = new MyClass();
 * obj.on("foo", function() {...});     // add event listener
 * obj.once("bar", function() {...});   // add one-time event listener
 * obj.emit("foo");                     // dispatch event
 * obj.emit("bar");                     // dispatch another event
 * obj.off("foo");                      // remove event listener
 */

function EventLite() {
  if (!(this instanceof EventLite)) return new EventLite();
}

(function(EventLite) {
  // export the class for node.js
  if ("undefined" !== typeof module) module.exports = EventLite;

  // property name to hold listeners
  var LISTENERS = "listeners";

  // methods to export
  var methods = {
    on: on,
    once: once,
    off: off,
    emit: emit
  };

  // mixin to self
  mixin(EventLite.prototype);

  // export mixin function
  EventLite.mixin = mixin;

  /**
   * Import on(), once(), off() and emit() methods into target object.
   *
   * @function EventLite.mixin
   * @param target {Prototype}
   */

  function mixin(target) {
    for (var key in methods) {
      target[key] = methods[key];
    }
    return target;
  }

  /**
   * Add an event listener.
   *
   * @function EventLite.prototype.on
   * @param type {string}
   * @param func {Function}
   * @returns {EventLite} Self for method chaining
   */

  function on(type, func) {
    getListeners(this, type).push(func);
    return this;
  }

  /**
   * Add one-time event listener.
   *
   * @function EventLite.prototype.once
   * @param type {string}
   * @param func {Function}
   * @returns {EventLite} Self for method chaining
   */

  function once(type, func) {
    var that = this;
    wrap.originalListener = func;
    getListeners(that, type).push(wrap);
    return that;

    function wrap() {
      off.call(that, type, wrap);
      func.apply(this, arguments);
    }
  }

  /**
   * Remove an event listener.
   *
   * @function EventLite.prototype.off
   * @param [type] {string}
   * @param [func] {Function}
   * @returns {EventLite} Self for method chaining
   */

  function off(type, func) {
    var that = this;
    var listners;
    if (!arguments.length) {
      delete that[LISTENERS];
    } else if (!func) {
      listners = that[LISTENERS];
      if (listners) {
        delete listners[type];
        if (!Object.keys(listners).length) return off.call(that);
      }
    } else {
      listners = getListeners(that, type, true);
      if (listners) {
        listners = listners.filter(ne);
        if (!listners.length) return off.call(that, type);
        that[LISTENERS][type] = listners;
      }
    }
    return that;

    function ne(test) {
      return test !== func && test.originalListener !== func;
    }
  }

  /**
   * Dispatch (trigger) an event.
   *
   * @function EventLite.prototype.emit
   * @param type {string}
   * @param [value] {*}
   * @returns {boolean} True when a listener received the event
   */

  function emit(type, value) {
    var that = this;
    var listeners = getListeners(that, type, true);
    if (!listeners) return false;
    var arglen = arguments.length;
    if (arglen === 1) {
      listeners.forEach(zeroarg);
    } else if (arglen === 2) {
      listeners.forEach(onearg);
    } else {
      var args = Array.prototype.slice.call(arguments, 1);
      listeners.forEach(moreargs);
    }
    return !!listeners.length;

    function zeroarg(func) {
      func.call(that);
    }

    function onearg(func) {
      func.call(that, value);
    }

    function moreargs(func) {
      func.apply(that, args);
    }
  }

  /**
   * @ignore
   */

  function getListeners(that, type, readonly) {
    if (readonly && !that[LISTENERS]) return;
    var listeners = that[LISTENERS] || (that[LISTENERS] = {});
    return listeners[type] || (listeners[type] = []);
  }

})(EventLite);
;
return module.exports;
},
"../node_modules/@danielkalen/is/src/index.coffee": function (require, module, exports) {
var Checks, availSets;

availSets = {
  natives: require("../node_modules/@danielkalen/is/src/natives.coffee"),
  dom: require("../node_modules/@danielkalen/is/src/dom.coffee")
};

Checks = (function() {
  Checks.prototype.create = function() {
    var args;
    if (arguments.length) {
      args = Array.prototype.slice.call(arguments);
    }
    return new Checks(args);
  };

  function Checks(sets) {
    var i, len, set;
    if (sets == null) {
      sets = ['natives'];
    }
    for (i = 0, len = sets.length; i < len; i++) {
      set = sets[i];
      if (availSets[set]) {
        this.load(availSets[set]);
      }
    }
  }

  Checks.prototype.load = function(set) {
    var key, value;
    if (availSets.natives.string(set)) {
      set = availSets[set];
    }
    if (!availSets.natives.objectPlain(set)) {
      return;
    }
    for (key in set) {
      value = set[key];
      this[key] = value;
    }
  };

  return Checks;

})();

module.exports = Checks.prototype.create();

;
return module.exports;
},
"../node_modules/quickcss/src/constants.coffee": function (require, module, exports) {
exports.REGEX_LEN_VAL = /^\d+(?:[a-z]|\%)+$/i;

exports.REGEX_DIGITS = /\d+$/;

exports.REGEX_SPACE = /\s/;

exports.REGEX_KEBAB = /([A-Z])+/g;

exports.IMPORTANT = 'important';

exports.POSSIBLE_PREFIXES = ['webkit', 'moz', 'ms', 'o'];

exports.REQUIRES_UNIT_VALUE = ['background-position-x', 'background-position-y', 'block-size', 'border-width', 'columnRule-width', 'cx', 'cy', 'font-size', 'grid-column-gap', 'grid-row-gap', 'height', 'inline-size', 'line-height', 'minBlock-size', 'min-height', 'min-inline-size', 'min-width', 'max-height', 'max-width', 'outline-offset', 'outline-width', 'perspective', 'shape-margin', 'stroke-dashoffset', 'stroke-width', 'text-indent', 'width', 'word-spacing', 'top', 'bottom', 'left', 'right', 'x', 'y'];

exports.QUAD_SHORTHANDS = ['margin', 'padding', 'border', 'border-radius'];

exports.DIRECTIONS = ['top', 'bottom', 'left', 'right'];

exports.QUAD_SHORTHANDS.forEach(function(property) {
  var direction, i, len, ref;
  exports.REQUIRES_UNIT_VALUE.push(property);
  ref = exports.DIRECTIONS;
  for (i = 0, len = ref.length; i < len; i++) {
    direction = ref[i];
    exports.REQUIRES_UNIT_VALUE.push(property + '-' + direction);
  }
});

;
return module.exports;
},
"../node_modules/quickcss/src/helpers.coffee": function (require, module, exports) {
var constants, helpers, sampleStyle, styleConfig;

constants = require("../node_modules/quickcss/src/constants.coffee");

sampleStyle = document.createElement('div').style;

helpers = exports;

helpers.includes = function(target, item) {
  return target && target.indexOf(item) !== -1;
};

helpers.isIterable = function(target) {
  return target && typeof target === 'object' && typeof target.length === 'number' && !target.nodeType;
};

helpers.toKebabCase = function(string) {
  return string.replace(constants.REGEX_KEBAB, function(e, letter) {
    return "-" + (letter.toLowerCase());
  });
};

helpers.isPropSupported = function(property) {
  return typeof sampleStyle[property] !== 'undefined';
};

helpers.isValueSupported = function(property, value) {
  if (window.CSS && window.CSS.supports) {
    return window.CSS.supports(property, value);
  } else {
    sampleStyle[property] = value;
    return sampleStyle[property] === '' + value;
  }
};

helpers.getPrefix = function(property, skipInitialCheck) {
  var j, len1, prefix, ref;
  if (skipInitialCheck || !helpers.isPropSupported(property)) {
    ref = constants.POSSIBLE_PREFIXES;
    for (j = 0, len1 = ref.length; j < len1; j++) {
      prefix = ref[j];

      /* istanbul ignore next */
      if (helpers.isPropSupported("-" + prefix + "-" + property)) {
        return "-" + prefix + "-";
      }
    }
  }
  return '';
};

helpers.normalizeProperty = function(property) {
  property = helpers.toKebabCase(property);
  if (helpers.isPropSupported(property)) {
    return property;
  } else {
    return "" + (helpers.getPrefix(property, true)) + property;
  }
};

helpers.normalizeValue = function(property, value) {
  if (helpers.includes(constants.REQUIRES_UNIT_VALUE, property) && value !== null) {
    value = '' + value;
    if (constants.REGEX_DIGITS.test(value) && !constants.REGEX_LEN_VAL.test(value) && !constants.REGEX_SPACE.test(value)) {
      value += property === 'line-height' ? 'em' : 'px';
    }
  }
  return value;
};

helpers.sort = function(array) {
  var great, i, len, less, pivot;
  if (array.length < 2) {
    return array;
  } else {
    pivot = array[0];
    less = [];
    great = [];
    len = array.length;
    i = 0;
    while (++i !== len) {
      if (array[i] <= pivot) {
        less.push(array[i]);
      } else {
        great.push(array[i]);
      }
    }
    return helpers.sort(less).concat(pivot, helpers.sort(great));
  }
};

helpers.hash = function(string) {
  var hash, i, length;
  hash = 5381;
  i = -1;
  length = string.length;
  while (++i !== string.length) {
    hash = ((hash << 5) - hash) + string.charCodeAt(i);
    hash |= 0;
  }
  return '_' + (hash < 0 ? hash * -2 : hash);
};

helpers.ruleToString = function(rule, important) {
  var j, len1, output, prop, property, props, value;
  output = '';
  props = helpers.sort(Object.keys(rule));
  for (j = 0, len1 = props.length; j < len1; j++) {
    prop = props[j];
    if (typeof rule[prop] === 'string' || typeof rule[prop] === 'number') {
      property = helpers.normalizeProperty(prop);
      value = helpers.normalizeValue(property, rule[prop]);
      if (important) {
        value += " !important";
      }
      output += property + ":" + value + ";";
    }
  }
  return output;
};

helpers.inlineStyleConfig = styleConfig = Object.create(null);

helpers.inlineStyle = function(rule, valueToStore, level) {
  var config, styleEl;
  if (!(config = styleConfig[level])) {
    styleEl = document.createElement('style');
    styleEl.id = "quickcss" + (level || '');
    document.head.appendChild(styleEl);
    styleConfig[level] = config = {
      el: styleEl,
      content: '',
      cache: Object.create(null)
    };
  }
  if (!config.cache[rule]) {
    config.cache[rule] = valueToStore || true;
    config.el.textContent = config.content += rule;
  }
};

helpers.clearInlineStyle = function(level) {
  var config, j, key, keys, len1;
  if (config = styleConfig[level]) {
    if (!config.content) {
      return;
    }
    config.el.textContent = config.content = '';
    keys = Object.keys(config.cache);
    for (j = 0, len1 = keys.length; j < len1; j++) {
      key = keys[j];
      config.cache[key] = null;
    }
  }
};

;
return module.exports;
},
"../node_modules/p-timeout/index.js": function (require, module, exports) {
'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var pFinally = require("../node_modules/p-finally/index.js");

var TimeoutError = function (_Error) {
	_inherits(TimeoutError, _Error);

	function TimeoutError(message) {
		_classCallCheck(this, TimeoutError);

		var _this = _possibleConstructorReturn(this, (TimeoutError.__proto__ || Object.getPrototypeOf(TimeoutError)).call(this, message));

		_this.name = 'TimeoutError';
		return _this;
	}

	return TimeoutError;
}(Error);

module.exports = function (promise, ms, fallback) {
	return new Promise(function (resolve, reject) {
		if (typeof ms !== 'number' && ms >= 0) {
			throw new TypeError('Expected `ms` to be a positive number');
		}

		var timer = setTimeout(function () {
			if (typeof fallback === 'function') {
				resolve(fallback());
				return;
			}

			var message = typeof fallback === 'string' ? fallback : 'Promise timed out after ' + ms + ' milliseconds';
			var err = fallback instanceof Error ? fallback : new TimeoutError(message);

			reject(err);
		}, ms);

		pFinally(promise.then(resolve, reject), function () {
			clearTimeout(timer);
		});
	});
};

module.exports.TimeoutError = TimeoutError;;
return module.exports;
},
"../node_modules/detect-animation-end-helper/index.js": function (require, module, exports) {
module.exports = function (type) {
  var types
  if ( type && ('transition' === type || 'trans' === type) ) {
    types = {
      'OTransition':      'oTransitionEnd',
      'WebkitTransition': 'webkitTransitionEnd',
      'MozTransition':    'transitionend',
      'transition':       'transitionend'
    }
  }
  else { // animation is default
    types = {
      'OAnimation':      'oAnimationEnd',
      'WebkitAnimation': 'webkitAnimationEnd',
      'MozAnimation':    'animationend',
      'animation':       'animationend'
    }
  }
  var elem = document.createElement('fake')
  return Object.keys(types).reduce(function (prev, trans) {
    return undefined !== elem.style[trans]? types[trans]: prev
  }, '')
}
;
return module.exports;
},
"../node_modules/@danielkalen/is/src/natives.coffee": function (require, module, exports) {
var exports;

module.exports = exports = {
  defined: function(subject) {
    return subject !== void 0;
  },
  array: function(subject) {
    return subject instanceof Array;
  },
  object: function(subject) {
    return typeof subject === 'object' && subject;
  },
  objectPlain: function(subject) {
    return exports.object(subject) && Object.prototype.toString.call(subject) === '[object Object]' && subject.constructor === Object;
  },
  string: function(subject) {
    return typeof subject === 'string';
  },
  number: function(subject) {
    return typeof subject === 'number' && !isNaN(subject);
  },
  numberLoose: function(subject) {
    return exports.number(subject) || exports.string(subject) && exports.number(Number(subject));
  },
  "function": function(subject) {
    return typeof subject === 'function';
  },
  iterable: function(subject) {
    return exports.object(subject) && exports.number(subject.length);
  }
};

;
return module.exports;
},
"../node_modules/@danielkalen/is/src/dom.coffee": function (require, module, exports) {
var exports;

module.exports = exports = {
  domDoc: function(subject) {
    return subject && subject.nodeType === 9;
  },
  domEl: function(subject) {
    return subject && subject.nodeType === 1;
  },
  domText: function(subject) {
    return subject && subject.nodeType === 3;
  },
  domNode: function(subject) {
    return exports.domEl(subject) || exports.domText(subject);
  },
  domTextarea: function(subject) {
    return subject && subject.nodeName === 'TEXTAREA';
  },
  domInput: function(subject) {
    return subject && subject.nodeName === 'INPUT';
  },
  domSelect: function(subject) {
    return subject && subject.nodeName === 'SELECT';
  },
  domField: function(subject) {
    return exports.domInput(subject) || exports.domTextarea(subject) || exports.domSelect(subject);
  }
};

;
return module.exports;
},
"../node_modules/quickdom/src/parts/element/stateChain.coffee": function (require, module, exports) {
var StateChain;

module.exports = StateChain = (function() {
  function StateChain(states) {
    this.string = states.join('+');
    this.array = states.slice();
    this.length = states.length;
  }

  StateChain.prototype.includes = function(target) {
    var i, len, ref, state;
    ref = this.array;
    for (i = 0, len = ref.length; i < len; i++) {
      state = ref[i];
      if (state === target) {
        return true;
      }
    }
    return false;
  };

  StateChain.prototype.without = function(target) {
    return this.array.filter(function(state) {
      return state !== target;
    }).join('+');
  };

  StateChain.prototype.isApplicable = function(target, otherActive) {
    var active;
    active = this.array.filter(function(state) {
      return state === target || otherActive.indexOf(state) !== -1;
    });
    return active.length === this.array.length;
  };

  return StateChain;

})();

;
return module.exports;
},
"../node_modules/p-finally/index.js": function (require, module, exports) {
'use strict';

module.exports = function (promise, onFinally) {
	onFinally = onFinally || function () {};

	return promise.then(function (val) {
		return new Promise(function (resolve) {
			resolve(onFinally());
		}).then(function () {
			return val;
		});
	}, function (err) {
		return new Promise(function (resolve) {
			resolve(onFinally());
		}).then(function () {
			throw err;
		});
	});
};;
return module.exports;
}
}, this);
if (typeof define === 'function' && define.umd) {
define(function () {
return require("entry.js");
});
} else if (typeof module === 'object' && module.exports) {
module.exports = require("entry.js");
} else {
return this['quickpopup'] = require("entry.js");
}
}).call(this, null, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : this);

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LmNvZmZlZSIsIi4uL3BhY2thZ2UuanNvbiIsIi4uL25vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvaW5kZXguY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL25vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvYWxsb3dlZE9wdGlvbnMuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL25vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvaGVscGVycy5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcXVpY2tkb20vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9jaGVja3MuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL25vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC9pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcXVpY2tkb20vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy93aW5kb3cuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL25vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvbWVkaWFRdWVyeS5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcXVpY2tkb20vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9iYXRjaC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcXVpY2tkb20vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy90ZW1wbGF0ZS9pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcXVpY2tkb20vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL3NyYy9wYXJ0cy9zaG9ydGN1dHMuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrZG9tL25vZGVfbW9kdWxlcy9xdWlja2RvbS9wYWNrYWdlLmpzb24iLCIuLi9ub2RlX21vZHVsZXMvc21hcnQtZXh0ZW5kL3NyYy9pbmRleC5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvc21hcnQtZXh0ZW5kL25vZGVfbW9kdWxlcy9zbWFydC1leHRlbmQvcGFja2FnZS5qc29uIiwicG9wdXAuY29mZmVlIiwiY2hlY2tzLmNvZmZlZSIsImRlZmF1bHRzLmNvZmZlZSIsInRlbXBsYXRlLmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9xdWlja2Nzcy9zcmMvaW5kZXguY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3F1aWNrY3NzL25vZGVfbW9kdWxlcy9xdWlja2Nzcy9wYWNrYWdlLmpzb24iLCIuLi9ub2RlX21vZHVsZXMvc21hcnQtZXh0ZW5kL3NyYy9leHRlbmQuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL3AtZXZlbnQvaW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvcHJvbWlzZS1icmVhay9pbmRleC5qcyIsImhlbHBlcnMuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL2V2ZW50LWxpdGUvZXZlbnQtbGl0ZS5qcyIsIi4uL25vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vaXMvc3JjL2luZGV4LmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9xdWlja2Nzcy9zcmMvY29uc3RhbnRzLmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9xdWlja2Nzcy9zcmMvaGVscGVycy5jb2ZmZWUiLCIuLi9ub2RlX21vZHVsZXMvcC10aW1lb3V0L2luZGV4LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2RldGVjdC1hbmltYXRpb24tZW5kLWhlbHBlci9pbmRleC5qcyIsIi4uL25vZGVfbW9kdWxlcy9AZGFuaWVsa2FsZW4vaXMvc3JjL25hdGl2ZXMuY29mZmVlIiwiLi4vbm9kZV9tb2R1bGVzL0BkYW5pZWxrYWxlbi9pcy9zcmMvZG9tLmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9xdWlja2RvbS9zcmMvcGFydHMvZWxlbWVudC9zdGF0ZUNoYWluLmNvZmZlZSIsIi4uL25vZGVfbW9kdWxlcy9wLWZpbmFsbHkvaW5kZXguanMiXSwibmFtZXMiOlsiaW1wb3J0OjEiLCJpbXBvcnQ6MiIsImltcG9ydDozIiwiaW1wb3J0OjQiLCJpbXBvcnQ6NSIsImltcG9ydDo2IiwiaW1wb3J0OjciLCJpbmxpbmU6MSIsImlubGluZToyIiwiaW5saW5lOjMiLCJpbmxpbmU6NCIsImlubGluZTo1IiwiaW5saW5lOjYiLCJpbmxpbmU6NyIsImlubGluZTo4IiwiaW5saW5lOjkiLCJpbmxpbmU6MTAiLCJleHBvcnQ6MSIsImV4cG9ydDoyIiwiZXhwb3J0OjMiLCJleHBvcnQ6NCIsImV4cG9ydDo1IiwiZXhwb3J0OjYiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztNQUdBQSxvREFBaUJBOztTQUNYQyx3REFBcUJBOztRQUNwQkMsdUJBQWdCQTs7S0FBUUMsd0JBQ2ZBOztXQUFjQywwQkFFOUJBOztZQUNjQywwQkFBbUJBOztBQUFHQyx3RkFHNUJBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7b0JDWlJDLE9Bb0VFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNsRTZCUCw4REFFOUJBOzs7OztBQUFnQ0MscUVBRWpDQTs7QUNOQU07Ozs7OztDQTRCQ0E7O0FDNUJEQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtRENBOztBQ25EREM7Ozs7Ozs7Ozs7Ozs7OztBQVFDQTs7QUNSREM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTZDdUJBOztBQzdDdkJDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCQ0E7O0FDbEJEQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWlGQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqRkRDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBdUNDQTs7QUN2Q0RDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXVEQ0E7O0FDdkREQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdEb0RBOzttQkN4RHBEQyxRQWlHRUE7Ozs7Ozs7Ozs7O1NDOUZLaEIseURBQ01BOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2tCQ0piTyxPQXVHRUE7Ozs7Ozs7OztlQ3hGa0JQLDJDQUFnQkE7O2VBQzVCQyxpREFBc0JBOztNQUM5QkMsb0RBQWlCQTs7S0FBUUMsd0JBQ2RBOztXQUFjQywwQkFBbUJBOztVQUMxQ0MseUJBRVFBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTJOK3hKQyxtREFBcUJBOzs7Ozs7Ozs7S0NoUDN5Sk4sMkRBQ05BOztNQUFTQyxvREFFUkE7Ozs7Ozs7Ozs7Ozs7QUNIZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7TUM3QmdCRCxvREFFUkE7O0FBQUdpQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O3VCQW9DVEE7O0FBQUVDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsyQkFxQmlCQTs7QUFBRUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7NEJBbURpS0E7O0FBQUVDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt1QkF5QjY1QkE7O0FBQUVDOzs7Ozs7Ozs7Ozs7O3FDQUE2TkE7O0FBQUVDOzs7Ozs7Ozs7c0JBQWdKQTs7Ozs7OztZQ3RJMTdDdEIsd0RBRVZBOztVQUFhQyxzREFBa0JBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O21CQ0huQ00sT0E2RkVBOzs7Ozs7O0FDN0ZGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7ZUMvRGdCUCw2Q0FBb0JBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDRHBDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7S0NyQmdCQSx3QkFDZEE7O1NBQVlDLHdEQUFxQkE7O2tCQUVuQ0MsK0RBQW9DQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ0pwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztXQ25MT0YsNkRBRUpBO09BQVNDLHlEQUNDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTGI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O1lDNUI4QkQsd0RBQzlCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O2VDaUNzSkEsNkNBQW9CQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNuQzFLO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYnVuZGxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIkRPTSA9IF8kc20oJ3F1aWNrZG9tJyApXG5leHRlbmQgPSBfJHNtKCdzbWFydC1leHRlbmQnIClcblBvcHVwID0gXyRzbSgnLi9wb3B1cCcgKVxuSVMgPSBfJHNtKCcuL2NoZWNrcycgKVxuZGVmYXVsdHMgPSBfJHNtKCcuL2RlZmF1bHRzJyApXG50ZW1wbGF0ZXMgPSBfJHNtKCcuL3RlbXBsYXRlJyApXG5fJHNtKCcuL3RlbXBsYXRlJywne2h0bWwgYXMgaHRtbFRlbXBsYXRlfScgICAgKVxuXG5cbm5ld0J1aWxkZXIgPSAoZGVmYXVsdHMsIHRlbXBsYXRlcyktPlxuXHRidWlsZGVyID0gKGFyZyktPlxuXHRcdGFyZ3MgPSBhcmd1bWVudHNcblx0XHRzd2l0Y2hcblx0XHRcdHdoZW4gYXJndW1lbnRzLmxlbmd0aCBpcyAwXG5cdFx0XHRcdG5ldyBQb3B1cChudWxsLCBkZWZhdWx0cywgdGVtcGxhdGVzKVxuXG5cdFx0XHR3aGVuIHR5cGVvZiBhcmcgaXMgJ3N0cmluZydcblx0XHRcdFx0bmV3IFBvcHVwKGNvbnRlbnQ6aHRtbFRlbXBsYXRlLnNwYXduKGRhdGE6aHRtbDphcmcpLCBkZWZhdWx0cywgdGVtcGxhdGVzKVxuXHRcdFx0XG5cdFx0XHR3aGVuIERPTS5pc0VsKGFyZyksIERPTS5pc1F1aWNrRWwoYXJnKVxuXHRcdFx0XHRuZXcgUG9wdXAoY29udGVudDphcmcsIGRlZmF1bHRzLCB0ZW1wbGF0ZXMpXG5cdFx0XHRcblx0XHRcdHdoZW4gRE9NLmlzVGVtcGxhdGUoYXJnKVxuXHRcdFx0XHRuZXcgUG9wdXAoY29udGVudDphcmcuc3Bhd24oKSwgZGVmYXVsdHMsIHRlbXBsYXRlcylcblxuXHRcdFx0d2hlbiBhcmcgYW5kIHR5cGVvZiBhcmcgaXMgJ29iamVjdCdcblx0XHRcdFx0bmV3IFBvcHVwKGFyZywgZGVmYXVsdHMsIHRlbXBsYXRlcylcblxuXHRcdFx0ZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgYXJndW1lbnQgcHJvdmlkZWQgdG8gUXVpY2tQb3B1cCcpXG5cblxuXHRidWlsZGVyLmNvbmZpZyA9IChuZXdTZXR0aW5ncywgbmV3VGVtcGxhdGVzKS0+XG5cdFx0dGhyb3cgbmV3IEVycm9yIFwiUXVpY2tQb3B1cCBDb25maWc6IGludmFsaWQgY29uZmlnIG9iamVjdCBwcm92aWRlZCAje1N0cmluZyBuZXdTZXR0aW5nc31cIiBpZiBub3QgSVMub2JqZWN0KG5ld1NldHRpbmdzKVxuXHRcdG91dHB1dFNldHRpbmdzID0gZXh0ZW5kLmNsb25lLmRlZXAoZGVmYXVsdHMsIG5ld1NldHRpbmdzKVxuXG5cdFx0aWYgbm90IElTLm9iamVjdChuZXdUZW1wbGF0ZXMpXG5cdFx0XHRvdXRwdXRUZW1wbGF0ZXMgPSB0ZW1wbGF0ZXNcblx0XHRlbHNlXG5cdFx0XHRvdXRwdXRUZW1wbGF0ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cdFx0XHRmb3IgbmFtZSx0ZW1wbGF0ZSBvZiB0ZW1wbGF0ZXNcblx0XHRcdFx0aWYgbmV3VGVtcGxhdGVzW25hbWVdXG5cdFx0XHRcdFx0b3V0cHV0VGVtcGxhdGVzW25hbWVdID0gdGVtcGxhdGUuZXh0ZW5kKG5ld1RlbXBsYXRlc1tuYW1lXSlcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdG91dHB1dFRlbXBsYXRlc1tuYW1lXSA9IHRlbXBsYXRlXG5cdFx0XG5cdFx0cmV0dXJuIG5ld0J1aWxkZXIob3V0cHV0U2V0dGluZ3MsIG91dHB1dFRlbXBsYXRlcylcblx0XG5cblx0YnVpbGRlci53cmFwQm9keSA9ICgpLT4gUG9wdXAud3JhcEJvZHkoKVxuXHRidWlsZGVyLnVud3JhcEJvZHkgPSAoKS0+IFBvcHVwLnVud3JhcEJvZHkoKVxuXHRidWlsZGVyLmRlc3Ryb3lBbGwgPSAoKS0+IFBvcHVwLmRlc3Ryb3lBbGwoKVxuXHRidWlsZGVyLnZlcnNpb24gPSBfJHNtKCcuLi9wYWNrYWdlLmpzb24gJCB2ZXJzaW9uJyApXG5cdGJ1aWxkZXIuZGVmYXVsdHMgPSBkZWZhdWx0c1xuXHRidWlsZGVyLnRlbXBsYXRlcyA9IHRlbXBsYXRlc1xuXHRyZXR1cm4gYnVpbGRlclxuXG5cblxuXG5cblF1aWNrUG9wdXAgPSBuZXdCdWlsZGVyKGRlZmF1bHRzLCB0ZW1wbGF0ZXMpXG5tb2R1bGUuZXhwb3J0cyA9IFF1aWNrUG9wdXBcblxuXG5cbiIsIntcbiAgXCJuYW1lXCI6IFwicXVpY2twb3B1cFwiLFxuICBcInZlcnNpb25cIjogXCIxLjAuMFwiLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiRmFzdCAmIGxpZ2h0IG1vZGFsIHBvcHVwIGNyZWF0b3IgcHJvdmlkaW5nIHJpY2ggY29uZmlndXJhdGlvbiBhbmQgc3R5bGluZ1wiLFxuICBcIm1haW5cIjogXCJkaXN0L3F1aWNrcG9wdXAuanNcIixcbiAgXCJicm93c2VyXCI6IHtcbiAgICBcIi4vZGVidWdcIjogXCJkaXN0L3F1aWNrcG9wdXAuZGVidWcuanNcIixcbiAgICBcIi4vZGlzdC9xdWlja3BvcHVwLmpzXCI6IFwic3JjL3F1aWNrcG9wdXAuY29mZmVlXCJcbiAgfSxcbiAgXCJicm93c2VyaWZ5XCI6IHtcbiAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICBcInNpbXBseWltcG9ydC9jb21wYXRcIlxuICAgIF1cbiAgfSxcbiAgXCJzaW1wbHlpbXBvcnRcIjoge1xuICAgIFwiZmluYWxUcmFuc2Zvcm1cIjogW1xuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXN1cGVyXCIsXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktcmVuYW1lXCIsXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktc2ltcGxlXCJcbiAgICBdXG4gIH0sXG4gIFwiZGlyZWN0b3JpZXNcIjoge1xuICAgIFwidGVzdFwiOiBcInRlc3RcIlxuICB9LFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwicG9zdHZlcnNpb25cIjogXCJucG0gcnVuIGJ1aWxkICYmIGdpdCBhZGQgLiAmJiBnaXQgY29tbWl0IC1hIC1tICdbQnVpbGRdJ1wiLFxuICAgIFwicHJlcHVibGlzaE9ubHlcIjogXCJucG0gcnVuIHRlc3RcIixcbiAgICBcInBvc3RwdWJsaXNoXCI6IFwiZ2l0IHB1c2hcIixcbiAgICBcIndhdGNoXCI6IFwiY2FrZSAtZCB3YXRjaFwiLFxuICAgIFwiYnVpbGRcIjogXCJjYWtlIC1kIGJ1aWxkICYmIGNha2UgYnVpbGQgJiYgY2FrZSBtZWFzdXJlICYmIGNwIC1yIGJ1aWxkLyogZGlzdC9cIixcbiAgICBcInRlc3RcIjogXCJucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyB8fCB0cnVlXCIsXG4gICAgXCJ0ZXN0OnRyYXZpc1wiOiBcIm5wbSBydW4gdGVzdDpicm93c2VyIC1zICYmIG5wbSBydW4gdGVzdDptaW5pZmllZCAtc1wiLFxuICAgIFwidGVzdDpicm93c2VyXCI6IFwiY2FrZSBpbnN0YWxsOmthcm1hOyBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBFbGVjdHJvbiAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmxvY2FsXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7IG9wZW4gdGVzdC90ZXN0cnVubmVyLmh0bWxcIixcbiAgICBcInRlc3Q6bWluaWZpZWRcIjogXCJtaW5pZmllZD0xIG5wbSBydW4gdGVzdDpicm93c2VyIC1zIHx8IHRydWVcIixcbiAgICBcInRlc3Q6c2F1Y2VcIjogXCJjYWtlIGluc3RhbGw6a2FybWE7IHNhdWNlPTEga2FybWEgc3RhcnQgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDprYXJtYVwiOiBcImNha2UgaW5zdGFsbDprYXJtYTsga2FybWEgc3RhcnQgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwiY292ZXJhZ2VcIjogXCJjYWtlIGluc3RhbGw6Y292ZXJhZ2U7IG5wbSBydW4gY292ZXJhZ2U6cnVuICYmIG5wbSBydW4gY292ZXJhZ2U6YmFkZ2VcIixcbiAgICBcImNvdmVyYWdlOnJ1blwiOiBcImNvdmVyYWdlPXRydWUgbnBtIHJ1biB0ZXN0OmVsZWN0cm9uXCIsXG4gICAgXCJjb3ZlcmFnZTpiYWRnZVwiOiBcImJhZGdlLWdlbiAtZCAuLy5jb25maWcvYmFkZ2VzL2NvdmVyYWdlXCIsXG4gICAgXCJjb3ZlcmFnZTpzaG93XCI6IFwib3BlbiBjb3ZlcmFnZS9sY292LXJlcG9ydC9pbmRleC5odG1sXCJcbiAgfSxcbiAgXCJyZXBvc2l0b3J5XCI6IHtcbiAgICBcInR5cGVcIjogXCJnaXRcIixcbiAgICBcInVybFwiOiBcImdpdCtodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2twb3B1cC5naXRcIlxuICB9LFxuICBcImF1dGhvclwiOiBcImRhbmllbGthbGVuXCIsXG4gIFwibGljZW5zZVwiOiBcIklTQ1wiLFxuICBcImJ1Z3NcIjoge1xuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3F1aWNrcG9wdXAvaXNzdWVzXCJcbiAgfSxcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja3BvcHVwI3JlYWRtZVwiLFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAZGFuaWVsa2FsZW4vaXNcIjogXCJeMi4wLjBcIixcbiAgICBcImRldGVjdC1hbmltYXRpb24tZW5kLWhlbHBlclwiOiBcIl4wLjEuMFwiLFxuICAgIFwiZXZlbnQtbGl0ZVwiOiBcIl4wLjEuMVwiLFxuICAgIFwicC1ldmVudFwiOiBcIl4xLjMuMFwiLFxuICAgIFwicHJvbWlzZS1icmVha1wiOiBcIl4wLjEuMlwiLFxuICAgIFwicXVpY2tkb21cIjogXCJeMS4wLjc3XCIsXG4gICAgXCJzbWFydC1leHRlbmRcIjogXCJeMS43LjNcIlxuICB9LFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJibHVlYmlyZFwiOiBcIl4zLjUuMFwiLFxuICAgIFwiY2hhbGtcIjogXCJeMi4wLjFcIixcbiAgICBcImNvZmZlZS1zY3JpcHRcIjogXCJeMS4xMi42XCIsXG4gICAgXCJmcy1qZXRwYWNrXCI6IFwiXjAuMTMuM1wiLFxuICAgIFwicGFja2FnZS1pbnN0YWxsXCI6IFwiXjEuMC4wXCJcbiAgfVxufVxuIiwic3ZnTmFtZXNwYWNlID0gJ2h0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnJ1xuIyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuaW1wb3J0ICogYXMgQ1NTIGZyb20gJ3F1aWNrY3NzJ1xuIyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuaW1wb3J0ICogYXMgZXh0ZW5kIGZyb20gJ3NtYXJ0LWV4dGVuZCdcbmltcG9ydCAnLi9wYXJ0cy9hbGxvd2VkT3B0aW9ucydcbmltcG9ydCAnLi9wYXJ0cy9oZWxwZXJzJ1xuaW1wb3J0ICcuL3BhcnRzL2NoZWNrcydcbmltcG9ydCAnLi9wYXJ0cy9lbGVtZW50J1xuaW1wb3J0ICcuL3BhcnRzL3dpbmRvdydcbmltcG9ydCAnLi9wYXJ0cy9tZWRpYVF1ZXJ5J1xuXG5RdWlja0RvbSA9ICgpLT4gYXJncz1hcmd1bWVudHM7IHN3aXRjaFxuXHR3aGVuIElTLmFycmF5KGFyZ3NbMF0pXG5cdFx0cmV0dXJuIFF1aWNrRG9tKGFyZ3NbMF0uLi4pXG5cdFxuXHR3aGVuIElTLnRlbXBsYXRlKGFyZ3NbMF0pXG5cdFx0cmV0dXJuIGFyZ3NbMF0uc3Bhd24oKVxuXHRcblx0d2hlbiBJUy5xdWlja0RvbUVsKGFyZ3NbMF0pXG5cdFx0cmV0dXJuIGlmIGFyZ3NbMV0gdGhlbiBhcmdzWzBdLnVwZGF0ZU9wdGlvbnMoYXJnc1sxXSkgZWxzZSBhcmdzWzBdXG5cdFxuXHR3aGVuIElTLmRvbU5vZGUoYXJnc1swXSkgb3IgSVMuZG9tRG9jKGFyZ3NbMF0pXG5cdFx0aWYgYXJnc1swXS5fcXVpY2tFbGVtZW50XG5cdFx0XHRyZXR1cm4gYXJnc1swXS5fcXVpY2tFbGVtZW50XG5cdFx0XG5cdFx0dHlwZSA9IGFyZ3NbMF0ubm9kZU5hbWUudG9Mb3dlckNhc2UoKS5yZXBsYWNlKCcjJywgJycpXG5cdFx0b3B0aW9ucyA9IGFyZ3NbMV0gb3Ige31cblx0XHRvcHRpb25zLmV4aXN0aW5nID0gYXJnc1swXVxuXHRcdHJldHVybiBuZXcgUXVpY2tFbGVtZW50KHR5cGUsIG9wdGlvbnMpXG5cblx0d2hlbiBhcmdzWzBdIGlzIHdpbmRvd1xuXHRcdHJldHVybiBRdWlja1dpbmRvd1xuXG5cdHdoZW4gSVMuc3RyaW5nKGFyZ3NbMF0pXHRcdFx0XG5cdFx0dHlwZSA9IGFyZ3NbMF0udG9Mb3dlckNhc2UoKVxuXHRcdGlmIHR5cGUgaXMgJ3RleHQnXG5cdFx0XHRvcHRpb25zID0gaWYgSVMub2JqZWN0KGFyZ3NbMV0pIHRoZW4gYXJnc1sxXSBlbHNlIHt0ZXh0OmFyZ3NbMV0gb3IgJyd9XG5cdFx0ZWxzZVxuXHRcdFx0b3B0aW9ucyA9IGlmIElTLm9iamVjdChhcmdzWzFdKSB0aGVuIGFyZ3NbMV0gZWxzZSB7fVxuXHRcdFxuXHRcdGVsZW1lbnQgPSBuZXcgUXVpY2tFbGVtZW50KHR5cGUsIG9wdGlvbnMpXG5cdFx0aWYgYXJncy5sZW5ndGggPiAyXG5cdFx0XHRjaGlsZHJlbiA9IFtdOyBpID0gMTsgYXJnc0xlbmd0aCA9IGFyZ3MubGVuZ3RoOyBjaGlsZHJlbi5wdXNoKGFyZ3NbaV0pIHdoaWxlICsraSA8IGFyZ3NMZW5ndGhcblxuXHRcdFx0Zm9yIGNoaWxkIGluIGNoaWxkcmVuXG5cdFx0XHRcdGNoaWxkID0gUXVpY2tEb20udGV4dChjaGlsZCkgaWYgSVMuc3RyaW5nKGNoaWxkKVxuXHRcdFx0XHRjaGlsZCA9IGNoaWxkLnNwYXduKGZhbHNlKSBpZiBJUy50ZW1wbGF0ZShjaGlsZClcblx0XHRcdFx0Y2hpbGQgPSBRdWlja0RvbShjaGlsZC4uLikgaWYgSVMuYXJyYXkoY2hpbGQpXG5cdFx0XHRcdGNoaWxkLmFwcGVuZFRvKGVsZW1lbnQpIGlmIElTLnF1aWNrRG9tRWwoY2hpbGQpXG5cblx0XHRyZXR1cm4gZWxlbWVudFxuXG5cdHdoZW4gYXJnc1swXSBhbmQgKElTLmRvbU5vZGUoYXJnc1swXVswXSkgb3IgSVMuZG9tRG9jKGFyZ3NbMF1bMF0pKVxuXHRcdHJldHVybiBRdWlja0RvbShhcmdzWzBdWzBdKVxuXG5cblF1aWNrRG9tLnRlbXBsYXRlID0gKHRyZWUpLT5cblx0bmV3IFF1aWNrVGVtcGxhdGUodHJlZSwgdHJ1ZSlcblxuXG5RdWlja0RvbS5odG1sID0gKGlubmVySFRNTCktPlxuXHRjb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKVxuXHRjb250YWluZXIuaW5uZXJIVE1MID0gaW5uZXJIVE1MXG5cdGNoaWxkcmVuID0gQXJyYXk6OnNsaWNlLmNhbGwgY29udGFpbmVyLmNoaWxkTm9kZXNcblxuXHRyZXR1cm4gUXVpY2tEb20uYmF0Y2goY2hpbGRyZW4pXG5cblF1aWNrRG9tLnF1ZXJ5ID0gKHRhcmdldCktPlxuXHRRdWlja0RvbShkb2N1bWVudCkucXVlcnkodGFyZ2V0KVxuXG5RdWlja0RvbS5xdWVyeUFsbCA9ICh0YXJnZXQpLT5cblx0UXVpY2tEb20oZG9jdW1lbnQpLnF1ZXJ5QWxsKHRhcmdldClcblxuUXVpY2tEb20uaXNUZW1wbGF0ZSA9ICh0YXJnZXQpLT5cblx0SVMudGVtcGxhdGUodGFyZ2V0KVxuXG5RdWlja0RvbS5pc1F1aWNrRWwgPSAodGFyZ2V0KS0+XG5cdElTLnF1aWNrRG9tRWwodGFyZ2V0KVxuXG5RdWlja0RvbS5pc0VsID0gKHRhcmdldCktPlxuXHRJUy5kb21FbCh0YXJnZXQpXG5cblxuXG5cblxuaW1wb3J0ICcuL3BhcnRzL2JhdGNoJ1xuaW1wb3J0ICcuL3BhcnRzL3RlbXBsYXRlJ1xuaW1wb3J0ICcuL3BhcnRzL3Nob3J0Y3V0cydcblF1aWNrRG9tLnZlcnNpb24gPSBpbXBvcnQgJy4uL3BhY2thZ2UuanNvbiAkIHZlcnNpb24nXG5RdWlja0RvbS5DU1MgPSBDU1Ncbm1vZHVsZS5leHBvcnRzID0gUXVpY2tEb21cblxuXG5cbiIsImFsbG93ZWRUZW1wbGF0ZU9wdGlvbnMgPSBbICMgVG8gY29weSBmcm9tIERPTSBFbGVtZW50c1xuXHQnaWQnXG5cdCduYW1lJ1xuXHQndHlwZSdcblx0J2hyZWYnXG5cdCdzZWxlY3RlZCdcblx0J2NoZWNrZWQnXG5cdCdjbGFzc05hbWUnXG5dXG5cbmFsbG93ZWRPcHRpb25zID0gWyAjIFVzZWQgaW4gUXVpY2tFbGVtZW50Ojp0b0pTT05cblx0J2lkJ1xuXHQncmVmJ1xuXHQndHlwZSdcblx0J25hbWUnXG5cdCd0ZXh0J1xuXHQnc3R5bGUnXG5cdCdjbGFzcydcblx0J2NsYXNzTmFtZSdcblx0J3VybCdcblx0J2hyZWYnXG5cdCdzZWxlY3RlZCdcblx0J2NoZWNrZWQnXG5cdCdwcm9wcydcblx0J2F0dHJzJ1xuXHQncGFzc1N0YXRlVG9DaGlsZHJlbidcblx0J3N0YXRlVHJpZ2dlcnMnXG5cdCMgJ3JlbGF0ZWRJbnN0YW5jZSdcbl0iLCJoZWxwZXJzID0ge31cblxuaGVscGVycy5pbmNsdWRlcyA9ICh0YXJnZXQsIGl0ZW0pLT5cblx0dGFyZ2V0IGFuZCB0YXJnZXQuaW5kZXhPZihpdGVtKSBpc250IC0xXG5cbmhlbHBlcnMucmVtb3ZlSXRlbSA9ICh0YXJnZXQsIGl0ZW0pLT5cblx0aXRlbUluZGV4ID0gdGFyZ2V0LmluZGV4T2YoaXRlbSlcblx0dGFyZ2V0LnNwbGljZShpdGVtSW5kZXgsIDEpICBpZiBpdGVtSW5kZXggaXNudCAtMVxuXHRyZXR1cm4gdGFyZ2V0XG5cbmhlbHBlcnMubm9ybWFsaXplR2l2ZW5FbCA9ICh0YXJnZXRFbCktPiBzd2l0Y2hcblx0d2hlbiBJUy5zdHJpbmcodGFyZ2V0RWwpIHRoZW4gUXVpY2tEb20udGV4dCh0YXJnZXRFbClcblx0d2hlbiBJUy5kb21Ob2RlKHRhcmdldEVsKSB0aGVuIFF1aWNrRG9tKHRhcmdldEVsKVxuXHR3aGVuIElTLnRlbXBsYXRlKHRhcmdldEVsKSB0aGVuIHRhcmdldEVsLnNwYXduKClcblx0ZWxzZSB0YXJnZXRFbFxuXG5cbmhlbHBlcnMuaXNTdGF0ZVN0eWxlID0gKHN0cmluZyktPlxuXHRzdHJpbmdbMF0gaXMgJyQnIG9yIHN0cmluZ1swXSBpcyAnQCdcblxuXG5oZWxwZXJzLnJlZ2lzdGVyU3R5bGUgPSAocnVsZSwgbGV2ZWwsIGltcG9ydGFudCktPlxuXHRsZXZlbCB8fD0gMFxuXHRjYWNoZWQgPSBzdHlsZUNhY2hlLmdldChydWxlLCBsZXZlbClcblx0cmV0dXJuIGNhY2hlZCBpZiBjYWNoZWRcblx0b3V0cHV0ID0ge2NsYXNzTmFtZTpbQ1NTLnJlZ2lzdGVyKHJ1bGUsIGxldmVsLCBpbXBvcnRhbnQpXSwgZm5zOltdLCBydWxlfVxuXHRwcm9wcyA9IE9iamVjdC5rZXlzKHJ1bGUpXG5cdFxuXHRmb3IgcHJvcCBpbiBwcm9wcyB3aGVuIHR5cGVvZiBydWxlW3Byb3BdIGlzICdmdW5jdGlvbidcblx0XHRvdXRwdXQuZm5zLnB1c2ggW3Byb3AsIHJ1bGVbcHJvcF1dXG5cblx0cmV0dXJuIHN0eWxlQ2FjaGUuc2V0KHJ1bGUsIG91dHB1dCwgbGV2ZWwpXG5cblxuc3R5bGVDYWNoZSA9IG5ldyBjbGFzc1xuXHRjb25zdHJ1Y3RvcjogKCktPlxuXHRcdEBrZXlzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXHRcdEB2YWx1ZXMgPSBPYmplY3QuY3JlYXRlKG51bGwpXG5cblx0Z2V0OiAoa2V5LCBsZXZlbCktPiBpZiBAa2V5c1tsZXZlbF1cblx0XHRpbmRleCA9IEBrZXlzW2xldmVsXS5pbmRleE9mKGtleSlcblx0XHRyZXR1cm4gQHZhbHVlc1tsZXZlbF1baW5kZXhdIGlmIGluZGV4IGlzbnQgLTFcblxuXHRzZXQ6IChrZXksIHZhbHVlLCBsZXZlbCktPlxuXHRcdGlmIG5vdCBAa2V5c1tsZXZlbF1cblx0XHRcdEBrZXlzW2xldmVsXSA9IFtdXG5cdFx0XHRAdmFsdWVzW2xldmVsXSA9IFtdXG5cblx0XHRAa2V5c1tsZXZlbF0ucHVzaCBrZXlcblx0XHRAdmFsdWVzW2xldmVsXS5wdXNoIHZhbHVlXG5cdFx0cmV0dXJuIHZhbHVlXG5cbiIsIklTID0gaW1wb3J0ICdAZGFuaWVsa2FsZW4vaXMnXG5JUyA9IElTLmNyZWF0ZSgnbmF0aXZlcycsJ2RvbScpXG5JUy5sb2FkXHRcblx0cXVpY2tEb21FbDogKHN1YmplY3QpLT4gc3ViamVjdCBhbmQgc3ViamVjdC5jb25zdHJ1Y3Rvci5uYW1lIGlzIFF1aWNrRWxlbWVudC5uYW1lXG5cdFxuXHR0ZW1wbGF0ZTogKHN1YmplY3QpLT4gc3ViamVjdCBhbmQgc3ViamVjdC5jb25zdHJ1Y3Rvci5uYW1lIGlzIFF1aWNrVGVtcGxhdGUubmFtZVxuXHRcblx0IyBiYXRjaDogKHN1YmplY3QpLT4gc3ViamVjdCBhbmQgc3ViamVjdC5jb25zdHJ1Y3Rvci5uYW1lIGlzICdRdWlja0JhdGNoJ1xuXG4iLCJjbGFzcyBRdWlja0VsZW1lbnRcblx0Y29uc3RydWN0b3I6IChAdHlwZSwgQG9wdGlvbnMpLT5cblx0XHRAc3ZnID0gdHJ1ZSBpZiBAdHlwZVswXSBpcyAnKidcblx0XHRAZWwgPSBAb3B0aW9ucy5leGlzdGluZyBvclxuXHRcdFx0aWYgQHR5cGUgaXMgJ3RleHQnIHRoZW4gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoaWYgdHlwZW9mIEBvcHRpb25zLnRleHQgaXMgJ3N0cmluZycgdGhlbiBAb3B0aW9ucy50ZXh0IGVsc2UgJycpXG5cdFx0XHRlbHNlIGlmIEBzdmcgdGhlbiBkb2N1bWVudC5jcmVhdGVFbGVtZW50TlMoc3ZnTmFtZXNwYWNlLCBAdHlwZS5zbGljZSgxKSlcblx0XHRcdGVsc2UgZG9jdW1lbnQuY3JlYXRlRWxlbWVudChAdHlwZSlcblxuXHRcdGlmIEB0eXBlIGlzICd0ZXh0J1xuXHRcdFx0QGFwcGVuZCA9IEBwcmVwZW5kID0gQGF0dHIgPSAoKS0+XG5cdFx0XHQjIEBfdGV4dHMgPSB7fSAjIGRlZmluZWQgY29uZGl0aW9uYWxseVxuXG5cdFx0QF9wYXJlbnQgPSBudWxsXG5cdFx0QF9zdHlsZXMgPSB7fVxuXHRcdEBfc3RhdGUgPSBbXVxuXHRcdEBfY2hpbGRyZW4gPSBbXVxuXHRcdCMgQF9wcm92aWRlZFN0YXRlcyA9IFtdXHRcdFx0XHQjIGRlZmluZWQgY29uZGl0aW9uYWxseVxuXHRcdCMgQF9wcm92aWRlZFN0YXRlc1NoYXJlZCA9IFtdXHRcdCMgZGVmaW5lZCBjb25kaXRpb25hbGx5XG5cdFx0IyBAX2V2ZW50Q2FsbGJhY2tzID0ge19fcmVmczp7fX1cdCMgZGVmaW5lZCBjb25kaXRpb25hbGx5XG5cdFx0XG5cdFx0QF9ub3JtYWxpemVPcHRpb25zKClcblx0XHRAX2FwcGx5T3B0aW9ucygpXG5cdFx0QF9hdHRhY2hTdGF0ZUV2ZW50cygpXG5cdFx0QF9wcm94eVBhcmVudCgpXG5cdFx0QF9yZWZyZXNoUGFyZW50KCkgaWYgQG9wdGlvbnMuZXhpc3Rpbmdcblx0XHRAZWwuX3F1aWNrRWxlbWVudCA9IEBcblxuXG5cdHRvSlNPTjogKCktPlxuXHRcdG91dHB1dCA9IFtAdHlwZSwgZXh0ZW5kLmNsb25lLmtleXMoYWxsb3dlZE9wdGlvbnMpKEBvcHRpb25zKV1cblx0XHRjaGlsZHJlbiA9IEBjaGlsZHJlblxuXHRcdG91dHB1dC5wdXNoKGNoaWxkLnRvSlNPTigpKSBmb3IgY2hpbGQgaW4gY2hpbGRyZW5cblx0XHRyZXR1cm4gb3V0cHV0XG5cbiMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcblF1aWNrRWxlbWVudC5uYW1lID89ICdRdWlja0VsZW1lbnQnXG5cbmltcG9ydCAnLi9hbGlhc2VzJ1xuaW1wb3J0ICcuL3RyYXZlcnNpbmcnXG5pbXBvcnQgJy4vaW5pdCdcbmltcG9ydCAnLi9ldmVudHMnXG5pbXBvcnQgJy4vc3RhdGUnXG5pbXBvcnQgJy4vc3R5bGUnXG5pbXBvcnQgJy4vYXR0cmlidXRlcy1hbmQtcHJvcGVydGllcydcbmltcG9ydCAnLi9tYW5pcHVsYXRpb24nXG5pbXBvcnQgJy4vYXBwbGljYXRpb24nXG4iLCJRdWlja1dpbmRvdyA9IFxuXHR0eXBlOiAnd2luZG93J1xuXHRlbDogd2luZG93XG5cdHJhdzogd2luZG93XG5cdF9ldmVudENhbGxiYWNrczoge19fcmVmczp7fX1cblx0XG5cblF1aWNrV2luZG93Lm9uID0gIFF1aWNrRWxlbWVudDo6b25cblF1aWNrV2luZG93Lm9mZiA9ICBRdWlja0VsZW1lbnQ6Om9mZlxuUXVpY2tXaW5kb3cuZW1pdCA9ICBRdWlja0VsZW1lbnQ6OmVtaXRcblF1aWNrV2luZG93LmVtaXRQcml2YXRlID0gIFF1aWNrRWxlbWVudDo6ZW1pdFByaXZhdGVcblF1aWNrV2luZG93Ll9saXN0ZW5UbyA9ICBRdWlja0VsZW1lbnQ6Ol9saXN0ZW5Ub1xuUXVpY2tXaW5kb3cuX2ludm9rZUhhbmRsZXJzID0gIFF1aWNrRWxlbWVudDo6X2ludm9rZUhhbmRsZXJzXG5PYmplY3QuZGVmaW5lUHJvcGVydGllcyBRdWlja1dpbmRvdyxcblx0J3dpZHRoJzogZ2V0OiAoKS0+IHdpbmRvdy5pbm5lcldpZHRoXG5cdCdoZWlnaHQnOiBnZXQ6ICgpLT4gd2luZG93LmlubmVySGVpZ2h0XG5cdCdvcmllbnRhdGlvbic6IG9yaWVudGF0aW9uR2V0dGVyXG5cdCdhc3BlY3RSYXRpbyc6IGFzcGVjdFJhdGlvR2V0dGVyXG5cbiIsIk1lZGlhUXVlcnkgPSBuZXcgKCktPlxuXHRjYWxsYmFja3MgPSBbXVxuXG5cdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyICdyZXNpemUnLCAoKS0+XG5cdFx0Y2FsbGJhY2soKSBmb3IgY2FsbGJhY2sgaW4gY2FsbGJhY2tzXG5cdFx0cmV0dXJuXG5cblx0QHBhcnNlUXVlcnkgPSAodGFyZ2V0LCBxdWVyeVN0cmluZyktPlxuXHRcdHF1ZXJ5U3BsaXQgPSBxdWVyeVN0cmluZy5zcGxpdCgnKCcpXG5cdFx0c291cmNlID0gcXVlcnlTcGxpdFswXVxuXHRcdHNvdXJjZSA9IHN3aXRjaCBzb3VyY2Vcblx0XHRcdHdoZW4gJ3dpbmRvdycgdGhlbiBRdWlja1dpbmRvd1xuXHRcdFx0d2hlbiAncGFyZW50JyB0aGVuIHRhcmdldC5wYXJlbnRcblx0XHRcdHdoZW4gJ3NlbGYnIHRoZW4gdGFyZ2V0XG5cdFx0XHRlbHNlIHRhcmdldC5wYXJlbnRNYXRjaGluZyAocGFyZW50KS0+IHBhcmVudC5yZWYgaXMgc291cmNlLnNsaWNlKDEpXG5cblx0XHRydWxlcyA9IHF1ZXJ5U3BsaXRbMV1cblx0XHRcdC5zbGljZSgwLC0xKVxuXHRcdFx0LnNwbGl0KHJ1bGVEZWxpbWl0ZXIpXG5cdFx0XHQubWFwIChydWxlKS0+IFxuXHRcdFx0XHRzcGxpdCA9IHJ1bGUuc3BsaXQoJzonKVxuXHRcdFx0XHR2YWx1ZSA9IHBhcnNlRmxvYXQoc3BsaXRbMV0pXG5cdFx0XHRcdHZhbHVlID0gc3BsaXRbMV0gaWYgaXNOYU4odmFsdWUpXG5cdFx0XHRcdGtleSA9IHNwbGl0WzBdXG5cdFx0XHRcdGtleVByZWZpeCA9IGtleS5zbGljZSgwLDQpXG5cdFx0XHRcdG1heCA9IGtleVByZWZpeCBpcyAnbWF4LSdcblx0XHRcdFx0bWluID0gbm90IG1heCBhbmQga2V5UHJlZml4IGlzICdtaW4tJ1xuXHRcdFx0XHRrZXkgPSBrZXkuc2xpY2UoNCkgaWYgbWF4IG9yIG1pblxuXHRcdFx0XHRnZXR0ZXIgPSBzd2l0Y2gga2V5XG5cdFx0XHRcdFx0d2hlbiAnb3JpZW50YXRpb24nIHRoZW4gKCktPiBzb3VyY2Uub3JpZW50YXRpb25cblx0XHRcdFx0XHR3aGVuICdhc3BlY3QtcmF0aW8nIHRoZW4gKCktPiBzb3VyY2UuYXNwZWN0UmF0aW9cblx0XHRcdFx0XHR3aGVuICd3aWR0aCcsJ2hlaWdodCcgdGhlbiAoKS0+IHNvdXJjZVtrZXldXG5cdFx0XHRcdFx0ZWxzZSAoKS0+XG5cdFx0XHRcdFx0XHRzdHJpbmdWYWx1ZSA9IHNvdXJjZS5zdHlsZShrZXkpXG5cdFx0XHRcdFx0XHRwYXJzZWRWYWx1ZSA9IHBhcnNlRmxvYXQgc3RyaW5nVmFsdWVcblx0XHRcdFx0XHRcdHJldHVybiBpZiBpc05hTihwYXJzZWRWYWx1ZSkgdGhlbiBzdHJpbmdWYWx1ZSBlbHNlIHBhcnNlZFZhbHVlXG5cdFx0XHRcdFxuXHRcdFx0XHRyZXR1cm4ge2tleSx2YWx1ZSxtaW4sbWF4LGdldHRlcn1cblxuXHRcdHJldHVybiB7c291cmNlLCBydWxlc31cblxuXG5cdEByZWdpc3RlciA9ICh0YXJnZXQsIHF1ZXJ5U3RyaW5nKS0+XG5cdFx0cXVlcnkgPSBAcGFyc2VRdWVyeSh0YXJnZXQsIHF1ZXJ5U3RyaW5nKVxuXHRcdGlmIHF1ZXJ5LnNvdXJjZVxuXHRcdFx0Y2FsbGJhY2tzLnB1c2ggY2FsbGJhY2sgPSAoKS0+IHRlc3RSdWxlKHRhcmdldCwgcXVlcnksIHF1ZXJ5U3RyaW5nKVxuXHRcdFx0Y2FsbGJhY2soKVxuXHRcdHJldHVybiBxdWVyeVxuXG5cblx0dGVzdFJ1bGUgPSAodGFyZ2V0LCBxdWVyeSwgcXVlcnlTdHJpbmcpLT5cblx0XHRwYXNzZWQgPSB0cnVlXG5cblx0XHRmb3IgcnVsZSBpbiBxdWVyeS5ydWxlc1xuXHRcdFx0Y3VycmVudFZhbHVlID0gcnVsZS5nZXR0ZXIoKVxuXHRcdFx0cGFzc2VkID0gc3dpdGNoXG5cdFx0XHRcdHdoZW4gcnVsZS5taW4gdGhlbiBjdXJyZW50VmFsdWUgPj0gcnVsZS52YWx1ZVxuXHRcdFx0XHR3aGVuIHJ1bGUubWF4IHRoZW4gY3VycmVudFZhbHVlIDw9IHJ1bGUudmFsdWVcblx0XHRcdFx0ZWxzZSBjdXJyZW50VmFsdWUgaXMgcnVsZS52YWx1ZVxuXG5cdFx0XHRicmVhayBpZiBub3QgcGFzc2VkXHRcdFxuXHRcdFxuXHRcdHRhcmdldC5zdGF0ZShxdWVyeVN0cmluZywgcGFzc2VkKVxuXG5cdHJldHVybiBAXG5cblxuXG5cbnJ1bGVEZWxpbWl0ZXIgPSAvLFxccyovXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG4iLCJjbGFzcyBRdWlja0JhdGNoXG5cdGNvbnN0cnVjdG9yOiAoZWxlbWVudHMsIEByZXR1cm5SZXN1bHRzKS0+XG5cdFx0QGVsZW1lbnRzID0gZWxlbWVudHMubWFwIChlbCktPiBRdWlja0RvbShlbClcblxuXHRyZXZlcnNlOiAoKS0+XG5cdFx0QGVsZW1lbnRzID0gQGVsZW1lbnRzLnJldmVyc2UoKVxuXHRcdHJldHVybiBAXG5cblx0cmV0dXJuOiAocmV0dXJuTmV4dCktPlxuXHRcdGlmIHJldHVybk5leHRcblx0XHRcdEByZXR1cm5SZXN1bHRzID0gdHJ1ZVxuXHRcdFx0cmV0dXJuIEBcblx0XHRlbHNlXG5cdFx0XHRyZXR1cm4gQGxhc3RSZXN1bHRzXG5cbiMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcblF1aWNrQmF0Y2gubmFtZSA/PSAnUXVpY2tCYXRjaCdcblxuXG5cbk9iamVjdC5rZXlzKFF1aWNrRWxlbWVudDo6KS5jb25jYXQoJ2NzcycsICdyZXBsYWNlV2l0aCcsICdodG1sJywgJ3RleHQnKS5mb3JFYWNoIChtZXRob2QpLT5cblx0UXVpY2tCYXRjaDo6W21ldGhvZF0gPSAobmV3VmFsdWUpLT5cblx0XHRyZXN1bHRzID0gQGxhc3RSZXN1bHRzID0gZm9yIGVsZW1lbnQgaW4gQGVsZW1lbnRzXG5cdFx0XHRpZiBtZXRob2QgaXMgJ2h0bWwnIG9yIG1ldGhvZCBpcyAndGV4dCdcblx0XHRcdFx0aWYgbmV3VmFsdWUgdGhlbiBlbGVtZW50W21ldGhvZF0gPSBuZXdWYWx1ZSBlbHNlIGVsZW1lbnRbbWV0aG9kXVxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRlbGVtZW50W21ldGhvZF0oYXJndW1lbnRzLi4uKVxuXHRcdFxuXHRcdHJldHVybiBpZiBAcmV0dXJuUmVzdWx0cyB0aGVuIHJlc3VsdHMgZWxzZSBAXG5cblxuUXVpY2tEb20uYmF0Y2ggPSAoZWxlbWVudHMsIHJldHVyblJlc3VsdHMpLT5cblx0aWYgbm90IElTLml0ZXJhYmxlKGVsZW1lbnRzKVxuXHRcdHRocm93IG5ldyBFcnJvcihcIkJhdGNoOiBleHBlY3RlZCBhbiBpdGVyYWJsZSwgZ290ICN7U3RyaW5nKGVsZW1lbnRzKX1cIilcblx0ZWxzZSBpZiBub3QgZWxlbWVudHMubGVuZ3RoXG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQmF0Y2g6IGV4cGVjdGVkIGEgbm9uLWVtcHR5IGVsZW1lbnQgY29sbGVjdGlvblwiKVxuXG5cdHJldHVybiBuZXcgUXVpY2tCYXRjaChlbGVtZW50cywgcmV0dXJuUmVzdWx0cylcblxuXG4iLCJpbXBvcnQgJy4vZXh0ZW5kVGVtcGxhdGUnXG5pbXBvcnQgJy4vcGFyc2VUcmVlJ1xuaW1wb3J0ICcuL3NjaGVtYSdcblxuY2xhc3MgUXVpY2tUZW1wbGF0ZVxuXHRjb25zdHJ1Y3RvcjogKGNvbmZpZywgaXNUcmVlKS0+XG5cdFx0cmV0dXJuIGNvbmZpZyBpZiBJUy50ZW1wbGF0ZShjb25maWcpXG5cdFx0Y29uZmlnID0gaWYgaXNUcmVlIHRoZW4gcGFyc2VUcmVlKGNvbmZpZykgZWxzZSBjb25maWdcblx0XHRleHRlbmQgQCwgY29uZmlnXG5cdFx0QF9oYXNDb21wdXRlcnMgPSAhIUBvcHRpb25zLmNvbXB1dGVyc1xuXG5cdFx0aWYgbm90IEBfaGFzQ29tcHV0ZXJzIGFuZCBAY2hpbGRyZW4ubGVuZ3RoXG5cdFx0XHRmb3IgY2hpbGQgaW4gQGNoaWxkcmVuIHdoZW4gY2hpbGQuX2hhc0NvbXB1dGVycyBvciBjaGlsZC5vcHRpb25zLmNvbXB1dGVyc1xuXHRcdFx0XHRAX2hhc0NvbXB1dGVycyA9IHRydWVcblx0XHRcdFx0YnJlYWtcblx0XG5cdGV4dGVuZDogKG5ld1ZhbHVlcywgZ2xvYmFsT3B0cyktPlxuXHRcdG5ldyBRdWlja1RlbXBsYXRlIGV4dGVuZFRlbXBsYXRlKEAsIG5ld1ZhbHVlcywgZ2xvYmFsT3B0cylcblxuXHRzcGF3bjogKG5ld1ZhbHVlcywgZ2xvYmFsT3B0cyktPlxuXHRcdGlmIG5ld1ZhbHVlcyBhbmQgbmV3VmFsdWVzLmRhdGFcblx0XHRcdGRhdGEgPSBuZXdWYWx1ZXMuZGF0YVxuXHRcdFx0bmV3VmFsdWVzID0gbnVsbCBpZiBPYmplY3Qua2V5cyhuZXdWYWx1ZXMpLmxlbmd0aCBpcyAxXG5cdFx0XG5cdFx0aWYgbmV3VmFsdWVzIG9yIGdsb2JhbE9wdHNcblx0XHRcdG9wdHMgPSBleHRlbmRUZW1wbGF0ZShALCBuZXdWYWx1ZXMsIGdsb2JhbE9wdHMpXG5cdFx0ZWxzZVxuXHRcdFx0b3B0cyA9IGV4dGVuZC5jbG9uZShAKVxuXHRcdFx0b3B0cy5vcHRpb25zID0gZXh0ZW5kLmNsb25lKG9wdHMub3B0aW9ucylcblx0XG5cblx0XHRlbGVtZW50ID0gUXVpY2tEb20ob3B0cy50eXBlLCBvcHRzLm9wdGlvbnMsIG9wdHMuY2hpbGRyZW4uLi4pXG5cblx0XHRpZiBAX2hhc0NvbXB1dGVyc1xuXHRcdFx0aWYgbmV3VmFsdWVzIGlzbnQgZmFsc2Vcblx0XHRcdFx0ZWxlbWVudC5hcHBseURhdGEoZGF0YSlcblx0XHRcdGlmIGVsZW1lbnQub3B0aW9ucy5jb21wdXRlcnM/Ll9pbml0XG5cdFx0XHRcdGVsZW1lbnQuX3J1bkNvbXB1dGVyKCdfaW5pdCcsIGRhdGEpXG5cblx0XHRyZXR1cm4gZWxlbWVudFxuXG5cbiMjIyBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAjIyNcblF1aWNrVGVtcGxhdGUubmFtZSA/PSAnUXVpY2tUZW1wbGF0ZSdcblxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkgUXVpY2tUZW1wbGF0ZTo6LCAnY2hpbGQnLCBnZXQ6ICgpLT5cblx0QF9jaGlsZFJlZnMgb3IgX2dldENoaWxkUmVmcyhAKSAjIHNvdXJjZSBpbiAvc3JjL3BhcnRzL2VsZW1lbnQvdHJhdmVyc2luZy5jb2ZmZWVcblxuXG5cblxuXG5cblxuXG4iLCJzaG9ydGN1dHMgPSBbXG5cdCdsaW5rOmEnXG5cdCdhbmNob3I6YSdcblx0J2EnXG5cdCd0ZXh0J1xuXHQnZGl2J1xuXHQnc3Bhbidcblx0J2gxJ1xuXHQnaDInXG5cdCdoMydcblx0J2g0J1xuXHQnaDUnXG5cdCdoNidcblx0J2hlYWRlcidcblx0J2Zvb3Rlcidcblx0J3NlY3Rpb24nXG5cdCdidXR0b24nXG5cdCdicidcblx0J3VsJ1xuXHQnb2wnXG5cdCdsaSdcblx0J2ZpZWxkc2V0J1xuXHQnaW5wdXQnXG5cdCd0ZXh0YXJlYSdcblx0J3NlbGVjdCdcblx0J29wdGlvbidcblx0J2Zvcm0nXG5cdCdmcmFtZSdcblx0J2hyJ1xuXHQnaWZyYW1lJ1xuXHQnaW1nJ1xuXHQncGljdHVyZSdcblx0J21haW4nXG5cdCduYXYnXG5cdCdtZXRhJ1xuXHQnb2JqZWN0J1xuXHQncHJlJ1xuXHQnc3R5bGUnXG5cdCd0YWJsZSdcblx0J3Rib2R5J1xuXHQndGgnXG5cdCd0cidcblx0J3RkJ1xuXHQndGZvb3QnXG5cdCMgJ3RlbXBsYXRlJ1xuXHQndmlkZW8nXG5dXG5cblxuZm9yIHNob3J0Y3V0IGluIHNob3J0Y3V0cyB0aGVuIGRvIChzaG9ydGN1dCktPlxuXHRwcm9wID0gdHlwZSA9IHNob3J0Y3V0XG5cdGlmIGhlbHBlcnMuaW5jbHVkZXMoc2hvcnRjdXQsICc6Jylcblx0XHRzcGxpdCA9IHNob3J0Y3V0LnNwbGl0KCc6Jylcblx0XHRwcm9wID0gc3BsaXRbMF1cblx0XHR0eXBlID0gc3BsaXRbMV1cblxuXHRRdWlja0RvbVtwcm9wXSA9ICgpLT4gUXVpY2tEb20odHlwZSwgYXJndW1lbnRzLi4uKVxuIiwie1xuICBcIl9mcm9tXCI6IFwicXVpY2tkb21AXjEuMC41MFwiLFxuICBcIl9pZFwiOiBcInF1aWNrZG9tQDEuMC43N1wiLFxuICBcIl9pbkJ1bmRsZVwiOiBmYWxzZSxcbiAgXCJfaW50ZWdyaXR5XCI6IFwic2hhNTEyLVVCMW9Lc3F0WHVWNlU5aTdzTlR3MkhLcU0xVFNSV0piYm55emJjbnhJbFU5dGIyaTVKb1dvOU9sNVpOaEo2RUNGNEJHa2t0SEhhQkJxSDZMaHRiMUN3PT1cIixcbiAgXCJfbG9jYXRpb25cIjogXCIvcXVpY2tkb21cIixcbiAgXCJfcGhhbnRvbUNoaWxkcmVuXCI6IHt9LFxuICBcIl9yZXF1ZXN0ZWRcIjoge1xuICAgIFwidHlwZVwiOiBcInJhbmdlXCIsXG4gICAgXCJyZWdpc3RyeVwiOiB0cnVlLFxuICAgIFwicmF3XCI6IFwicXVpY2tkb21AXjEuMC41MFwiLFxuICAgIFwibmFtZVwiOiBcInF1aWNrZG9tXCIsXG4gICAgXCJlc2NhcGVkTmFtZVwiOiBcInF1aWNrZG9tXCIsXG4gICAgXCJyYXdTcGVjXCI6IFwiXjEuMC41MFwiLFxuICAgIFwic2F2ZVNwZWNcIjogbnVsbCxcbiAgICBcImZldGNoU3BlY1wiOiBcIl4xLjAuNTBcIlxuICB9LFxuICBcIl9yZXF1aXJlZEJ5XCI6IFtcbiAgICBcIiNVU0VSXCIsXG4gICAgXCIvXCJcbiAgXSxcbiAgXCJfcmVzb2x2ZWRcIjogXCJodHRwczovL3JlZ2lzdHJ5Lm5wbWpzLm9yZy9xdWlja2RvbS8tL3F1aWNrZG9tLTEuMC43Ny50Z3pcIixcbiAgXCJfc2hhc3VtXCI6IFwiZjBkZGI4MGEwZGVjMGNhNjU4ZTczYWZkMGE4ODUxMTRkNmFjMjNlOFwiLFxuICBcIl9zcGVjXCI6IFwicXVpY2tkb21AXjEuMC41MFwiLFxuICBcIl93aGVyZVwiOiBcIi9Vc2Vycy9kYW5pZWxrYWxlbi9zYW5kYm94L3F1aWNrcG9wdXBcIixcbiAgXCJhdXRob3JcIjoge1xuICAgIFwibmFtZVwiOiBcImRhbmllbGthbGVuXCJcbiAgfSxcbiAgXCJicm93c2VyXCI6IHtcbiAgICBcIi4vZGVidWdcIjogXCJkaXN0L3F1aWNrZG9tLmRlYnVnLmpzXCIsXG4gICAgXCIuL2Rpc3QvcXVpY2tkb20uanNcIjogXCJzcmMvaW5kZXguY29mZmVlXCJcbiAgfSxcbiAgXCJicm93c2VyaWZ5XCI6IHtcbiAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICBcInNpbXBseWltcG9ydC9jb21wYXRcIlxuICAgIF1cbiAgfSxcbiAgXCJidWdzXCI6IHtcbiAgICBcInVybFwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2RvbS9pc3N1ZXNcIlxuICB9LFxuICBcImJ1bmRsZURlcGVuZGVuY2llc1wiOiBmYWxzZSxcbiAgXCJkZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGRhbmllbGthbGVuL2lzXCI6IFwiXjIuMC4wXCIsXG4gICAgXCJxdWlja2Nzc1wiOiBcIl4xLjMuNFwiLFxuICAgIFwic21hcnQtZXh0ZW5kXCI6IFwiXjEuNy4zXCJcbiAgfSxcbiAgXCJkZXByZWNhdGVkXCI6IGZhbHNlLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiRmFzdCAmIGxpZ2h0IERPTSBlbGVtZW50IG1hbmFnZW1lbnQgc3VwcG9ydGluZyBqcXVlcnktbGlrZSBtZXRob2RzLCB0ZW1wbGF0ZXMsICYgc3RhdGUtYmFzZWQgc3R5bGluZ1wiLFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJibHVlYmlyZFwiOiBcIl4zLjUuMFwiLFxuICAgIFwiY2hhbGtcIjogXCJeMi4wLjFcIixcbiAgICBcImNvZmZlZS1zY3JpcHRcIjogXCJeMS4xMi42XCIsXG4gICAgXCJleGVjYVwiOiBcIl4wLjcuMFwiLFxuICAgIFwiZnMtamV0cGFja1wiOiBcIl4wLjEzLjNcIixcbiAgICBcInByb21pc2UtYnJlYWtcIjogXCJeMC4xLjJcIixcbiAgICBcInNlbXZlclwiOiBcIl41LjMuMFwiXG4gIH0sXG4gIFwiZGlyZWN0b3JpZXNcIjoge1xuICAgIFwidGVzdFwiOiBcInRlc3RcIlxuICB9LFxuICBcImhvbWVwYWdlXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3F1aWNrZG9tI3JlYWRtZVwiLFxuICBcImxpY2Vuc2VcIjogXCJJU0NcIixcbiAgXCJtYWluXCI6IFwiZGlzdC9xdWlja2RvbS5qc1wiLFxuICBcIm5hbWVcIjogXCJxdWlja2RvbVwiLFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiZ2l0K2h0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2RvbS5naXRcIlxuICB9LFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiYnVpbGRcIjogXCJjYWtlIC1kIGJ1aWxkICYmIGNha2UgYnVpbGQgJiYgY2FrZSBtZWFzdXJlICYmIGNwIC1yIGJ1aWxkLyogZGlzdC9cIixcbiAgICBcImNvdmVyYWdlXCI6IFwiY2FrZSBpbnN0YWxsOmNvdmVyYWdlOyBucG0gcnVuIGNvdmVyYWdlOnJ1biAmJiBucG0gcnVuIGNvdmVyYWdlOmJhZGdlXCIsXG4gICAgXCJjb3ZlcmFnZTpiYWRnZVwiOiBcImJhZGdlLWdlbiAtZCAuLy5jb25maWcvYmFkZ2VzL2NvdmVyYWdlXCIsXG4gICAgXCJjb3ZlcmFnZTpydW5cIjogXCJjb3ZlcmFnZT10cnVlIG5wbSBydW4gdGVzdDplbGVjdHJvblwiLFxuICAgIFwiY292ZXJhZ2U6c2hvd1wiOiBcIm9wZW4gY292ZXJhZ2UvbGNvdi1yZXBvcnQvaW5kZXguaHRtbFwiLFxuICAgIFwicG9zdHB1Ymxpc2hcIjogXCJnaXQgcHVzaFwiLFxuICAgIFwicG9zdHZlcnNpb25cIjogXCJucG0gcnVuIGJ1aWxkICYmIGdpdCBhZGQgLiAmJiBnaXQgY29tbWl0IC1hIC1tICdbQnVpbGRdJ1wiLFxuICAgIFwicHJlcHVibGlzaE9ubHlcIjogXCJucG0gcnVuIHRlc3Q6dHJhdmlzXCIsXG4gICAgXCJ0ZXN0XCI6IFwibnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgfHwgdHJ1ZVwiLFxuICAgIFwidGVzdDpicm93c2VyXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7IGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIEVsZWN0cm9uIC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6Y2hyb21lXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBDaHJvbWUgLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDpmaXJlZm94XCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7IGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIEZpcmVmb3ggLmNvbmZpZy9rYXJtYS5jb25mLmNvZmZlZVwiLFxuICAgIFwidGVzdDprYXJtYVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAgIGthcm1hIHN0YXJ0IC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6bG9jYWxcIjogXCJvcGVuIHRlc3QvdGVzdHJ1bm5lci5odG1sXCIsXG4gICAgXCJ0ZXN0Om1pbmlmaWVkXCI6IFwibWluaWZpZWQ9MSBucG0gcnVuIHRlc3Q6YnJvd3NlciAtcyB8fCB0cnVlXCIsXG4gICAgXCJ0ZXN0OnNhZmFyaVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgU2FmYXJpIC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6c2F1Y2VcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgICBzYXVjZT0xIGthcm1hIHN0YXJ0IC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6dHJhdmlzXCI6IFwibnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgJiYgbnBtIHJ1biB0ZXN0Om1pbmlmaWVkIC1zXCIsXG4gICAgXCJ3YXRjaFwiOiBcImNha2UgLWQgd2F0Y2hcIlxuICB9LFxuICBcInNpbXBseWltcG9ydFwiOiB7XG4gICAgXCJmaW5hbFRyYW5zZm9ybVwiOiBbXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktc3VwZXJcIixcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1yZW5hbWVcIixcbiAgICAgIFwiLmNvbmZpZy90cmFuc2Zvcm1zL21pbmlmeS1zaW1wbGVcIlxuICAgIF1cbiAgfSxcbiAgXCJ2ZXJzaW9uXCI6IFwiMS4wLjc3XCJcbn1cbiIsImV4dGVuZCA9IHJlcXVpcmUgJy4vZXh0ZW5kJ1xuXG5ub3JtYWxpemVLZXlzID0gKGtleXMpLT4gaWYga2V5c1xuXHRvdXRwdXQgPSB7fVxuXHRpZiB0eXBlb2Yga2V5cyBpc250ICdvYmplY3QnXG5cdFx0b3V0cHV0W2tleXNdID0gdHJ1ZVxuXHRlbHNlXG5cdFx0a2V5cyA9IE9iamVjdC5rZXlzKGtleXMpIGlmIG5vdCBBcnJheS5pc0FycmF5KGtleXMpXG5cdFx0b3V0cHV0W2tleV0gPSB0cnVlIGZvciBrZXkgaW4ga2V5c1xuXG5cdHJldHVybiBvdXRwdXRcblxuXG5uZXdCdWlsZGVyID0gKGlzQmFzZSktPlxuXHRidWlsZGVyID0gKHRhcmdldCktPlxuXHRcdEVYUEFORF9BUkdVTUVOVFMoc291cmNlcylcblx0XHRpZiBidWlsZGVyLm9wdGlvbnMudGFyZ2V0XG5cdFx0XHR0aGVUYXJnZXQgPSBidWlsZGVyLm9wdGlvbnMudGFyZ2V0XG5cdFx0ZWxzZVxuXHRcdFx0dGhlVGFyZ2V0ID0gdGFyZ2V0XG5cdFx0XHRzb3VyY2VzLnNoaWZ0KClcblx0XHRcblx0XHRleHRlbmQoYnVpbGRlci5vcHRpb25zLCB0aGVUYXJnZXQsIHNvdXJjZXMpXG5cdFxuXHRidWlsZGVyLmlzQmFzZSA9IHRydWUgaWYgaXNCYXNlXG5cdGJ1aWxkZXIub3B0aW9ucyA9IHt9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGJ1aWxkZXIsIG1vZGlmaWVycylcblx0cmV0dXJuIGJ1aWxkZXJcblxuXG5tb2RpZmllcnMgPSBcblx0J2RlZXAnOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRfLm9wdGlvbnMuZGVlcCA9IHRydWVcblx0XHRyZXR1cm4gX1xuXG5cdCdvd24nOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRfLm9wdGlvbnMub3duID0gdHJ1ZVxuXHRcdHJldHVybiBfXG5cblx0J2FsbG93TnVsbCc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdF8ub3B0aW9ucy5hbGxvd051bGwgPSB0cnVlXG5cdFx0cmV0dXJuIF9cblxuXHQnbnVsbERlbGV0ZXMnOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRfLm9wdGlvbnMubnVsbERlbGV0ZXMgPSB0cnVlXG5cdFx0cmV0dXJuIF9cblxuXHQnY29uY2F0JzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0Xy5vcHRpb25zLmNvbmNhdCA9IHRydWVcblx0XHRyZXR1cm4gX1xuXG5cdCdjbG9uZSc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdF8ub3B0aW9ucy50YXJnZXQgPSB7fVxuXHRcdHJldHVybiBfXG5cblx0J25vdERlZXAnOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRyZXR1cm4gKGtleXMpLT5cblx0XHRcdF8ub3B0aW9ucy5ub3REZWVwID0gbm9ybWFsaXplS2V5cyhrZXlzKVx0XHRcdFxuXHRcdFx0cmV0dXJuIF9cblxuXHQnZGVlcE9ubHknOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRyZXR1cm4gKGtleXMpLT5cblx0XHRcdF8ub3B0aW9ucy5kZWVwT25seSA9IG5vcm1hbGl6ZUtleXMoa2V5cylcdFx0XHRcblx0XHRcdHJldHVybiBfXG5cblx0J2tleXMnOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRyZXR1cm4gKGtleXMpLT5cblx0XHRcdF8ub3B0aW9ucy5rZXlzID0gbm9ybWFsaXplS2V5cyhrZXlzKVx0XHRcdFxuXHRcdFx0cmV0dXJuIF9cblxuXHQnbm90S2V5cyc6IGdldDogKCktPlxuXHRcdF8gPSBpZiBAaXNCYXNlIHRoZW4gbmV3QnVpbGRlcigpIGVsc2UgQFxuXHRcdHJldHVybiAoa2V5cyktPlxuXHRcdFx0Xy5vcHRpb25zLm5vdEtleXMgPSBub3JtYWxpemVLZXlzKGtleXMpXHRcdFx0XG5cdFx0XHRyZXR1cm4gX1xuXG5cdCd0cmFuc2Zvcm0nOiBnZXQ6ICgpLT5cblx0XHRfID0gaWYgQGlzQmFzZSB0aGVuIG5ld0J1aWxkZXIoKSBlbHNlIEBcblx0XHRyZXR1cm4gKHRyYW5zZm9ybSktPlxuXHRcdFx0aWYgdHlwZW9mIHRyYW5zZm9ybSBpcyAnZnVuY3Rpb24nXG5cdFx0XHRcdF8ub3B0aW9ucy5nbG9iYWxUcmFuc2Zvcm0gPSB0cmFuc2Zvcm1cblx0XHRcdGVsc2UgaWYgdHJhbnNmb3JtIGFuZCB0eXBlb2YgdHJhbnNmb3JtIGlzICdvYmplY3QnXG5cdFx0XHRcdF8ub3B0aW9ucy50cmFuc2Zvcm1zID0gdHJhbnNmb3JtXG5cdFx0XHRcblx0XHRcdHJldHVybiBfXG5cblxuXHQnZmlsdGVyJzogZ2V0OiAoKS0+XG5cdFx0XyA9IGlmIEBpc0Jhc2UgdGhlbiBuZXdCdWlsZGVyKCkgZWxzZSBAXG5cdFx0cmV0dXJuIChmaWx0ZXIpLT5cblx0XHRcdGlmIHR5cGVvZiBmaWx0ZXIgaXMgJ2Z1bmN0aW9uJ1xuXHRcdFx0XHRfLm9wdGlvbnMuZ2xvYmFsRmlsdGVyID0gZmlsdGVyXG5cdFx0XHRlbHNlIGlmIGZpbHRlciBhbmQgdHlwZW9mIGZpbHRlciBpcyAnb2JqZWN0J1xuXHRcdFx0XHRfLm9wdGlvbnMuZmlsdGVycyA9IGZpbHRlclxuXHRcdFx0XG5cdFx0XHRyZXR1cm4gX1xuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBleHBvcnRzID0gbmV3QnVpbGRlcih0cnVlKVxuZXhwb3J0cy52ZXJzaW9uID0gaW1wb3J0ICcuLi9wYWNrYWdlLmpzb24gJCB2ZXJzaW9uJyIsIntcbiAgXCJfZnJvbVwiOiBcInNtYXJ0LWV4dGVuZEBeMS43LjJcIixcbiAgXCJfaWRcIjogXCJzbWFydC1leHRlbmRAMS43LjNcIixcbiAgXCJfaW5CdW5kbGVcIjogZmFsc2UsXG4gIFwiX2ludGVncml0eVwiOiBcInNoYTUxMi1QVkVFVllERHp5eEtBMEdORkxjV1k2b0pTa1FLZGMxdzcxOGVRcEVIY051VFNXWXhESzM1R3poc0doTWtVVThsQklnU0VEYnQ1eDVwNDZwUnozQXViQT09XCIsXG4gIFwiX2xvY2F0aW9uXCI6IFwiL3NtYXJ0LWV4dGVuZFwiLFxuICBcIl9waGFudG9tQ2hpbGRyZW5cIjoge30sXG4gIFwiX3JlcXVlc3RlZFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwicmFuZ2VcIixcbiAgICBcInJlZ2lzdHJ5XCI6IHRydWUsXG4gICAgXCJyYXdcIjogXCJzbWFydC1leHRlbmRAXjEuNy4yXCIsXG4gICAgXCJuYW1lXCI6IFwic21hcnQtZXh0ZW5kXCIsXG4gICAgXCJlc2NhcGVkTmFtZVwiOiBcInNtYXJ0LWV4dGVuZFwiLFxuICAgIFwicmF3U3BlY1wiOiBcIl4xLjcuMlwiLFxuICAgIFwic2F2ZVNwZWNcIjogbnVsbCxcbiAgICBcImZldGNoU3BlY1wiOiBcIl4xLjcuMlwiXG4gIH0sXG4gIFwiX3JlcXVpcmVkQnlcIjogW1xuICAgIFwiI1VTRVJcIixcbiAgICBcIi9cIixcbiAgICBcIi9xdWlja2RvbVwiXG4gIF0sXG4gIFwiX3Jlc29sdmVkXCI6IFwiaHR0cHM6Ly9yZWdpc3RyeS5ucG1qcy5vcmcvc21hcnQtZXh0ZW5kLy0vc21hcnQtZXh0ZW5kLTEuNy4zLnRnelwiLFxuICBcIl9zaGFzdW1cIjogXCIwZmU0YTQyNmM4NjM4ZjQ4Zjk5YjdjYzg1ZTI3Njc5MWVjZjVhZjJiXCIsXG4gIFwiX3NwZWNcIjogXCJzbWFydC1leHRlbmRAXjEuNy4yXCIsXG4gIFwiX3doZXJlXCI6IFwiL1VzZXJzL2RhbmllbGthbGVuL3NhbmRib3gvcXVpY2twb3B1cFwiLFxuICBcImF1dGhvclwiOiB7XG4gICAgXCJuYW1lXCI6IFwiZGFuaWVsa2FsZW5cIlxuICB9LFxuICBcImJyb3dzZXJcIjoge1xuICAgIFwiLi9kZWJ1Z1wiOiBcImRpc3Qvc21hcnQtZXh0ZW5kLmRlYnVnLmpzXCIsXG4gICAgXCIuL2Rpc3Qvc21hcnQtZXh0ZW5kLmpzXCI6IFwic3JjL2luZGV4LmNvZmZlZVwiXG4gIH0sXG4gIFwiYnJvd3NlcmlmeVwiOiB7XG4gICAgXCJ0cmFuc2Zvcm1cIjogW1xuICAgICAgXCJzaW1wbHlpbXBvcnQvY29tcGF0XCJcbiAgICBdXG4gIH0sXG4gIFwiYnVnc1wiOiB7XG4gICAgXCJ1cmxcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vc21hcnQtZXh0ZW5kL2lzc3Vlc1wiXG4gIH0sXG4gIFwiYnVuZGxlRGVwZW5kZW5jaWVzXCI6IGZhbHNlLFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJmYWxhZmVsXCI6IFwiXjIuMS4wXCJcbiAgfSxcbiAgXCJkZXByZWNhdGVkXCI6IGZhbHNlLFxuICBcImRlc2NyaXB0aW9uXCI6IFwiTWVyZ2UvZXh0ZW5kIG9iamVjdHMgKHNoYWxsb3cvZGVlcCkgd2l0aCBnbG9iYWwvaW5kaXZpZHVhbCBmaWx0ZXJzIGFuZCBtb3JlIGZlYXR1cmVzXCIsXG4gIFwiZGV2RGVwZW5kZW5jaWVzXCI6IHtcbiAgICBcImJhZGdlLWdlblwiOiBcIl4xLjAuMlwiLFxuICAgIFwiYmx1ZWJpcmRcIjogXCJeMy40LjdcIixcbiAgICBcImNoYWlcIjogXCJeMy41LjBcIixcbiAgICBcImNvZmZlZS1yZWdpc3RlclwiOiBcIl4wLjEuMFwiLFxuICAgIFwiY29mZmVlaWZ5LWNhY2hlZFwiOiBcIl4yLjEuMVwiLFxuICAgIFwiZXh0ZW5kXCI6IFwiXjMuMC4xXCIsXG4gICAgXCJnb29nbGUtY2xvc3VyZS1jb21waWxlci1qc1wiOiBcIl4yMDE3MDYyNi4wLjBcIixcbiAgICBcIm1vY2hhXCI6IFwiXjMuMi4wXCIsXG4gICAgXCJzaW1wbHlpbXBvcnRcIjogXCJeNC4wLjAtczIxXCIsXG4gICAgXCJzaW1wbHl3YXRjaFwiOiBcIl4zLjAuMC1sMlwiLFxuICAgIFwidWdsaWZ5LWpzXCI6IFwiXjMuMC4yNFwiXG4gIH0sXG4gIFwiaG9tZXBhZ2VcIjogXCJodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vc21hcnQtZXh0ZW5kI3JlYWRtZVwiLFxuICBcImtleXdvcmRzXCI6IFtcbiAgICBcImV4dGVuZFwiLFxuICAgIFwiY2xvbmVcIixcbiAgICBcImZpbHRlclwiLFxuICAgIFwic2VsZWN0aXZlXCIsXG4gICAgXCJtZXJnZVwiLFxuICAgIFwiYXNzaWduXCIsXG4gICAgXCJwcm9wZXJ0aWVzXCJcbiAgXSxcbiAgXCJsaWNlbnNlXCI6IFwiSVNDXCIsXG4gIFwibWFpblwiOiBcImRpc3Qvc21hcnQtZXh0ZW5kLmpzXCIsXG4gIFwibW9jaGFfb3B0c1wiOiBcIi11IHRkZCAtLWNvbXBpbGVycyBjb2ZmZWU6Y29mZmVlLXJlZ2lzdGVyIC0tc2xvdyAxMDAwIC0tdGltZW91dCA1MDAwXCIsXG4gIFwibmFtZVwiOiBcInNtYXJ0LWV4dGVuZFwiLFxuICBcInJlcG9zaXRvcnlcIjoge1xuICAgIFwidHlwZVwiOiBcImdpdFwiLFxuICAgIFwidXJsXCI6IFwiZ2l0K2h0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9zbWFydC1leHRlbmQuZ2l0XCJcbiAgfSxcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImJ1aWxkXCI6IFwibWtkaXIgLXAgZGlzdC87IG5wbSBydW4gYnVpbGQ6ZGVidWcgJiYgbnBtIHJ1biBidWlsZDpyZWxlYXNlXCIsXG4gICAgXCJidWlsZDpkZWJ1Z1wiOiBcInNpbXBseWltcG9ydCBidW5kbGUgc3JjL2luZGV4LmNvZmZlZSAtZCAtLXRhcmdldCBub2RlIC0tdW1kIHNtYXJ0LWV4dGVuZCA+IGRpc3Qvc21hcnQtZXh0ZW5kLmRlYnVnLmpzXCIsXG4gICAgXCJidWlsZDpyZWxlYXNlXCI6IFwic2ltcGx5aW1wb3J0IGJ1bmRsZSBzcmMvaW5kZXguY29mZmVlIC0tdGFyZ2V0IG5vZGUgLS11bWQgc21hcnQtZXh0ZW5kID4gZGlzdC9zbWFydC1leHRlbmQuanNcIixcbiAgICBcImNvdmVyYWdlXCI6IFwibnBtIHJ1biBjb3ZlcmFnZTpydW4gJiYgbnBtIHJ1biBjb3ZlcmFnZTpiYWRnZVwiLFxuICAgIFwiY292ZXJhZ2U6YmFkZ2VcIjogXCJiYWRnZS1nZW4gLWQgLmNvbmZpZy9iYWRnZXMvY292ZXJhZ2VcIixcbiAgICBcImNvdmVyYWdlOnJ1blwiOiBcImZvckNvdmVyYWdlPXRydWUgaXN0YW5idWwgY292ZXIgLS1kaXIgY292ZXJhZ2Ugbm9kZV9tb2R1bGVzL21vY2hhL2Jpbi9fbW9jaGEgLS0gJG5wbV9wYWNrYWdlX21vY2hhX29wdHNcIixcbiAgICBcInBvc3RwdWJsaXNoXCI6IFwiZ2l0IHB1c2hcIixcbiAgICBcInBvc3R2ZXJzaW9uXCI6IFwibnBtIHJ1biBidWlsZCAmJiBnaXQgYWRkIC4gJiYgZ2l0IGNvbW1pdCAtYSAtbSAnW0J1aWxkXSdcIixcbiAgICBcInByZXB1Ymxpc2hPbmx5XCI6IFwiQ0k9MSBucG0gcnVuIHRlc3RcIixcbiAgICBcInRlc3RcIjogXCJtb2NoYSAkbnBtX3BhY2thZ2VfbW9jaGFfb3B0c1wiLFxuICAgIFwid2F0Y2hcIjogXCJzaW1wbHl3YXRjaCAtZyAnc3JjLyonIC14ICducG0gcnVuIGJ1aWxkOmRlYnVnIC1zJ1wiXG4gIH0sXG4gIFwic2ltcGx5aW1wb3J0XCI6IHtcbiAgICBcInRyYW5zZm9ybVwiOiBbXG4gICAgICBcImNvZmZlZWlmeS1jYWNoZWRcIixcbiAgICAgIFwiLi8uY29uZmlnL3RyYW5zZm9ybXMvbWFjcm9zXCJcbiAgICBdLFxuICAgIFwiZmluYWxUcmFuc2Zvcm1cIjogW1xuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXN1cGVyXCIsXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktcmVuYW1lXCIsXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktc2ltcGxlXCJcbiAgICBdXG4gIH0sXG4gIFwidmVyc2lvblwiOiBcIjEuNy4zXCJcbn1cbiIsInByb21pc2VFdmVudCA9IF8kc20oJ3AtZXZlbnQnIClcbnByb21pc2VCcmVhayA9IF8kc20oJ3Byb21pc2UtYnJlYWsnIClcbkRPTSA9IF8kc20oJ3F1aWNrZG9tJyApXG5JUyA9IF8kc20oJy4vY2hlY2tzJyApXG50ZW1wbGF0ZSA9IF8kc20oJy4vdGVtcGxhdGUnIClcbmhlbHBlcnMgPSBfJHNtKCcuL2hlbHBlcnMnIClcbmJvZHkgPSBET00oZG9jdW1lbnQuYm9keSlcblxuY2xhc3MgUG9wdXAgZXh0ZW5kcyByZXF1aXJlKCdldmVudC1saXRlJylcblx0QGluc3RhbmNlczogW11cblx0QGhhc09wZW46IGZhbHNlXG5cdEBib2R5V3JhcHBlcjogbnVsbFxuXHRAdHJhbnNpdGlvbkVuZDogaGVscGVycy50cmFuc2l0aW9uRW5kKClcblxuXHRAd3JhcEJvZHk6ICgpLT4gdW5sZXNzIEBib2R5V3JhcHBlcj8ucGFyZW50XG5cdFx0QGJvZHlXcmFwcGVyID0gdGVtcGxhdGUuYm9keVdyYXBwZXIuc3Bhd24oKVxuXHRcdGJvZHlDaGlsZHJlbiA9IGJvZHkuY2hpbGRyZW4uc2xpY2UoKVxuXHRcdEBib2R5V3JhcHBlci5wcmVwZW5kVG8oYm9keSlcblx0XHRAYm9keVdyYXBwZXIuYXBwZW5kKGNoaWxkKSBmb3IgY2hpbGQgaW4gYm9keUNoaWxkcmVuXG5cdFx0cmV0dXJuXG5cblx0QHVud3JhcEJvZHk6ICgpLT4gaWYgQGJvZHlXcmFwcGVyXG5cdFx0Ym9keUNoaWxkcmVuID0gQGJvZHlXcmFwcGVyLmNoaWxkcmVuLnNsaWNlKClcblx0XHRib2R5LmFwcGVuZChjaGlsZCkgZm9yIGNoaWxkIGluIGJvZHlDaGlsZHJlblxuXHRcdEBib2R5V3JhcHBlci5yZW1vdmUoKVxuXHRcdEBib2R5V3JhcHBlciA9IG51bGxcblxuXHRAZGVzdHJveUFsbDogKCktPlxuXHRcdGluc3RhbmNlcyA9IEBpbnN0YW5jZXMuc2xpY2UoKVxuXHRcdGluc3RhbmNlLmRlc3Ryb3koKSBmb3IgaW5zdGFuY2UgaW4gaW5zdGFuY2VzXG5cdFx0QHVud3JhcEJvZHkoKVxuXG5cblxuXG5cblx0Y29uc3RydWN0b3I6IChzZXR0aW5ncywgZGVmYXVsdHMsIEB0ZW1wbGF0ZSktPlxuXHRcdEBzZXR0aW5ncyA9IGhlbHBlcnMuZXh0ZW5kU2V0dGluZ3MoZGVmYXVsdHMsIHNldHRpbmdzKVxuXHRcdEBpZCA9IE1hdGgucm91bmQoTWF0aC5yYW5kb20oKSoxZTUpLnRvU3RyaW5nKDE2KVxuXHRcdEBzdGF0ZSA9IG9wZW46ZmFsc2UsIGRlc3Ryb3llZDpmYWxzZSwgb2Zmc2V0OjAsIGNvdW50OjBcblx0XHRAY29udGVudCA9IERPTShAc2V0dGluZ3MuY29udGVudCkgaWYgQHNldHRpbmdzLmNvbnRlbnRcblxuXHRcdHN1cGVyXG5cdFx0UG9wdXAuaW5zdGFuY2VzLnB1c2goQClcblx0XHRQb3B1cC53cmFwQm9keSgpXG5cdFx0QF9jcmVhdGVFbGVtZW50cygpXG5cdFx0QF9hdHRhY2hCaW5kaW5ncygpXG5cdFx0QF9hcHBseVRlbXBsYXRlKCkgaWYgQHNldHRpbmdzLnRlbXBsYXRlIGFuZCB0eXBlb2YgQHNldHRpbmdzLnRlbXBsYXRlIGlzICdvYmplY3QnXG5cblx0XHRAZWwucHJlcGVuZFRvKGJvZHkpXG5cdFx0QG9wZW4oKSBpZiBAc2V0dGluZ3Mub3BlblxuXG5cblx0X2NyZWF0ZUVsZW1lbnRzOiAoKS0+XG5cdFx0ZGF0YSA9IGRhdGE6e0Bjb250ZW50LCBwbGFjZW1lbnQ6QHNldHRpbmdzLnBsYWNlbWVudH1cblx0XHRjb25maWcgPSByZWxhdGVkSW5zdGFuY2U6IEBcblx0XHRcblx0XHRAZWwgPSBAdGVtcGxhdGUucG9wdXAuc3Bhd24oZGF0YSwgY29uZmlnKVxuXHRcdG92ZXJsYXkgPSBAdGVtcGxhdGUub3ZlcmxheS5zcGF3bihkYXRhLCBjb25maWcpLmFwcGVuZFRvKEBlbClcblx0XHRjb250ZW50ID0gQHRlbXBsYXRlLmNvbnRlbnQuc3Bhd24oZGF0YSwgY29uZmlnKS5hcHBlbmRUbyhAZWwpXG5cdFx0Y2xvc2UgPSBAdGVtcGxhdGUuY2xvc2Uuc3Bhd24oZGF0YSwgY29uZmlnKS5hcHBlbmRUbyhjb250ZW50KSBpZiBAc2V0dGluZ3MuY2xvc2Uuc2hvd1xuXG5cblx0X2FwcGx5VGVtcGxhdGU6ICgpLT5cblx0XHRjdXN0b20gPSBAc2V0dGluZ3MudGVtcGxhdGVcblx0XHRmb3IgcmVmIG9mIEBlbC5jaGlsZFxuXHRcdFx0QGVsLmNoaWxkW3JlZl0udXBkYXRlT3B0aW9ucyhjdXN0b21bcmVmXSkgaWYgY3VzdG9tW3JlZl1cblxuXHRcdHJldHVyblxuXG5cdF9hdHRhY2hCaW5kaW5nczogKCktPlxuXHRcdGNsb3NlID0gQGNsb3NlLmJpbmQoQClcblx0XHRAZWwuY2hpbGQub3ZlcmxheS5vbiAnbW91c2V1cCB0b3VjaGVuZCcsIGNsb3NlXG5cdFx0QGVsLmNoaWxkLmNsb3NlPy5vbiAnbW91c2V1cCB0b3VjaGVuZCcsIGNsb3NlXG5cblx0XHRpZiBAc2V0dGluZ3MucGxhY2VtZW50IGlzICdjZW50ZXInXG5cdFx0XHRET00od2luZG93KS5vbiBcInJlc2l6ZS4je0BpZH1cIiwgKCk9PiBpZiBAc3RhdGUub3BlblxuXHRcdFx0XHRAYWxpZ25Ub0NlbnRlcigpXG5cblx0XHRpZiBAc2V0dGluZ3MudHJpZ2dlcnMuY2xvc2UuZXNjXG5cdFx0XHRET00oZG9jdW1lbnQpLm9uIFwia2V5dXAuI3tAaWR9XCIsIChldmVudCk9PiBpZiBldmVudC5rZXlDb2RlIGlzIDI3IGFuZCBAc3RhdGUub3BlblxuXHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdEBjbG9zZSgpXG5cblx0XHRpZiBAc2V0dGluZ3MudHJpZ2dlcnMub3Blbi52aXNpYmlsaXR5XG5cdFx0XHR7dmlzaWJpbGl0eWNoYW5nZSxoaWRkZW59ID0gaGVscGVycy52aXNpYmlsaXR5QXBpS2V5cygpXG5cdFx0XHRET00oZG9jdW1lbnQpLm9uIFwiI3t2aXNpYmlsaXR5Y2hhbmdlfS4je0BpZH1cIiwgKCk9PlxuXHRcdFx0XHRAb3BlbigndmlzaWJpbGl0eScpIGlmIGRvY3VtZW50W2hpZGRlbl1cblxuXHRcdGlmIEBzZXR0aW5ncy50cmlnZ2Vycy5vcGVuLmV4aXRJbnRlbnRcblx0XHRcdERPTSh3aW5kb3cpLm9uIFwibW91c2VsZWF2ZS4je0BpZH1cIiwgKGV2ZW50KT0+XG5cdFx0XHRcdEBvcGVuKCdleGl0SW50ZW50JykgaWYgZXZlbnQuY2xpZW50WSA8IDFcblxuXHRcdGlmIEBzZXR0aW5ncy50cmlnZ2Vycy5vcGVuLm5hdmlnYXRpb24gYW5kIHdpbmRvdy5oaXN0b3J5Py5wdXNoU3RhdGVcblx0XHRcdHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSB7aWQ6J3F1aWNrcG9wdXAtb3JpZ2luJ30sICcnLCAnJ1xuXHRcdFx0d2luZG93Lmhpc3RvcnkucHVzaFN0YXRlIHtpZDoncXVpY2twb3B1cCd9LCAnJywgJydcblx0XHRcdFxuXHRcdFx0RE9NKHdpbmRvdykub24gXCJwb3BzdGF0ZS4je0BpZH1cIiwgKGV2ZW50KT0+XG5cdFx0XHRcdGlmIGV2ZW50LnN0YXRlLnN0YXRlLmlkIGlzICdxdWlja3BvcHVwLW9yaWdpbicgYW5kIEBvcGVuKCduYXZpZ2F0aW9uJylcblx0XHRcdFx0XHQ7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR3aW5kb3cuaGlzdG9yeS5iYWNrKClcblxuXG5cdF9kZXRhY2hCaW5kaW5nczogKCktPlxuXHRcdEBlbC5jaGlsZC5vdmVybGF5Lm9mZigpXG5cdFx0QGVsLmNoaWxkLmNsb3NlPy5vZmYoKVxuXHRcdHt2aXNpYmlsaXR5Y2hhbmdlLGhpZGRlbn0gPSBoZWxwZXJzLnZpc2liaWxpdHlBcGlLZXlzKClcblx0XHRcblx0XHRET00od2luZG93KS5vZmYgXCJyZXNpemUuI3tAaWR9XCIgaWYgQHNldHRpbmdzLnBsYWNlbWVudCBpcyAnY2VudGVyJ1xuXHRcdERPTSh3aW5kb3cpLm9mZiBcIm1vdXNlbGVhdmUuI3tAaWR9XCIgaWYgQHNldHRpbmdzLnRyaWdnZXJzLm9wZW4uZXhpdEludGVudFxuXHRcdERPTSh3aW5kb3cpLm9mZiBcInBvcHN0YXRlLiN7QGlkfVwiIGlmIEBzZXR0aW5ncy50cmlnZ2Vycy5vcGVuLm5hdmlnYXRpb25cblx0XHRET00oZG9jdW1lbnQpLm9mZiBcIiN7dmlzaWJpbGl0eWNoYW5nZX0uI3tAaWR9XCIgaWYgQHNldHRpbmdzLnRyaWdnZXJzLm9wZW4udmlzaWJpbGl0eVxuXHRcdERPTShkb2N1bWVudCkub2ZmIFwia2V5dXAuI3tAaWR9XCIgaWYgQHNldHRpbmdzLnRyaWdnZXJzLmNsb3NlLmVzY1xuXG5cblx0X3Rocm93RGVzdHJveWVkOiAoKS0+XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCBhdHRlbXB0IHRvIG9wZXJhdGUgYSBkZXN0cm95ZWQgcG9wdXAgaW5zdGFuY2VcIilcblxuXG5cblxuXG5cblxuXG5cblxuXG5cblx0c2V0Q29udGVudDogKHRhcmdldCktPlxuXHRcdEBjb250ZW50ID0gc3dpdGNoXG5cdFx0XHR3aGVuIElTLnF1aWNrRWwodGFyZ2V0KSB0aGVuIHRhcmdldFxuXHRcdFx0d2hlbiBJUy5kb21FbCh0YXJnZXQpIHRoZW4gRE9NKHRhcmdldClcblx0XHRcdHdoZW4gSVMudGVtcGxhdGUodGFyZ2V0KSB0aGVuIHRhcmdldC5zcGF3bigpXG5cdFx0XHR3aGVuIElTLnN0cmluZyh0YXJnZXQpIHRoZW4gdGVtcGxhdGUuaHRtbC5zcGF3bihkYXRhOmh0bWw6dGFyZ2V0KVxuXHRcdFx0ZWxzZSB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgdGFyZ2V0IHByb3ZpZGVkIHRvIFBvcHVwOjpzZXRDb250ZW50KCknKVxuXHRcdFxuXHRcdEBlbC5jaGlsZC5jb250ZW50LmNoaWxkcmVuWzFdLnJlcGxhY2VXaXRoIEBjb250ZW50XG5cblxuXHRhbGlnblRvQ2VudGVyOiAoKS0+XG5cdFx0Y29udGVudEhlaWdodCA9IEBlbC5jaGlsZC5jb250ZW50LnJhdy5jbGllbnRIZWlnaHRcblx0XHR3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcblx0XHRcblx0XHRpZiBjb250ZW50SGVpZ2h0ID49IHdpbmRvd0hlaWdodC04MFxuXHRcdFx0b2Zmc2V0ID0gaWYgd2luZG93LmlubmVyV2lkdGggPiA3MzYgdGhlbiAxMDAgZWxzZSA2MFxuXHRcdGVsc2Vcblx0XHRcdG9mZnNldCA9ICh3aW5kb3dIZWlnaHQgLSBjb250ZW50SGVpZ2h0KS8yXG5cdFx0XG5cdFx0QGVsLmNoaWxkLmNvbnRlbnQuc3R5bGUgJ21hcmdpbicsIFwiI3tvZmZzZXR9cHggYXV0b1wiXG5cblxuXHRvcGVuOiAodHJpZ2dlck5hbWUpLT5cblx0XHRQcm9taXNlLnJlc29sdmUoKVxuXHRcdFx0LnRoZW4gKCk9PlxuXHRcdFx0XHRAX3Rocm93RGVzdHJveWVkKCkgaWYgQHN0YXRlLmRlc3Ryb3llZFxuXHRcdFx0XHRwcm9taXNlQnJlYWsoKSBpZiBmYWxzZSBvclxuXHRcdFx0XHRcdEBzdGF0ZS5vcGVuIG9yIChQb3B1cC5oYXNPcGVuIGFuZCBub3QgQHNldHRpbmdzLmZvcmNlT3Blbikgb3Jcblx0XHRcdFx0XHQrK0BzdGF0ZS5jb3VudCA+PSBAc2V0dGluZ3Mub3BlbkxpbWl0IG9yXG5cdFx0XHRcdFx0d2luZG93LmlubmVyV2lkdGggPCBAc2V0dGluZ3MudHJpZ2dlcnMub3Blbi5taW5XaWR0aCBvclxuXHRcdFx0XHRcdEBzZXR0aW5ncy5jb25kaXRpb24gYW5kIG5vdCBAc2V0dGluZ3MuY29uZGl0aW9uKClcblx0XHRcdFxuXHRcdFx0LnRoZW4gKCk9PlxuXHRcdFx0XHRAZW1pdCAnYmVmb3Jlb3BlbicsIHRyaWdnZXJOYW1lXG5cdFx0XHRcdFxuXHRcdFx0XHRpZiBub3QgUG9wdXAuaGFzT3BlblxuXHRcdFx0XHRcdEBzdGF0ZS5vZmZzZXQgPSBoZWxwZXJzLnNjcm9sbE9mZnNldCgpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRvcGVuUG9wdXBzID0gUG9wdXAuaW5zdGFuY2VzLmZpbHRlciAocG9wdXApPT4gcG9wdXAgaXNudCBAIGFuZCBwb3B1cC5zdGF0ZS5vcGVuXG5cdFx0XHRcdFx0UHJvbWlzZS5hbGwgb3BlblBvcHVwcy5tYXAgKHBvcHVwKT0+XG5cdFx0XHRcdFx0XHRAc3RhdGUub2Zmc2V0ID0gcG9wdXAuc3RhdGUub2Zmc2V0XG5cdFx0XHRcdFx0XHRwb3B1cC5jbG9zZSh0cnVlKVxuXHRcdFx0XHRcblx0XHRcdC50aGVuICgpPT5cblx0XHRcdFx0aGVscGVycy5zY2hlZHVsZVNjcm9sbFJlc2V0KDUpXG5cdFx0XHRcdFBvcHVwLmJvZHlXcmFwcGVyLnN0YXRlICdvcGVuJywgb25cblx0XHRcdFx0QGVsLnN0YXRlICdvcGVuJywgb25cblx0XHRcdFx0QHN0YXRlLm9wZW4gPSBQb3B1cC5oYXNPcGVuID0gdHJ1ZVxuXHRcdFx0XHRAYWxpZ25Ub0NlbnRlcigpIGlmIEBzZXR0aW5ncy5wbGFjZW1lbnQgaXMgJ2NlbnRlcidcblx0XHRcdFx0QGVtaXQgJ29wZW4nLCB0cmlnZ2VyTmFtZVxuXHRcdFx0XHRcblx0XHRcdFx0aWYgbm90IEBzZXR0aW5ncy5hbmltYXRpb24gb3Igbm90IFBvcHVwLnRyYW5zaXRpb25FbmRcblx0XHRcdFx0XHRAZW1pdCAnZmluaXNob3Blbidcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHByb21pc2UgPSBwcm9taXNlRXZlbnQoQCwgJ2ZpbmlzaG9wZW4nKVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdEBlbC5jaGlsZC5jb250ZW50Lm9uIFBvcHVwLnRyYW5zaXRpb25FbmQsIChldmVudCk9PiBpZiBldmVudC50YXJnZXQgaXMgQGVsLmNoaWxkLmNvbnRlbnQucmF3XG5cdFx0XHRcdFx0XHRAZW1pdCAnZmluaXNob3Blbidcblx0XHRcdFx0XHRcdEBlbC5jaGlsZC5jb250ZW50Lm9mZiBQb3B1cC50cmFuc2l0aW9uRW5kXG5cdFx0XHRcdFxuXHRcdFx0XHRcdHJldHVybiBwcm9taXNlXG5cblx0XHRcdC5jYXRjaCBwcm9taXNlQnJlYWsuZW5kXG5cdFx0XHQudGhlbiAoKT0+IEBcblxuXG5cdGNsb3NlOiAocHJldmVudFJlc2V0KS0+XG5cdFx0UHJvbWlzZS5yZXNvbHZlKClcblx0XHRcdC50aGVuICgpPT4gcHJvbWlzZUJyZWFrKCkgaWYgbm90IEBzdGF0ZS5vcGVuXG5cdFx0XHQudGhlbiAoKT0+XG5cdFx0XHRcdEBlbWl0ICdiZWZvcmVjbG9zZSdcblxuXHRcdFx0XHR1bmxlc3MgcHJldmVudFJlc2V0IGlzIHRydWVcblx0XHRcdFx0XHRzZXRUaW1lb3V0ICgpPT4gdW5sZXNzIFBvcHVwLmhhc09wZW5cblx0XHRcdFx0XHRcdFBvcHVwLmJvZHlXcmFwcGVyPy5zdGF0ZSAnb3BlbicsIG9mZlxuXHRcdFx0XHRcdFx0d2luZG93LnNjcm9sbCAwLCBAc3RhdGUub2Zmc2V0ICsgaGVscGVycy5kb2N1bWVudE9mZnNldCgpXG5cblx0XHRcdFx0XHRQb3B1cC5oYXNPcGVuID0gZmFsc2VcblxuXHRcdFx0XHRAZWwuc3RhdGUgJ29wZW4nLCBvZmZcblx0XHRcdFx0QHN0YXRlLm9wZW4gPSBmYWxzZVxuXHRcdFx0XHRAZW1pdCAnY2xvc2UnXG5cdFx0XHRcdGlmIG5vdCBAc2V0dGluZ3MuYW5pbWF0aW9uIG9yIG5vdCBQb3B1cC50cmFuc2l0aW9uRW5kXG5cdFx0XHRcdFx0QGVtaXQgJ2ZpbmlzaGNsb3NlJ1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cHJvbWlzZSA9IHByb21pc2VFdmVudChALCAnZmluaXNoY2xvc2UnKVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdEBlbC5jaGlsZC5jb250ZW50Lm9uIFBvcHVwLnRyYW5zaXRpb25FbmQsIChldmVudCk9PiBpZiBldmVudC50YXJnZXQgaXMgQGVsLmNoaWxkLmNvbnRlbnQucmF3XG5cdFx0XHRcdFx0XHRAZW1pdCAnZmluaXNoY2xvc2UnXG5cdFx0XHRcdFx0XHRAZWwuY2hpbGQuY29udGVudC5vZmYgUG9wdXAudHJhbnNpdGlvbkVuZFxuXG5cdFx0XHRcdFx0cmV0dXJuIHByb21pc2Vcblx0XHRcdFxuXHRcdFx0LmNhdGNoIHByb21pc2VCcmVhay5lbmRcblx0XHRcdC50aGVuICgpPT4gQFxuXG5cblx0ZGVzdHJveTogKCktPlxuXHRcdEBfdGhyb3dEZXN0cm95ZWQoKSBpZiBAc2V0dGluZ3MuZGVzdHJveWVkXG5cdFx0QGNsb3NlKClcblx0XHRAX2RldGFjaEJpbmRpbmdzKClcblx0XHRAZWwucmVtb3ZlKClcblx0XHRQb3B1cC5pbnN0YW5jZXMuc3BsaWNlIFBvcHVwLmluc3RhbmNlcy5pbmRleE9mKEApLCAxXG5cdFx0cmV0dXJuIHRydWVcblxuXG5cblxubW9kdWxlLmV4cG9ydHMgPSBQb3B1cCIsIklTID0gXyRzbSgnQGRhbmllbGthbGVuL2lzJyApXG5ET00gPSBfJHNtKCdxdWlja2RvbScgKVxuXG5tb2R1bGUuZXhwb3J0cyA9IElTID0gSVMuY3JlYXRlKCduYXRpdmVzJylcbklTLmxvYWRcblx0J2RvbUVsJzogRE9NLmlzRWxcblx0J3F1aWNrRWwnOiBET00uaXNRdWlja0VsXG5cdCd0ZW1wbGF0ZSc6IERPTS5pc1RlbXBsYXRlIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gIHBsYWNlbWVudDogJ2NlbnRlcicsXG4gIG9wZW46IGZhbHNlLFxuICBmb3JjZU9wZW46IGZhbHNlLFxuICB0ZW1wbGF0ZTogbnVsbCxcbiAgY29uZGl0aW9uOiBudWxsLFxuICBhbmltYXRpb246IDMwMCxcbiAgY29udGVudFBhZGRpbmc6IDAsXG4gIG9wZW5MaW1pdDogMmUzMDgsXG4gIG92ZXJsYXlDb2xvcjogJ3JnYmEoMCwwLDAsMC44OCknLFxuICBjbG9zZToge1xuICAgIHNob3c6IGZhbHNlLFxuICAgIHBhZGRpbmc6IDIwLFxuICAgIGluc2lkZTogZmFsc2UsXG4gICAgc2l6ZTogMjJcbiAgfSxcbiAgdHJpZ2dlcnM6IHtcbiAgICBvcGVuOiB7XG4gICAgICBuYXZpZ2F0aW9uOiBmYWxzZSxcbiAgICAgIHZpc2liaWxpdHk6IGZhbHNlLFxuICAgICAgZXhpdEludGVudDogZmFsc2VcbiAgICB9LFxuICAgIGNsb3NlOiB7XG4gICAgICBlc2M6IHRydWVcbiAgICB9XG4gIH1cbn07XG5cblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJaUlzSW1acGJHVWlPaUprWldaaGRXeDBjeTVqYjJabVpXVWlMQ0p6YjNWeVkyVnpRMjl1ZEdWdWRDSTZXMTE5IiwiRE9NID0gXyRzbSgncXVpY2tkb20nIClcblxuZXhwb3J0IHBvcHVwID0gRE9NLnRlbXBsYXRlKFxuXHRbJ2Rpdidcblx0XHRyZWY6ICdwb3B1cCdcblx0XHRzdHlsZTpcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHR6SW5kZXg6IDFlNFxuXHRcdFx0dG9wOiAwXG5cdFx0XHRsZWZ0OiAwXG5cdFx0XHR3aWR0aDogJzEwMHZ3J1xuXHRcdFx0aGVpZ2h0OiAwXG5cdFx0XHRtaW5IZWlnaHQ6ICcxMDAlJ1xuXHRcdFx0dmlzaWJpbGl0eTogJ2hpZGRlbidcblx0XHRcdG92ZXJmbG93OiAnaGlkZGVuJ1xuXHRcdFx0dHJhbnNpdGlvbjogKHBvcHVwKS0+IFwiYWxsIDAuMDAxcyBsaW5lYXIgI3twb3B1cC5zZXR0aW5ncy5hbmltYXRpb24rMX1tc1wiXG5cdFx0XHRcblx0XHRcdCRvcGVuOlxuXHRcdFx0XHR0cmFuc2l0aW9uOiAoKS0+ICdhbGwgMC4wMDFzIGxpbmVhciAwcydcblx0XHRcdFx0dmlzaWJpbGl0eTogJ3Zpc2libGUnXG5cdFx0XHRcdG92ZXJmbG93OiAndmlzaWJsZSdcblx0XHRcdFx0aGVpZ2h0OiAnYXV0bydcblxuXHRdXG4pXG5cblxuZXhwb3J0IG92ZXJsYXkgPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ292ZXJsYXknXG5cdFx0c3R5bGU6XG5cdFx0XHRwb3NpdGlvbjogJ2ZpeGVkJ1xuXHRcdFx0ekluZGV4OiAxXG5cdFx0XHRsZWZ0OiAwXG5cdFx0XHR0b3A6IDBcblx0XHRcdHdpZHRoOiAnMTAwdncnXG5cdFx0XHRtaW5IZWlnaHQ6ICcxMDB2aCdcblx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdGJhY2tncm91bmRDb2xvcjogKHBvcHVwKS0+IHBvcHVwLnNldHRpbmdzLm92ZXJsYXlDb2xvclxuXHRcdFx0dHJhbnNpdGlvbjogKHBvcHVwKS0+IFwib3BhY2l0eSAje3BvcHVwLnNldHRpbmdzLmFuaW1hdGlvbn1tc1wiXG5cdFx0XHQkb3Blbjpcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRdXG4pXG5cblxuZXhwb3J0IGNvbnRlbnQgPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ2NvbnRlbnQnXG5cdFx0c3R5bGU6XG5cdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0ekluZGV4OiAyXG5cdFx0XHRib3hTaXppbmc6ICdib3JkZXItYm94J1xuXHRcdFx0bWF4V2lkdGg6ICcxMDAlJ1xuXHRcdFx0bWFyZ2luOiAnMCBhdXRvJ1xuXHRcdFx0cGFkZGluZzogKHBvcHVwKS0+IHBvcHVwLnNldHRpbmdzLmNvbnRlbnRQYWRkaW5nXG5cdFx0XHRvcGFjaXR5OiAwXG5cdFx0XHR0cmFuc2l0aW9uOiAocG9wdXApLT5cblx0XHRcdFx0ZHVyYXRpb24gPSBwb3B1cC5zZXR0aW5ncy5hbmltYXRpb25cblx0XHRcdFx0XCJ0cmFuc2Zvcm0gI3tkdXJhdGlvbn1tcyxcblx0XHRcdFx0LXdlYmtpdC10cmFuc2Zvcm0gI3tkdXJhdGlvbn1tcyxcblx0XHRcdFx0b3BhY2l0eSAje2R1cmF0aW9ufW1zXCJcblx0XHRcdFxuXHRcdFx0JG9wZW46XG5cdFx0XHRcdG9wYWNpdHk6IDFcblxuXHRcdFx0JGNlbnRlclBsYWNlbWVudDpcblx0XHRcdFx0bGVmdDogJzUwJSdcblx0XHRcdFx0dHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtNTAlKSdcblx0XHRcdFxuXHRcdFx0JHRvcFBsYWNlbWVudDpcblx0XHRcdFx0dG9wOiAwXG5cdFx0XHRcdGxlZnQ6ICc1MCUnXG5cdFx0XHRcdHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSkgdHJhbnNsYXRlWSgtMTAwJSknXG5cdFx0XHRcdCRvcGVuOiB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01MCUpIHRyYW5zbGF0ZVkoMCknXG5cdFx0XHRcblx0XHRcdCRib3R0b21QbGFjZW1lbnQ6XG5cdFx0XHRcdGJvdHRvbTogMFxuXHRcdFx0XHRsZWZ0OiAnNTAlJ1xuXHRcdFx0XHR0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01MCUpIHRyYW5zbGF0ZVkoMTAwJSknXG5cdFx0XHRcdCRvcGVuOiB0cmFuc2Zvcm06ICd0cmFuc2xhdGVYKC01MCUpIHRyYW5zbGF0ZVkoMCknXG5cblx0XHRjb21wdXRlcnM6XG5cdFx0XHRwbGFjZW1lbnQ6IChwbGFjZW1lbnQpLT4gQHN0YXRlIFwiI3twbGFjZW1lbnR9UGxhY2VtZW50XCIsIG9uXG5cdFx0XHRjb250ZW50OiAoY29udGVudCktPiBAYXBwZW5kKGNvbnRlbnQpIGlmIGNvbnRlbnRcblxuXHRcdGV2ZW50czogJ3N0YXRlQ2hhbmdlOnZpc2libGUnOiAodmlzaWJsZSktPlxuXHRcdFx0aWYgdmlzaWJsZSBhbmQgRE9NKEApLnJlbGF0ZWQuc2V0dGluZ3MucGxhY2VtZW50IGlzICdjZW50ZXInXG5cdFx0XHRcdERPTShAKS5yZWxhdGVkLmFsaWduVG9DZW50ZXIoKVxuXHRdXG4pXG5cblxuZXhwb3J0IGNsb3NlID0gRE9NLnRlbXBsYXRlKFxuXHRbJ2Rpdidcblx0XHRyZWY6ICdjbG9zZSdcblx0XHRzdHlsZTpcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHRkaXNwbGF5OiAocG9wdXApLT4gaWYgcG9wdXAuc2V0dGluZ3MuY2xvc2Uuc2hvdyB0aGVuICdibG9jaycgZWxzZSAnbm9uZSdcblx0XHRcdHRvcDogKHBvcHVwKS0+IGlmIHBvcHVwLnNldHRpbmdzLmNsb3NlLmluc2lkZSB0aGVuIHBvcHVwLnNldHRpbmdzLmNsb3NlLnBhZGRpbmcgZWxzZSBwb3B1cC5zZXR0aW5ncy5jbG9zZS5zaXplKjIuNSAqIC0xXG5cdFx0XHRyaWdodDogKHBvcHVwKS0+IGlmIHBvcHVwLnNldHRpbmdzLmNsb3NlLmluc2lkZSB0aGVuIHBvcHVwLnNldHRpbmdzLmNsb3NlLnBhZGRpbmcgZWxzZSAwXG5cdFx0XHR3aWR0aDogKHBvcHVwKS0+IHBvcHVwLnNldHRpbmdzLmNsb3NlLnNpemVcblx0XHRcdGhlaWdodDogKHBvcHVwKS0+IHBvcHVwLnNldHRpbmdzLmNsb3NlLnNpemVcblx0XHRcdGNvbG9yOiAocG9wdXApLT4gcG9wdXAuc2V0dGluZ3MuY2xvc2UuY29sb3JcblxuXHRcdFsnKnN2Zydcblx0XHRcdGF0dHJzOiB2aWV3Qm94OlwiMCAwIDQ5MiA0OTJcIlxuXHRcdFx0c3R5bGU6IHdpZHRoOicxMDAlJywgaGVpZ2h0OicxMDAlJ1xuXG5cdFx0XHRbJypwYXRoJ1xuXHRcdFx0XHRhdHRyczogZDonTTMwMC4yIDI0Nkw0ODQuMSA2MmM1LjEtNS4xIDcuOS0xMS44IDcuOS0xOSAwLTcuMi0yLjgtMTQtNy45LTE5TDQ2OCA3LjljLTUuMS01LjEtMTEuOC03LjktMTktNy45IC03LjIgMC0xNCAyLjgtMTkgNy45TDI0NiAxOTEuOCA2MiA3LjljLTUuMS01LjEtMTEuOC03LjktMTktNy45IC03LjIgMC0xNCAyLjgtMTkgNy45TDcuOSAyNGMtMTAuNSAxMC41LTEwLjUgMjcuNiAwIDM4LjFMMTkxLjggMjQ2IDcuOSA0MzBjLTUuMSA1LjEtNy45IDExLjgtNy45IDE5IDAgNy4yIDIuOCAxNCA3LjkgMTlsMTYuMSAxNi4xYzUuMSA1LjEgMTEuOCA3LjkgMTkgNy45IDcuMiAwIDE0LTIuOCAxOS03LjlsMTg0LTE4NCAxODQgMTg0YzUuMSA1LjEgMTEuOCA3LjkgMTkgNy45aDBjNy4yIDAgMTQtMi44IDE5LTcuOWwxNi4xLTE2LjFjNS4xLTUuMSA3LjktMTEuOCA3LjktMTkgMC03LjItMi44LTE0LTcuOS0xOUwzMDAuMiAyNDZ6J1xuXHRcdFx0XHRzdHlsZTogZmlsbDogKHBvcHVwKS0+IHBvcHVwLnNldHRpbmdzLmNsb3NlLmNvbG9yXG5cdFx0XHRdXG5cdFx0XVxuXHRdXG4pXG5cblxuZXhwb3J0IGJvZHlXcmFwcGVyID0gRE9NLnRlbXBsYXRlKFxuXHRbJ2Rpdidcblx0XHRpZDogJ2JvZHlXcmFwcGVyJ1xuXHRcdHBhc3NTdGF0ZVRvQ2hpbGRyZW46IGZhbHNlXG5cdFx0c3R5bGU6XG5cdFx0XHQkb3Blbjpcblx0XHRcdFx0cG9zaXRpb246ICdmaXhlZCdcblx0XHRcdFx0d2lkdGg6ICcxMDAlJ1xuXHRcdFx0XHR0b3A6ICcnXG5cdF1cbilcblxuXG5leHBvcnQgaHRtbCA9IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0Y29tcHV0ZXJzOiBodG1sOiAoaHRtbCktPiBAaHRtbCA9IGh0bWxcblx0XVxuKVxuIiwiY29uc3RhbnRzID0gaW1wb3J0ICcuL2NvbnN0YW50cydcbmhlbHBlcnMgPSBpbXBvcnQgJy4vaGVscGVycydcblxuUXVpY2tDU1MgPSAodGFyZ2V0RWwsIHByb3BlcnR5LCB2YWx1ZSwgaW1wb3J0YW50KS0+XG5cdGlmIGhlbHBlcnMuaXNJdGVyYWJsZSh0YXJnZXRFbClcblx0XHRRdWlja0NTUyhzdWJFbCwgcHJvcGVydHksIHZhbHVlKSBmb3Igc3ViRWwgaW4gdGFyZ2V0RWxcblx0XG5cdGVsc2UgaWYgdHlwZW9mIHByb3BlcnR5IGlzICdvYmplY3QnICMgUGFzc2VkIGEgc3R5bGUgbWFwXG5cdFx0UXVpY2tDU1ModGFyZ2V0RWwsIHN1YlByb3BlcnR5LCBzdWJWYWx1ZSkgZm9yIHN1YlByb3BlcnR5LHN1YlZhbHVlIG9mIHByb3BlcnR5XG5cdFxuXHRlbHNlXG5cdFx0cHJvcGVydHkgPSBoZWxwZXJzLm5vcm1hbGl6ZVByb3BlcnR5KHByb3BlcnR5KVxuXHRcdGlmIHR5cGVvZiB2YWx1ZSBpcyAndW5kZWZpbmVkJ1xuXHRcdFx0Y29tcHV0ZWRTdHlsZSA9IHRhcmdldEVsLl9jb21wdXRlZFN0eWxlIHx8PSBnZXRDb21wdXRlZFN0eWxlKHRhcmdldEVsKVxuXHRcdFx0cmV0dXJuIGNvbXB1dGVkU3R5bGVbcHJvcGVydHldXG5cdFx0XG5cdFx0ZWxzZSBpZiBwcm9wZXJ0eVxuXHRcdFx0dGFyZ2V0RWwuc3R5bGUuc2V0UHJvcGVydHkocHJvcGVydHksIGhlbHBlcnMubm9ybWFsaXplVmFsdWUocHJvcGVydHksIHZhbHVlKSwgY29uc3RhbnRzLklNUE9SVEFOVCBpZiBpbXBvcnRhbnQpXG5cblx0cmV0dXJuXG5cblxuUXVpY2tDU1MuYW5pbWF0aW9uID0gKG5hbWUsIGZyYW1lcyktPiBpZiBuYW1lIGFuZCB0eXBlb2YgbmFtZSBpcyAnc3RyaW5nJyBhbmQgZnJhbWVzIGFuZCB0eXBlb2YgZnJhbWVzIGlzICdvYmplY3QnXG5cdHByZWZpeCA9IGhlbHBlcnMuZ2V0UHJlZml4KCdhbmltYXRpb24nKVxuXHRnZW5lcmF0ZWQgPSAnJ1xuXHRcblx0Zm9yIGZyYW1lLHJ1bGVzIG9mIGZyYW1lc1xuXHRcdGdlbmVyYXRlZCArPSBcIiN7ZnJhbWV9IHsje2hlbHBlcnMucnVsZVRvU3RyaW5nKHJ1bGVzKX19XCJcblxuXHRnZW5lcmF0ZWQgPSBcIkAje3ByZWZpeH1rZXlmcmFtZXMgI3tuYW1lfSB7I3tnZW5lcmF0ZWR9fVwiXG5cdGhlbHBlcnMuaW5saW5lU3R5bGUoZ2VuZXJhdGVkLCB0cnVlLCAwKVxuXG5cblF1aWNrQ1NTLnJlZ2lzdGVyID0gKHJ1bGUsIGxldmVsLCBpbXBvcnRhbnQpLT4gaWYgcnVsZSBhbmQgdHlwZW9mIHJ1bGUgaXMgJ29iamVjdCdcblx0bGV2ZWwgfHw9IDBcblx0cnVsZSA9IGhlbHBlcnMucnVsZVRvU3RyaW5nKHJ1bGUsIGltcG9ydGFudClcblx0XG5cdHVubGVzcyBjbGFzc05hbWUgPSBoZWxwZXJzLmlubGluZVN0eWxlQ29uZmlnW2xldmVsXT9bcnVsZV1cblx0XHRjbGFzc05hbWUgPSBoZWxwZXJzLmhhc2gocnVsZSlcblx0XHRzdHlsZSA9IFwiLiN7Y2xhc3NOYW1lfSB7I3tydWxlfX1cIlxuXHRcdGhlbHBlcnMuaW5saW5lU3R5bGUoc3R5bGUsIGNsYXNzTmFtZSwgbGV2ZWwpXG5cblx0cmV0dXJuIGNsYXNzTmFtZVxuXG5cblF1aWNrQ1NTLmNsZWFyUmVnaXN0ZXJlZCA9IChsZXZlbCktPlxuXHRoZWxwZXJzLmNsZWFySW5saW5lU3R5bGUobGV2ZWwgb3IgMClcblxuXG4jIyMgaXN0YW5idWwgaWdub3JlIG5leHQgIyMjXG5RdWlja0NTUy5VTlNFVCA9IHN3aXRjaFxuXHR3aGVuIGhlbHBlcnMuaXNWYWx1ZVN1cHBvcnRlZCgnZGlzcGxheScsJ3Vuc2V0JykgdGhlbiAndW5zZXQnXG5cdHdoZW4gaGVscGVycy5pc1ZhbHVlU3VwcG9ydGVkKCdkaXNwbGF5JywnaW5pdGlhbCcpIHRoZW4gJ2luaXRpYWwnXG5cdHdoZW4gaGVscGVycy5pc1ZhbHVlU3VwcG9ydGVkKCdkaXNwbGF5JywnaW5oZXJpdCcpIHRoZW4gJ2luaGVyaXQnXG5cblF1aWNrQ1NTLnN1cHBvcnRzID0gaGVscGVycy5pc1ZhbHVlU3VwcG9ydGVkXG5RdWlja0NTUy5zdXBwb3J0c1Byb3BlcnR5ID0gaGVscGVycy5pc1Byb3BTdXBwb3J0ZWRcblF1aWNrQ1NTLm5vcm1hbGl6ZVByb3BlcnR5ID0gaGVscGVycy5ub3JtYWxpemVQcm9wZXJ0eVxuUXVpY2tDU1Mubm9ybWFsaXplVmFsdWUgPSBoZWxwZXJzLm5vcm1hbGl6ZVZhbHVlXG5RdWlja0NTUy52ZXJzaW9uID0gaW1wb3J0ICcuLi9wYWNrYWdlLmpzb24gJCB2ZXJzaW9uJ1xubW9kdWxlLmV4cG9ydHMgPSBRdWlja0NTUyIsIntcbiAgXCJfZnJvbVwiOiBcInF1aWNrY3NzQF4xLjMuNFwiLFxuICBcIl9pZFwiOiBcInF1aWNrY3NzQDEuMy40XCIsXG4gIFwiX2luQnVuZGxlXCI6IGZhbHNlLFxuICBcIl9pbnRlZ3JpdHlcIjogXCJzaGE1MTItVUR3TE5YNXEwcXVFOW1WTmN6Q1JYQlp2R0xiazhyVU16QzBYM0pLdDJaYWp2VUZ3dnRFbGFESDFGMVdja0lpNlQzREdldnRSb0tYa1A2Q1Fkc1kyeWc9PVwiLFxuICBcIl9sb2NhdGlvblwiOiBcIi9xdWlja2Nzc1wiLFxuICBcIl9waGFudG9tQ2hpbGRyZW5cIjoge30sXG4gIFwiX3JlcXVlc3RlZFwiOiB7XG4gICAgXCJ0eXBlXCI6IFwicmFuZ2VcIixcbiAgICBcInJlZ2lzdHJ5XCI6IHRydWUsXG4gICAgXCJyYXdcIjogXCJxdWlja2Nzc0BeMS4zLjRcIixcbiAgICBcIm5hbWVcIjogXCJxdWlja2Nzc1wiLFxuICAgIFwiZXNjYXBlZE5hbWVcIjogXCJxdWlja2Nzc1wiLFxuICAgIFwicmF3U3BlY1wiOiBcIl4xLjMuNFwiLFxuICAgIFwic2F2ZVNwZWNcIjogbnVsbCxcbiAgICBcImZldGNoU3BlY1wiOiBcIl4xLjMuNFwiXG4gIH0sXG4gIFwiX3JlcXVpcmVkQnlcIjogW1xuICAgIFwiL3F1aWNrZG9tXCJcbiAgXSxcbiAgXCJfcmVzb2x2ZWRcIjogXCJodHRwczovL3JlZ2lzdHJ5Lm5wbWpzLm9yZy9xdWlja2Nzcy8tL3F1aWNrY3NzLTEuMy40LnRnelwiLFxuICBcIl9zaGFzdW1cIjogXCJjZTE0NWNhNTExYmM1MDZiMmQ5YTYxNGVkNWI2MWU3ODY5ZmUxMWQ1XCIsXG4gIFwiX3NwZWNcIjogXCJxdWlja2Nzc0BeMS4zLjRcIixcbiAgXCJfd2hlcmVcIjogXCIvVXNlcnMvZGFuaWVsa2FsZW4vc2FuZGJveC9xdWlja3BvcHVwL25vZGVfbW9kdWxlcy9xdWlja2RvbVwiLFxuICBcImF1dGhvclwiOiB7XG4gICAgXCJuYW1lXCI6IFwiZGFuaWVsa2FsZW5cIlxuICB9LFxuICBcImJyb3dzZXJcIjoge1xuICAgIFwiLi9kZWJ1Z1wiOiBcImRpc3QvcXVpY2tjc3MuZGVidWcuanNcIixcbiAgICBcIi4vZGlzdC9xdWlja2Nzcy5qc1wiOiBcInNyYy9pbmRleC5jb2ZmZWVcIlxuICB9LFxuICBcImJyb3dzZXJpZnlcIjoge1xuICAgIFwidHJhbnNmb3JtXCI6IFtcbiAgICAgIFwic2ltcGx5aW1wb3J0L2NvbXBhdFwiXG4gICAgXVxuICB9LFxuICBcImJ1Z3NcIjoge1xuICAgIFwidXJsXCI6IFwiaHR0cHM6Ly9naXRodWIuY29tL2RhbmllbGthbGVuL3F1aWNrY3NzL2lzc3Vlc1wiXG4gIH0sXG4gIFwiYnVuZGxlRGVwZW5kZW5jaWVzXCI6IGZhbHNlLFxuICBcImRlcHJlY2F0ZWRcIjogZmFsc2UsXG4gIFwiZGVzY3JpcHRpb25cIjogXCJGYXN0ICYgbGlnaHQgd3JhcHBlciBmb3IgZ2V0dGluZy9zZXR0aW5nIENTUyBydWxlc1wiLFxuICBcImRldkRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJibHVlYmlyZFwiOiBcIl4zLjUuMFwiLFxuICAgIFwiY2hhbGtcIjogXCJeMi4wLjFcIixcbiAgICBcImNvZmZlZS1zY3JpcHRcIjogXCJeMS4xMi42XCIsXG4gICAgXCJleGVjYVwiOiBcIl4wLjcuMFwiLFxuICAgIFwiZnMtamV0cGFja1wiOiBcIl4wLjEzLjNcIixcbiAgICBcInByb21pc2UtYnJlYWtcIjogXCJeMC4xLjFcIixcbiAgICBcInNlbXZlclwiOiBcIl41LjMuMFwiLFxuICAgIFwic2ltcGx5aW1wb3J0XCI6IFwiXjQuMC4wLXMyN1wiLFxuICAgIFwic2ltcGx5d2F0Y2hcIjogXCJeMy4wLjAtbDJcIlxuICB9LFxuICBcImRpcmVjdG9yaWVzXCI6IHtcbiAgICBcInRlc3RcIjogXCJ0ZXN0XCJcbiAgfSxcbiAgXCJob21lcGFnZVwiOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9kYW5pZWxrYWxlbi9xdWlja2NzcyNyZWFkbWVcIixcbiAgXCJsaWNlbnNlXCI6IFwiSVNDXCIsXG4gIFwibWFpblwiOiBcImRpc3QvcXVpY2tjc3MuanNcIixcbiAgXCJuYW1lXCI6IFwicXVpY2tjc3NcIixcbiAgXCJyZXBvc2l0b3J5XCI6IHtcbiAgICBcInR5cGVcIjogXCJnaXRcIixcbiAgICBcInVybFwiOiBcImdpdCtodHRwczovL2dpdGh1Yi5jb20vZGFuaWVsa2FsZW4vcXVpY2tjc3MuZ2l0XCJcbiAgfSxcbiAgXCJzY3JpcHRzXCI6IHtcbiAgICBcImJ1aWxkXCI6IFwiY2FrZSAtZCBidWlsZCAmJiBjYWtlIGJ1aWxkICYmIGNha2UgbWVhc3VyZSAmJiBjcCAtciBidWlsZC8qIGRpc3QvXCIsXG4gICAgXCJjb3ZlcmFnZVwiOiBcImNha2UgaW5zdGFsbDpjb3ZlcmFnZTsgbnBtIHJ1biBjb3ZlcmFnZTpydW4gJiYgbnBtIHJ1biBjb3ZlcmFnZTpiYWRnZVwiLFxuICAgIFwiY292ZXJhZ2U6YmFkZ2VcIjogXCJiYWRnZS1nZW4gLWQgLi8uY29uZmlnL2JhZGdlcy9jb3ZlcmFnZVwiLFxuICAgIFwiY292ZXJhZ2U6cnVuXCI6IFwiY292ZXJhZ2U9dHJ1ZSBucG0gcnVuIHRlc3Q6ZWxlY3Ryb25cIixcbiAgICBcImNvdmVyYWdlOnNob3dcIjogXCJvcGVuIGNvdmVyYWdlL2xjb3YtcmVwb3J0L2luZGV4Lmh0bWxcIixcbiAgICBcInBvc3RwdWJsaXNoXCI6IFwiZ2l0IHB1c2hcIixcbiAgICBcInBvc3R2ZXJzaW9uXCI6IFwibnBtIHJ1biBidWlsZCAmJiBnaXQgYWRkIC4gJiYgZ2l0IGNvbW1pdCAtYSAtbSAnW0J1aWxkXSdcIixcbiAgICBcInByZXB1Ymxpc2hPbmx5XCI6IFwibnBtIHJ1biB0ZXN0OnRyYXZpc1wiLFxuICAgIFwidGVzdFwiOiBcIm5wbSBydW4gdGVzdDpicm93c2VyIC1zIHx8IHRydWVcIixcbiAgICBcInRlc3Q6YnJvd3NlclwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBFbGVjdHJvbiAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmNocm9tZVwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyAga2FybWEgc3RhcnQgLS1zaW5nbGUtcnVuIC0tYnJvd3NlcnMgQ2hyb21lIC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6ZmlyZWZveFwiOiBcImNha2UgaW5zdGFsbDp0ZXN0OyBrYXJtYSBzdGFydCAtLXNpbmdsZS1ydW4gLS1icm93c2VycyBGaXJlZm94IC5jb25maWcva2FybWEuY29uZi5jb2ZmZWVcIixcbiAgICBcInRlc3Q6a2FybWFcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgICBrYXJtYSBzdGFydCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OmxvY2FsXCI6IFwib3BlbiB0ZXN0L3Rlc3RydW5uZXIuaHRtbFwiLFxuICAgIFwidGVzdDptaW5pZmllZFwiOiBcIm1pbmlmaWVkPTEgbnBtIHJ1biB0ZXN0OmJyb3dzZXIgLXMgfHwgdHJ1ZVwiLFxuICAgIFwidGVzdDpzYWZhcmlcIjogXCJjYWtlIGluc3RhbGw6dGVzdDsgIGthcm1hIHN0YXJ0IC0tc2luZ2xlLXJ1biAtLWJyb3dzZXJzIFNhZmFyaSAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OnNhdWNlXCI6IFwiY2FrZSBpbnN0YWxsOnRlc3Q7ICAgc2F1Y2U9MSBrYXJtYSBzdGFydCAuY29uZmlnL2thcm1hLmNvbmYuY29mZmVlXCIsXG4gICAgXCJ0ZXN0OnRyYXZpc1wiOiBcIm5wbSBydW4gdGVzdDpicm93c2VyIC1zICYmIG5wbSBydW4gdGVzdDptaW5pZmllZCAtc1wiLFxuICAgIFwid2F0Y2hcIjogXCJjYWtlIC1kIHdhdGNoXCJcbiAgfSxcbiAgXCJzaW1wbHlpbXBvcnRcIjoge1xuICAgIFwiZmluYWxUcmFuc2Zvcm1cIjogW1xuICAgICAgXCIuY29uZmlnL3RyYW5zZm9ybXMvbWluaWZ5LXN1cGVyXCIsXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktcmVuYW1lXCIsXG4gICAgICBcIi5jb25maWcvdHJhbnNmb3Jtcy9taW5pZnktc2ltcGxlXCJcbiAgICBdXG4gIH0sXG4gIFwidmVyc2lvblwiOiBcIjEuMy40XCJcbn1cbiIsInZhciBleHRlbmQsIGlzQXJyYXksIGlzT2JqZWN0LCBzaG91bGREZWVwRXh0ZW5kO1xuXG5pc0FycmF5ID0gZnVuY3Rpb24odGFyZ2V0KSB7XG4gIHJldHVybiBBcnJheS5pc0FycmF5KHRhcmdldCk7XG59O1xuXG5pc09iamVjdCA9IGZ1bmN0aW9uKHRhcmdldCkge1xuICByZXR1cm4gdGFyZ2V0ICYmIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0YXJnZXQpID09PSAnW29iamVjdCBPYmplY3RdJyB8fCBpc0FycmF5KHRhcmdldCk7XG59O1xuXG5zaG91bGREZWVwRXh0ZW5kID0gZnVuY3Rpb24ob3B0aW9ucywgdGFyZ2V0LCBwYXJlbnRLZXkpIHtcbiAgaWYgKG9wdGlvbnMuZGVlcCkge1xuICAgIGlmIChvcHRpb25zLm5vdERlZXApIHtcbiAgICAgIHJldHVybiAhb3B0aW9ucy5ub3REZWVwW3RhcmdldF07XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfSBlbHNlIGlmIChvcHRpb25zLmRlZXBPbmx5KSB7XG4gICAgcmV0dXJuIG9wdGlvbnMuZGVlcE9ubHlbdGFyZ2V0XSB8fCBwYXJlbnRLZXkgJiYgc2hvdWxkRGVlcEV4dGVuZChvcHRpb25zLCBwYXJlbnRLZXkpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4dGVuZCA9IGZ1bmN0aW9uKG9wdGlvbnMsIHRhcmdldCwgc291cmNlcywgcGFyZW50S2V5KSB7XG4gIHZhciBpLCBrZXksIGxlbiwgc291cmNlLCBzb3VyY2VWYWx1ZSwgc3ViVGFyZ2V0LCB0YXJnZXRWYWx1ZTtcbiAgaWYgKCF0YXJnZXQgfHwgdHlwZW9mIHRhcmdldCAhPT0gJ29iamVjdCcgJiYgdHlwZW9mIHRhcmdldCAhPT0gJ2Z1bmN0aW9uJykge1xuICAgIHRhcmdldCA9IHt9O1xuICB9XG4gIGZvciAoaSA9IDAsIGxlbiA9IHNvdXJjZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBzb3VyY2UgPSBzb3VyY2VzW2ldO1xuICAgIGlmIChzb3VyY2UgIT0gbnVsbCkge1xuICAgICAgZm9yIChrZXkgaW4gc291cmNlKSB7XG4gICAgICAgIHNvdXJjZVZhbHVlID0gc291cmNlW2tleV07XG4gICAgICAgIHRhcmdldFZhbHVlID0gdGFyZ2V0W2tleV07XG4gICAgICAgIGlmIChzb3VyY2VWYWx1ZSA9PT0gdGFyZ2V0IHx8IHNvdXJjZVZhbHVlID09PSB2b2lkIDAgfHwgKHNvdXJjZVZhbHVlID09PSBudWxsICYmICFvcHRpb25zLmFsbG93TnVsbCAmJiAhb3B0aW9ucy5udWxsRGVsZXRlcykgfHwgKG9wdGlvbnMua2V5cyAmJiAhb3B0aW9ucy5rZXlzW2tleV0pIHx8IChvcHRpb25zLm5vdEtleXMgJiYgb3B0aW9ucy5ub3RLZXlzW2tleV0pIHx8IChvcHRpb25zLm93biAmJiAhc291cmNlLmhhc093blByb3BlcnR5KGtleSkpIHx8IChvcHRpb25zLmdsb2JhbEZpbHRlciAmJiAhb3B0aW9ucy5nbG9iYWxGaWx0ZXIoc291cmNlVmFsdWUsIGtleSwgc291cmNlKSkgfHwgKG9wdGlvbnMuZmlsdGVycyAmJiBvcHRpb25zLmZpbHRlcnNba2V5XSAmJiAhb3B0aW9ucy5maWx0ZXJzW2tleV0oc291cmNlVmFsdWUsIGtleSwgc291cmNlKSkpIHtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc291cmNlVmFsdWUgPT09IG51bGwgJiYgb3B0aW9ucy5udWxsRGVsZXRlcykge1xuICAgICAgICAgIGRlbGV0ZSB0YXJnZXRba2V5XTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAob3B0aW9ucy5nbG9iYWxUcmFuc2Zvcm0pIHtcbiAgICAgICAgICBzb3VyY2VWYWx1ZSA9IG9wdGlvbnMuZ2xvYmFsVHJhbnNmb3JtKHNvdXJjZVZhbHVlLCBrZXksIHNvdXJjZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKG9wdGlvbnMudHJhbnNmb3JtcyAmJiBvcHRpb25zLnRyYW5zZm9ybXNba2V5XSkge1xuICAgICAgICAgIHNvdXJjZVZhbHVlID0gb3B0aW9ucy50cmFuc2Zvcm1zW2tleV0oc291cmNlVmFsdWUsIGtleSwgc291cmNlKTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKGZhbHNlKSB7XG4gICAgICAgICAgY2FzZSAhKG9wdGlvbnMuY29uY2F0ICYmIGlzQXJyYXkoc291cmNlVmFsdWUpICYmIGlzQXJyYXkodGFyZ2V0VmFsdWUpKTpcbiAgICAgICAgICAgIHRhcmdldFtrZXldID0gdGFyZ2V0VmFsdWUuY29uY2F0KHNvdXJjZVZhbHVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgIShzaG91bGREZWVwRXh0ZW5kKG9wdGlvbnMsIGtleSwgcGFyZW50S2V5KSAmJiBpc09iamVjdChzb3VyY2VWYWx1ZSkpOlxuICAgICAgICAgICAgc3ViVGFyZ2V0ID0gaXNPYmplY3QodGFyZ2V0VmFsdWUpID8gdGFyZ2V0VmFsdWUgOiBpc0FycmF5KHNvdXJjZVZhbHVlKSA/IFtdIDoge307XG4gICAgICAgICAgICB0YXJnZXRba2V5XSA9IGV4dGVuZChvcHRpb25zLCBzdWJUYXJnZXQsIFtzb3VyY2VWYWx1ZV0sIGtleSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgdGFyZ2V0W2tleV0gPSBzb3VyY2VWYWx1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gdGFyZ2V0O1xufTtcblxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSXVMaTl1YjJSbFgyMXZaSFZzWlhNdmMyMWhjblF0WlhoMFpXNWtMM055WXk5bGVIUmxibVF1WTI5bVptVmxJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHRkZlE9PSIsIid1c2Ugc3RyaWN0JztcbmNvbnN0IHBUaW1lb3V0ID0gcmVxdWlyZSgncC10aW1lb3V0Jyk7XG5cbm1vZHVsZS5leHBvcnRzID0gKGVtaXR0ZXIsIGV2ZW50LCBvcHRzKSA9PiB7XG5cdGxldCBjYW5jZWw7XG5cblx0Y29uc3QgcmV0ID0gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdGlmICh0eXBlb2Ygb3B0cyA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0b3B0cyA9IHtmaWx0ZXI6IG9wdHN9O1xuXHRcdH1cblxuXHRcdG9wdHMgPSBPYmplY3QuYXNzaWduKHtcblx0XHRcdHJlamVjdGlvbkV2ZW50czogWydlcnJvciddLFxuXHRcdFx0bXVsdGlBcmdzOiBmYWxzZVxuXHRcdH0sIG9wdHMpO1xuXG5cdFx0bGV0IGFkZExpc3RlbmVyID0gZW1pdHRlci5vbiB8fCBlbWl0dGVyLmFkZExpc3RlbmVyIHx8IGVtaXR0ZXIuYWRkRXZlbnRMaXN0ZW5lcjtcblx0XHRsZXQgcmVtb3ZlTGlzdGVuZXIgPSBlbWl0dGVyLm9mZiB8fCBlbWl0dGVyLnJlbW92ZUxpc3RlbmVyIHx8IGVtaXR0ZXIucmVtb3ZlRXZlbnRMaXN0ZW5lcjtcblxuXHRcdGlmICghYWRkTGlzdGVuZXIgfHwgIXJlbW92ZUxpc3RlbmVyKSB7XG5cdFx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdFbWl0dGVyIGlzIG5vdCBjb21wYXRpYmxlJyk7XG5cdFx0fVxuXG5cdFx0YWRkTGlzdGVuZXIgPSBhZGRMaXN0ZW5lci5iaW5kKGVtaXR0ZXIpO1xuXHRcdHJlbW92ZUxpc3RlbmVyID0gcmVtb3ZlTGlzdGVuZXIuYmluZChlbWl0dGVyKTtcblxuXHRcdGNvbnN0IHJlc29sdmVIYW5kbGVyID0gZnVuY3Rpb24gKHZhbHVlKSB7XG5cdFx0XHRpZiAob3B0cy5tdWx0aUFyZ3MpIHtcblx0XHRcdFx0dmFsdWUgPSBbXS5zbGljZS5hcHBseShhcmd1bWVudHMpO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAob3B0cy5maWx0ZXIgJiYgIW9wdHMuZmlsdGVyKHZhbHVlKSkge1xuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR9XG5cblx0XHRcdGNhbmNlbCgpO1xuXHRcdFx0cmVzb2x2ZSh2YWx1ZSk7XG5cdFx0fTtcblxuXHRcdGNvbnN0IHJlamVjdEhhbmRsZXIgPSBmdW5jdGlvbiAocmVhc29uKSB7XG5cdFx0XHRjYW5jZWwoKTtcblxuXHRcdFx0aWYgKG9wdHMubXVsdGlBcmdzKSB7XG5cdFx0XHRcdHJlamVjdChbXS5zbGljZS5hcHBseShhcmd1bWVudHMpKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJlamVjdChyZWFzb24pO1xuXHRcdFx0fVxuXHRcdH07XG5cblx0XHRjYW5jZWwgPSAoKSA9PiB7XG5cdFx0XHRyZW1vdmVMaXN0ZW5lcihldmVudCwgcmVzb2x2ZUhhbmRsZXIpO1xuXG5cdFx0XHRmb3IgKGNvbnN0IHJlamVjdGlvbkV2ZW50IG9mIG9wdHMucmVqZWN0aW9uRXZlbnRzKSB7XG5cdFx0XHRcdHJlbW92ZUxpc3RlbmVyKHJlamVjdGlvbkV2ZW50LCByZWplY3RIYW5kbGVyKTtcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0YWRkTGlzdGVuZXIoZXZlbnQsIHJlc29sdmVIYW5kbGVyKTtcblxuXHRcdGZvciAoY29uc3QgcmVqZWN0aW9uRXZlbnQgb2Ygb3B0cy5yZWplY3Rpb25FdmVudHMpIHtcblx0XHRcdGFkZExpc3RlbmVyKHJlamVjdGlvbkV2ZW50LCByZWplY3RIYW5kbGVyKTtcblx0XHR9XG5cdH0pO1xuXG5cdHJldC5jYW5jZWwgPSBjYW5jZWw7XG5cblx0aWYgKHR5cGVvZiBvcHRzLnRpbWVvdXQgPT09ICdudW1iZXInKSB7XG5cdFx0cmV0dXJuIHBUaW1lb3V0KHJldCwgb3B0cy50aW1lb3V0KTtcblx0fVxuXG5cdHJldHVybiByZXQ7XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBjcmVhdGVFbmRCcmVhayh2YWx1ZSkge1xuXHR2YXIgaW5zdGFuY2UgPSBPYmplY3QuY3JlYXRlKEVycm9yLnByb3RvdHlwZSk7XG5cdGluc3RhbmNlLnZhbHVlID0gdmFsdWU7XG5cdGluc3RhbmNlLl9faXNFbmRCcmVhayA9IHRydWU7XG5cdHJldHVybiBpbnN0YW5jZTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodmFsKSB7XG5cdHZhciBlcnIgPSBjcmVhdGVFbmRCcmVhayh2YWwpO1xuXHR0aHJvdyBlcnI7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5lbmQgPSBmdW5jdGlvbiAoZXJyKSB7XG5cdGlmIChlcnIuX19pc0VuZEJyZWFrKSB7XG5cdFx0cmV0dXJuIGVyci52YWx1ZTtcblx0fVxuXG5cdHRocm93IGVycjtcbn07XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0ltWnBiR1VpT2lJdUxpOXViMlJsWDIxdlpIVnNaWE12Y0hKdmJXbHpaUzFpY21WaGF5OXBibVJsZUM1cWN5SXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJYWDA9IiwiSVMgPSBfJHNtKCcuL2NoZWNrcycgKVxuZXh0ZW5kID0gXyRzbSgnc21hcnQtZXh0ZW5kJyApXG5kZXRlY3RBbmltYXRpb24gPSBfJHNtKCdkZXRlY3QtYW5pbWF0aW9uLWVuZC1oZWxwZXInIClcblxuZXhwb3J0cy5leHRlbmRTZXR0aW5ncyA9IChkZWZhdWx0cywgc2V0dGluZ3MpLT5cblx0ZXh0ZW5kXG5cdFx0LmZpbHRlclxuXHRcdFx0cGxhY2VtZW50OiBJUy5zdHJpbmdcblx0XHRcdHRlbXBsYXRlOiBJUy5vYmplY3RQbGFpblxuXHRcdFx0Y29uZGl0aW9uOiBJUy5mdW5jdGlvblxuXHRcdFx0YW5pbWF0aW9uOiBJUy5udW1iZXJcblx0XHRcdG92ZXJsYXlDb2xvcjogSVMuc3RyaW5nXG5cdFx0XHRvcGVuOiBJUy5vYmplY3RQbGFpblxuXHRcdFx0Y2xvc2U6IElTLm9iamVjdFBsYWluXG5cdFx0XHR0cmlnZ2VyczogSVMub2JqZWN0UGxhaW5cblxuXHRcdC5jbG9uZS5kZWVwLm5vdERlZXAoJ2NvbnRlbnQnKShkZWZhdWx0cywgc2V0dGluZ3MpXG5cblxuZXhwb3J0cy5zY2hlZHVsZVNjcm9sbFJlc2V0ID0gKHNjaGVkdWxlTmV4dCktPiBzZXRUaW1lb3V0ICgpLT5cblx0d2luZG93LnNjcm9sbCgwLDApXG5cdFxuXHRpZiBzY2hlZHVsZU5leHRcblx0XHRzZXRUaW1lb3V0ICgpLT5cblx0XHRcdGV4cG9ydHMuc2NoZWR1bGVTY3JvbGxSZXNldCgpXG5cdFx0LCBzY2hlZHVsZU5leHRcblxuZXhwb3J0cy50cmFuc2l0aW9uRW5kID0gKCktPlxuXHRkZXRlY3RBbmltYXRpb24oJ3RyYW5zaXRpb24nKVxuXG5leHBvcnRzLnNjcm9sbE9mZnNldCA9ICgpLT5cblx0d2luZG93LnNjcm9sbFkgLSBleHBvcnRzLmRvY3VtZW50T2Zmc2V0KClcblxuZXhwb3J0cy5kb2N1bWVudE9mZnNldCA9ICgpLT5cblx0KGRvY3VtZW50LmJvZHkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk/LnRvcCBvciAwKSArIHdpbmRvdy5zY3JvbGxZXG5cblxuZXhwb3J0cy52aXNpYmlsaXR5QXBpS2V5cyA9ICgpLT4gc3dpdGNoXG5cdHdoZW4gSVMuZGVmaW5lZChkb2N1bWVudC5oaWRkZW4pXG5cdFx0aGlkZGVuOidoaWRkZW4nLCB2aXNpYmlsaXR5Y2hhbmdlOid2aXNpYmlsaXR5Y2hhbmdlJ1xuXHRcblx0d2hlbiBJUy5kZWZpbmVkKGRvY3VtZW50Lm1zSGlkZGVuKVxuXHRcdGhpZGRlbjonbXNIaWRkZW4nLCB2aXNpYmlsaXR5Y2hhbmdlOidtc3Zpc2liaWxpdHljaGFuZ2UnXG5cdFxuXHR3aGVuIElTLmRlZmluZWQoZG9jdW1lbnQud2Via2l0SGlkZGVuKVxuXHRcdGhpZGRlbjond2Via2l0SGlkZGVuJywgdmlzaWJpbGl0eWNoYW5nZTond2Via2l0dmlzaWJpbGl0eWNoYW5nZSdcblxuXHRlbHNlIHt9XG5cbiIsIi8qKlxuICogZXZlbnQtbGl0ZS5qcyAtIExpZ2h0LXdlaWdodCBFdmVudEVtaXR0ZXIgKGxlc3MgdGhhbiAxS0Igd2hlbiBnemlwcGVkKVxuICpcbiAqIEBjb3B5cmlnaHQgWXVzdWtlIEthd2FzYWtpXG4gKiBAbGljZW5zZSBNSVRcbiAqIEBjb25zdHJ1Y3RvclxuICogQHNlZSBodHRwczovL2dpdGh1Yi5jb20va2F3YW5ldC9ldmVudC1saXRlXG4gKiBAc2VlIGh0dHA6Ly9rYXdhbmV0LmdpdGh1Yi5pby9ldmVudC1saXRlL0V2ZW50TGl0ZS5odG1sXG4gKiBAZXhhbXBsZVxuICogdmFyIEV2ZW50TGl0ZSA9IHJlcXVpcmUoXCJldmVudC1saXRlXCIpO1xuICpcbiAqIGZ1bmN0aW9uIE15Q2xhc3MoKSB7Li4ufSAgICAgICAgICAgICAvLyB5b3VyIGNsYXNzXG4gKlxuICogRXZlbnRMaXRlLm1peGluKE15Q2xhc3MucHJvdG90eXBlKTsgIC8vIGltcG9ydCBldmVudCBtZXRob2RzXG4gKlxuICogdmFyIG9iaiA9IG5ldyBNeUNsYXNzKCk7XG4gKiBvYmoub24oXCJmb29cIiwgZnVuY3Rpb24oKSB7Li4ufSk7ICAgICAvLyBhZGQgZXZlbnQgbGlzdGVuZXJcbiAqIG9iai5vbmNlKFwiYmFyXCIsIGZ1bmN0aW9uKCkgey4uLn0pOyAgIC8vIGFkZCBvbmUtdGltZSBldmVudCBsaXN0ZW5lclxuICogb2JqLmVtaXQoXCJmb29cIik7ICAgICAgICAgICAgICAgICAgICAgLy8gZGlzcGF0Y2ggZXZlbnRcbiAqIG9iai5lbWl0KFwiYmFyXCIpOyAgICAgICAgICAgICAgICAgICAgIC8vIGRpc3BhdGNoIGFub3RoZXIgZXZlbnRcbiAqIG9iai5vZmYoXCJmb29cIik7ICAgICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBldmVudCBsaXN0ZW5lclxuICovXG5cbmZ1bmN0aW9uIEV2ZW50TGl0ZSgpIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEV2ZW50TGl0ZSkpIHJldHVybiBuZXcgRXZlbnRMaXRlKCk7XG59XG5cbihmdW5jdGlvbihFdmVudExpdGUpIHtcbiAgLy8gZXhwb3J0IHRoZSBjbGFzcyBmb3Igbm9kZS5qc1xuICBpZiAoXCJ1bmRlZmluZWRcIiAhPT0gdHlwZW9mIG1vZHVsZSkgbW9kdWxlLmV4cG9ydHMgPSBFdmVudExpdGU7XG5cbiAgLy8gcHJvcGVydHkgbmFtZSB0byBob2xkIGxpc3RlbmVyc1xuICB2YXIgTElTVEVORVJTID0gXCJsaXN0ZW5lcnNcIjtcblxuICAvLyBtZXRob2RzIHRvIGV4cG9ydFxuICB2YXIgbWV0aG9kcyA9IHtcbiAgICBvbjogb24sXG4gICAgb25jZTogb25jZSxcbiAgICBvZmY6IG9mZixcbiAgICBlbWl0OiBlbWl0XG4gIH07XG5cbiAgLy8gbWl4aW4gdG8gc2VsZlxuICBtaXhpbihFdmVudExpdGUucHJvdG90eXBlKTtcblxuICAvLyBleHBvcnQgbWl4aW4gZnVuY3Rpb25cbiAgRXZlbnRMaXRlLm1peGluID0gbWl4aW47XG5cbiAgLyoqXG4gICAqIEltcG9ydCBvbigpLCBvbmNlKCksIG9mZigpIGFuZCBlbWl0KCkgbWV0aG9kcyBpbnRvIHRhcmdldCBvYmplY3QuXG4gICAqXG4gICAqIEBmdW5jdGlvbiBFdmVudExpdGUubWl4aW5cbiAgICogQHBhcmFtIHRhcmdldCB7UHJvdG90eXBlfVxuICAgKi9cblxuICBmdW5jdGlvbiBtaXhpbih0YXJnZXQpIHtcbiAgICBmb3IgKHZhciBrZXkgaW4gbWV0aG9kcykge1xuICAgICAgdGFyZ2V0W2tleV0gPSBtZXRob2RzW2tleV07XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFuIGV2ZW50IGxpc3RlbmVyLlxuICAgKlxuICAgKiBAZnVuY3Rpb24gRXZlbnRMaXRlLnByb3RvdHlwZS5vblxuICAgKiBAcGFyYW0gdHlwZSB7c3RyaW5nfVxuICAgKiBAcGFyYW0gZnVuYyB7RnVuY3Rpb259XG4gICAqIEByZXR1cm5zIHtFdmVudExpdGV9IFNlbGYgZm9yIG1ldGhvZCBjaGFpbmluZ1xuICAgKi9cblxuICBmdW5jdGlvbiBvbih0eXBlLCBmdW5jKSB7XG4gICAgZ2V0TGlzdGVuZXJzKHRoaXMsIHR5cGUpLnB1c2goZnVuYyk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQWRkIG9uZS10aW1lIGV2ZW50IGxpc3RlbmVyLlxuICAgKlxuICAgKiBAZnVuY3Rpb24gRXZlbnRMaXRlLnByb3RvdHlwZS5vbmNlXG4gICAqIEBwYXJhbSB0eXBlIHtzdHJpbmd9XG4gICAqIEBwYXJhbSBmdW5jIHtGdW5jdGlvbn1cbiAgICogQHJldHVybnMge0V2ZW50TGl0ZX0gU2VsZiBmb3IgbWV0aG9kIGNoYWluaW5nXG4gICAqL1xuXG4gIGZ1bmN0aW9uIG9uY2UodHlwZSwgZnVuYykge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB3cmFwLm9yaWdpbmFsTGlzdGVuZXIgPSBmdW5jO1xuICAgIGdldExpc3RlbmVycyh0aGF0LCB0eXBlKS5wdXNoKHdyYXApO1xuICAgIHJldHVybiB0aGF0O1xuXG4gICAgZnVuY3Rpb24gd3JhcCgpIHtcbiAgICAgIG9mZi5jYWxsKHRoYXQsIHR5cGUsIHdyYXApO1xuICAgICAgZnVuYy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgYW4gZXZlbnQgbGlzdGVuZXIuXG4gICAqXG4gICAqIEBmdW5jdGlvbiBFdmVudExpdGUucHJvdG90eXBlLm9mZlxuICAgKiBAcGFyYW0gW3R5cGVdIHtzdHJpbmd9XG4gICAqIEBwYXJhbSBbZnVuY10ge0Z1bmN0aW9ufVxuICAgKiBAcmV0dXJucyB7RXZlbnRMaXRlfSBTZWxmIGZvciBtZXRob2QgY2hhaW5pbmdcbiAgICovXG5cbiAgZnVuY3Rpb24gb2ZmKHR5cGUsIGZ1bmMpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdmFyIGxpc3RuZXJzO1xuICAgIGlmICghYXJndW1lbnRzLmxlbmd0aCkge1xuICAgICAgZGVsZXRlIHRoYXRbTElTVEVORVJTXTtcbiAgICB9IGVsc2UgaWYgKCFmdW5jKSB7XG4gICAgICBsaXN0bmVycyA9IHRoYXRbTElTVEVORVJTXTtcbiAgICAgIGlmIChsaXN0bmVycykge1xuICAgICAgICBkZWxldGUgbGlzdG5lcnNbdHlwZV07XG4gICAgICAgIGlmICghT2JqZWN0LmtleXMobGlzdG5lcnMpLmxlbmd0aCkgcmV0dXJuIG9mZi5jYWxsKHRoYXQpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBsaXN0bmVycyA9IGdldExpc3RlbmVycyh0aGF0LCB0eXBlLCB0cnVlKTtcbiAgICAgIGlmIChsaXN0bmVycykge1xuICAgICAgICBsaXN0bmVycyA9IGxpc3RuZXJzLmZpbHRlcihuZSk7XG4gICAgICAgIGlmICghbGlzdG5lcnMubGVuZ3RoKSByZXR1cm4gb2ZmLmNhbGwodGhhdCwgdHlwZSk7XG4gICAgICAgIHRoYXRbTElTVEVORVJTXVt0eXBlXSA9IGxpc3RuZXJzO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhhdDtcblxuICAgIGZ1bmN0aW9uIG5lKHRlc3QpIHtcbiAgICAgIHJldHVybiB0ZXN0ICE9PSBmdW5jICYmIHRlc3Qub3JpZ2luYWxMaXN0ZW5lciAhPT0gZnVuYztcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGlzcGF0Y2ggKHRyaWdnZXIpIGFuIGV2ZW50LlxuICAgKlxuICAgKiBAZnVuY3Rpb24gRXZlbnRMaXRlLnByb3RvdHlwZS5lbWl0XG4gICAqIEBwYXJhbSB0eXBlIHtzdHJpbmd9XG4gICAqIEBwYXJhbSBbdmFsdWVdIHsqfVxuICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gVHJ1ZSB3aGVuIGEgbGlzdGVuZXIgcmVjZWl2ZWQgdGhlIGV2ZW50XG4gICAqL1xuXG4gIGZ1bmN0aW9uIGVtaXQodHlwZSwgdmFsdWUpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgdmFyIGxpc3RlbmVycyA9IGdldExpc3RlbmVycyh0aGF0LCB0eXBlLCB0cnVlKTtcbiAgICBpZiAoIWxpc3RlbmVycykgcmV0dXJuIGZhbHNlO1xuICAgIHZhciBhcmdsZW4gPSBhcmd1bWVudHMubGVuZ3RoO1xuICAgIGlmIChhcmdsZW4gPT09IDEpIHtcbiAgICAgIGxpc3RlbmVycy5mb3JFYWNoKHplcm9hcmcpO1xuICAgIH0gZWxzZSBpZiAoYXJnbGVuID09PSAyKSB7XG4gICAgICBsaXN0ZW5lcnMuZm9yRWFjaChvbmVhcmcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICBsaXN0ZW5lcnMuZm9yRWFjaChtb3JlYXJncyk7XG4gICAgfVxuICAgIHJldHVybiAhIWxpc3RlbmVycy5sZW5ndGg7XG5cbiAgICBmdW5jdGlvbiB6ZXJvYXJnKGZ1bmMpIHtcbiAgICAgIGZ1bmMuY2FsbCh0aGF0KTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBvbmVhcmcoZnVuYykge1xuICAgICAgZnVuYy5jYWxsKHRoYXQsIHZhbHVlKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtb3JlYXJncyhmdW5jKSB7XG4gICAgICBmdW5jLmFwcGx5KHRoYXQsIGFyZ3MpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBAaWdub3JlXG4gICAqL1xuXG4gIGZ1bmN0aW9uIGdldExpc3RlbmVycyh0aGF0LCB0eXBlLCByZWFkb25seSkge1xuICAgIGlmIChyZWFkb25seSAmJiAhdGhhdFtMSVNURU5FUlNdKSByZXR1cm47XG4gICAgdmFyIGxpc3RlbmVycyA9IHRoYXRbTElTVEVORVJTXSB8fCAodGhhdFtMSVNURU5FUlNdID0ge30pO1xuICAgIHJldHVybiBsaXN0ZW5lcnNbdHlwZV0gfHwgKGxpc3RlbmVyc1t0eXBlXSA9IFtdKTtcbiAgfVxuXG59KShFdmVudExpdGUpO1xuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSXVMaTl1YjJSbFgyMXZaSFZzWlhNdlpYWmxiblF0YkdsMFpTOWxkbVZ1ZEMxc2FYUmxMbXB6SWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2x0ZGZRPT0iLCJhdmFpbFNldHMgPSBcblx0bmF0aXZlczogaW1wb3J0ICcuL25hdGl2ZXMnXG5cdGRvbTogaW1wb3J0ICcuL2RvbSdcblxuY2xhc3MgQ2hlY2tzXG5cdGNyZWF0ZTogKCktPlxuXHRcdGFyZ3MgPSBBcnJheTo6c2xpY2UuY2FsbChhcmd1bWVudHMpIGlmIGFyZ3VtZW50cy5sZW5ndGhcblx0XHRuZXcgQ2hlY2tzKGFyZ3MpXG5cdFxuXG5cdGNvbnN0cnVjdG9yOiAoc2V0cyktPlxuXHRcdHNldHMgPz0gWyduYXRpdmVzJ11cblx0XHRcblx0XHRmb3Igc2V0IGluIHNldHNcblx0XHRcdEBsb2FkKGF2YWlsU2V0c1tzZXRdKSBpZiBhdmFpbFNldHNbc2V0XVxuXG5cblx0bG9hZDogKHNldCktPlxuXHRcdHNldCA9IGF2YWlsU2V0c1tzZXRdIGlmIGF2YWlsU2V0cy5uYXRpdmVzLnN0cmluZyhzZXQpXG5cdFx0cmV0dXJuIGlmIG5vdCBhdmFpbFNldHMubmF0aXZlcy5vYmplY3RQbGFpbihzZXQpXG5cdFx0XG5cdFx0Zm9yIGtleSx2YWx1ZSBvZiBzZXRcblx0XHRcdEBba2V5XSA9IHZhbHVlXG5cdFx0XG5cdFx0cmV0dXJuXG5cdFxuXHRcbm1vZHVsZS5leHBvcnRzID0gQ2hlY2tzOjpjcmVhdGUoKSIsImV4cG9ydHMuUkVHRVhfTEVOX1ZBTCA9IC9eXFxkKyg/OlthLXpdfFxcJSkrJC9pO1xuXG5leHBvcnRzLlJFR0VYX0RJR0lUUyA9IC9cXGQrJC87XG5cbmV4cG9ydHMuUkVHRVhfU1BBQ0UgPSAvXFxzLztcblxuZXhwb3J0cy5SRUdFWF9LRUJBQiA9IC8oW0EtWl0pKy9nO1xuXG5leHBvcnRzLklNUE9SVEFOVCA9ICdpbXBvcnRhbnQnO1xuXG5leHBvcnRzLlBPU1NJQkxFX1BSRUZJWEVTID0gWyd3ZWJraXQnLCAnbW96JywgJ21zJywgJ28nXTtcblxuZXhwb3J0cy5SRVFVSVJFU19VTklUX1ZBTFVFID0gWydiYWNrZ3JvdW5kLXBvc2l0aW9uLXgnLCAnYmFja2dyb3VuZC1wb3NpdGlvbi15JywgJ2Jsb2NrLXNpemUnLCAnYm9yZGVyLXdpZHRoJywgJ2NvbHVtblJ1bGUtd2lkdGgnLCAnY3gnLCAnY3knLCAnZm9udC1zaXplJywgJ2dyaWQtY29sdW1uLWdhcCcsICdncmlkLXJvdy1nYXAnLCAnaGVpZ2h0JywgJ2lubGluZS1zaXplJywgJ2xpbmUtaGVpZ2h0JywgJ21pbkJsb2NrLXNpemUnLCAnbWluLWhlaWdodCcsICdtaW4taW5saW5lLXNpemUnLCAnbWluLXdpZHRoJywgJ21heC1oZWlnaHQnLCAnbWF4LXdpZHRoJywgJ291dGxpbmUtb2Zmc2V0JywgJ291dGxpbmUtd2lkdGgnLCAncGVyc3BlY3RpdmUnLCAnc2hhcGUtbWFyZ2luJywgJ3N0cm9rZS1kYXNob2Zmc2V0JywgJ3N0cm9rZS13aWR0aCcsICd0ZXh0LWluZGVudCcsICd3aWR0aCcsICd3b3JkLXNwYWNpbmcnLCAndG9wJywgJ2JvdHRvbScsICdsZWZ0JywgJ3JpZ2h0JywgJ3gnLCAneSddO1xuXG5leHBvcnRzLlFVQURfU0hPUlRIQU5EUyA9IFsnbWFyZ2luJywgJ3BhZGRpbmcnLCAnYm9yZGVyJywgJ2JvcmRlci1yYWRpdXMnXTtcblxuZXhwb3J0cy5ESVJFQ1RJT05TID0gWyd0b3AnLCAnYm90dG9tJywgJ2xlZnQnLCAncmlnaHQnXTtcblxuZXhwb3J0cy5RVUFEX1NIT1JUSEFORFMuZm9yRWFjaChmdW5jdGlvbihwcm9wZXJ0eSkge1xuICB2YXIgZGlyZWN0aW9uLCBpLCBsZW4sIHJlZjtcbiAgZXhwb3J0cy5SRVFVSVJFU19VTklUX1ZBTFVFLnB1c2gocHJvcGVydHkpO1xuICByZWYgPSBleHBvcnRzLkRJUkVDVElPTlM7XG4gIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGRpcmVjdGlvbiA9IHJlZltpXTtcbiAgICBleHBvcnRzLlJFUVVJUkVTX1VOSVRfVkFMVUUucHVzaChwcm9wZXJ0eSArICctJyArIGRpcmVjdGlvbik7XG4gIH1cbn0pO1xuXG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0ltWnBiR1VpT2lJdUxpOXViMlJsWDIxdlpIVnNaWE12Y1hWcFkydGpjM012YzNKakwyTnZibk4wWVc1MGN5NWpiMlptWldVaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNlcxMTkiLCJjb25zdGFudHMgPSBpbXBvcnQgJy4vY29uc3RhbnRzJ1xuc2FtcGxlU3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKS5zdHlsZVxuXG5oZWxwZXJzID0gZXhwb3J0c1xuXG5oZWxwZXJzLmluY2x1ZGVzID0gKHRhcmdldCwgaXRlbSktPlxuXHR0YXJnZXQgYW5kIHRhcmdldC5pbmRleE9mKGl0ZW0pIGlzbnQgLTFcblxuaGVscGVycy5pc0l0ZXJhYmxlID0gKHRhcmdldCktPlxuXHR0YXJnZXQgYW5kXG5cdHR5cGVvZiB0YXJnZXQgaXMgJ29iamVjdCcgYW5kXG5cdHR5cGVvZiB0YXJnZXQubGVuZ3RoIGlzICdudW1iZXInIGFuZFxuXHRub3QgdGFyZ2V0Lm5vZGVUeXBlXG5cbmhlbHBlcnMudG9LZWJhYkNhc2UgPSAoc3RyaW5nKS0+XG5cdHN0cmluZy5yZXBsYWNlIGNvbnN0YW50cy5SRUdFWF9LRUJBQiwgKGUsbGV0dGVyKS0+IFwiLSN7bGV0dGVyLnRvTG93ZXJDYXNlKCl9XCJcblxuaGVscGVycy5pc1Byb3BTdXBwb3J0ZWQgPSAocHJvcGVydHkpLT5cblx0dHlwZW9mIHNhbXBsZVN0eWxlW3Byb3BlcnR5XSBpc250ICd1bmRlZmluZWQnXG5cbmhlbHBlcnMuaXNWYWx1ZVN1cHBvcnRlZCA9IChwcm9wZXJ0eSwgdmFsdWUpLT5cblx0aWYgd2luZG93LkNTUyBhbmQgd2luZG93LkNTUy5zdXBwb3J0c1xuXHRcdHJldHVybiB3aW5kb3cuQ1NTLnN1cHBvcnRzKHByb3BlcnR5LCB2YWx1ZSlcblx0ZWxzZVxuXHRcdHNhbXBsZVN0eWxlW3Byb3BlcnR5XSA9IHZhbHVlXG5cdFx0cmV0dXJuIHNhbXBsZVN0eWxlW3Byb3BlcnR5XSBpcyAnJyt2YWx1ZVxuXG5oZWxwZXJzLmdldFByZWZpeCA9IChwcm9wZXJ0eSwgc2tpcEluaXRpYWxDaGVjayktPlxuXHRpZiBza2lwSW5pdGlhbENoZWNrIG9yIG5vdCBoZWxwZXJzLmlzUHJvcFN1cHBvcnRlZChwcm9wZXJ0eSlcblx0XHRmb3IgcHJlZml4IGluIGNvbnN0YW50cy5QT1NTSUJMRV9QUkVGSVhFU1xuXHRcdFx0IyMjIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICMjI1xuXHRcdFx0cmV0dXJuIFwiLSN7cHJlZml4fS1cIiBpZiBoZWxwZXJzLmlzUHJvcFN1cHBvcnRlZChcIi0je3ByZWZpeH0tI3twcm9wZXJ0eX1cIilcblx0XG5cdHJldHVybiAnJ1xuXG5oZWxwZXJzLm5vcm1hbGl6ZVByb3BlcnR5ID0gKHByb3BlcnR5KS0+XHRcblx0cHJvcGVydHkgPSBoZWxwZXJzLnRvS2ViYWJDYXNlKHByb3BlcnR5KVxuXHRcblx0aWYgaGVscGVycy5pc1Byb3BTdXBwb3J0ZWQocHJvcGVydHkpXG5cdFx0cmV0dXJuIHByb3BlcnR5XG5cdGVsc2Vcblx0XHRyZXR1cm4gXCIje2hlbHBlcnMuZ2V0UHJlZml4KHByb3BlcnR5LHRydWUpfSN7cHJvcGVydHl9XCJcblxuaGVscGVycy5ub3JtYWxpemVWYWx1ZSA9IChwcm9wZXJ0eSwgdmFsdWUpLT5cblx0aWYgaGVscGVycy5pbmNsdWRlcyhjb25zdGFudHMuUkVRVUlSRVNfVU5JVF9WQUxVRSwgcHJvcGVydHkpIGFuZCB2YWx1ZSBpc250IG51bGxcblx0XHR2YWx1ZSA9ICcnK3ZhbHVlXG5cdFx0aWYgIGNvbnN0YW50cy5SRUdFWF9ESUdJVFMudGVzdCh2YWx1ZSkgYW5kXG5cdFx0XHRub3QgY29uc3RhbnRzLlJFR0VYX0xFTl9WQUwudGVzdCh2YWx1ZSkgYW5kXG5cdFx0XHRub3QgY29uc3RhbnRzLlJFR0VYX1NQQUNFLnRlc3QodmFsdWUpXG5cdFx0XHRcdHZhbHVlICs9IGlmIHByb3BlcnR5IGlzICdsaW5lLWhlaWdodCcgdGhlbiAnZW0nIGVsc2UgJ3B4J1xuXG5cdHJldHVybiB2YWx1ZVxuXG5cbmhlbHBlcnMuc29ydCA9IChhcnJheSktPlxuXHRpZiBhcnJheS5sZW5ndGggPCAyXG5cdFx0cmV0dXJuIGFycmF5XG5cdGVsc2Vcblx0XHRwaXZvdCA9IGFycmF5WzBdOyBsZXNzID0gW107IGdyZWF0ID0gW107IGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA9IDA7XG5cdFx0XG5cdFx0d2hpbGUgKytpIGlzbnQgbGVuXG5cdFx0XHRpZiBhcnJheVtpXSA8PSBwaXZvdFxuXHRcdFx0XHRsZXNzLnB1c2goYXJyYXlbaV0pXG5cdFx0XHRlbHNlXG5cdFx0XHRcdGdyZWF0LnB1c2goYXJyYXlbaV0pXG5cblx0XHRyZXR1cm4gaGVscGVycy5zb3J0KGxlc3MpLmNvbmNhdChwaXZvdCwgaGVscGVycy5zb3J0KGdyZWF0KSlcblxuXG5oZWxwZXJzLmhhc2ggPSAoc3RyaW5nKS0+XG5cdGhhc2ggPSA1MzgxOyBpID0gLTE7IGxlbmd0aCA9IHN0cmluZy5sZW5ndGhcblx0XG5cdHdoaWxlICsraSBpc250IHN0cmluZy5sZW5ndGhcblx0XHRoYXNoID0gKChoYXNoIDw8IDUpIC0gaGFzaCkgKyBzdHJpbmcuY2hhckNvZGVBdChpKVxuXHRcdGhhc2ggfD0gMFxuXG5cdHJldHVybiAnXycrKGlmIGhhc2ggPCAwIHRoZW4gaGFzaCAqIC0yIGVsc2UgaGFzaClcblxuXG5oZWxwZXJzLnJ1bGVUb1N0cmluZyA9IChydWxlLCBpbXBvcnRhbnQpLT5cblx0b3V0cHV0ID0gJydcblx0cHJvcHMgPSBoZWxwZXJzLnNvcnQoT2JqZWN0LmtleXMocnVsZSkpXG5cdFxuXHRmb3IgcHJvcCBpbiBwcm9wc1xuXHRcdGlmIHR5cGVvZiBydWxlW3Byb3BdIGlzICdzdHJpbmcnIG9yIHR5cGVvZiBydWxlW3Byb3BdIGlzICdudW1iZXInXG5cdFx0XHRwcm9wZXJ0eSA9IGhlbHBlcnMubm9ybWFsaXplUHJvcGVydHkocHJvcClcblx0XHRcdHZhbHVlID0gaGVscGVycy5ub3JtYWxpemVWYWx1ZShwcm9wZXJ0eSwgcnVsZVtwcm9wXSlcblx0XHRcdHZhbHVlICs9IFwiICFpbXBvcnRhbnRcIiBpZiBpbXBvcnRhbnRcblx0XHRcdG91dHB1dCArPSBcIiN7cHJvcGVydHl9OiN7dmFsdWV9O1wiXG5cdFxuXHRyZXR1cm4gb3V0cHV0XG5cbmhlbHBlcnMuaW5saW5lU3R5bGVDb25maWcgPSBzdHlsZUNvbmZpZyA9IE9iamVjdC5jcmVhdGUobnVsbClcbmhlbHBlcnMuaW5saW5lU3R5bGUgPSAocnVsZSwgdmFsdWVUb1N0b3JlLCBsZXZlbCktPlxuXHRpZiBub3QgY29uZmlnPXN0eWxlQ29uZmlnW2xldmVsXVxuXHRcdHN0eWxlRWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpXG5cdFx0c3R5bGVFbC5pZCA9IFwicXVpY2tjc3Mje2xldmVsIG9yICcnfVwiXG5cdFx0ZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzdHlsZUVsKVxuXHRcdHN0eWxlQ29uZmlnW2xldmVsXSA9IGNvbmZpZyA9IGVsOnN0eWxlRWwsIGNvbnRlbnQ6JycsIGNhY2hlOk9iamVjdC5jcmVhdGUobnVsbClcblx0XG5cdHVubGVzcyBjb25maWcuY2FjaGVbcnVsZV1cblx0XHRjb25maWcuY2FjaGVbcnVsZV0gPSB2YWx1ZVRvU3RvcmUgb3IgdHJ1ZVxuXHRcdGNvbmZpZy5lbC50ZXh0Q29udGVudCA9IGNvbmZpZy5jb250ZW50ICs9IHJ1bGVcblx0XG5cdHJldHVyblxuXG5cbmhlbHBlcnMuY2xlYXJJbmxpbmVTdHlsZSA9IChsZXZlbCktPiBpZiBjb25maWcgPSBzdHlsZUNvbmZpZ1tsZXZlbF1cblx0cmV0dXJuIGlmIG5vdCBjb25maWcuY29udGVudFxuXHRjb25maWcuZWwudGV4dENvbnRlbnQgPSBjb25maWcuY29udGVudCA9ICcnXG5cdGtleXMgPSBPYmplY3Qua2V5cyhjb25maWcuY2FjaGUpXG5cdGNvbmZpZy5jYWNoZVtrZXldID0gbnVsbCBmb3Iga2V5IGluIGtleXNcblx0cmV0dXJuXG5cblxuXG5cblxuIiwiJ3VzZSBzdHJpY3QnO1xuY29uc3QgcEZpbmFsbHkgPSByZXF1aXJlKCdwLWZpbmFsbHknKTtcblxuY2xhc3MgVGltZW91dEVycm9yIGV4dGVuZHMgRXJyb3Ige1xuXHRjb25zdHJ1Y3RvcihtZXNzYWdlKSB7XG5cdFx0c3VwZXIobWVzc2FnZSk7XG5cdFx0dGhpcy5uYW1lID0gJ1RpbWVvdXRFcnJvcic7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSAocHJvbWlzZSwgbXMsIGZhbGxiYWNrKSA9PiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdGlmICh0eXBlb2YgbXMgIT09ICdudW1iZXInICYmIG1zID49IDApIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdFeHBlY3RlZCBgbXNgIHRvIGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG5cdH1cblxuXHRjb25zdCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuXHRcdGlmICh0eXBlb2YgZmFsbGJhY2sgPT09ICdmdW5jdGlvbicpIHtcblx0XHRcdHJlc29sdmUoZmFsbGJhY2soKSk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0Y29uc3QgbWVzc2FnZSA9IHR5cGVvZiBmYWxsYmFjayA9PT0gJ3N0cmluZycgPyBmYWxsYmFjayA6IGBQcm9taXNlIHRpbWVkIG91dCBhZnRlciAke21zfSBtaWxsaXNlY29uZHNgO1xuXHRcdGNvbnN0IGVyciA9IGZhbGxiYWNrIGluc3RhbmNlb2YgRXJyb3IgPyBmYWxsYmFjayA6IG5ldyBUaW1lb3V0RXJyb3IobWVzc2FnZSk7XG5cblx0XHRyZWplY3QoZXJyKTtcblx0fSwgbXMpO1xuXG5cdHBGaW5hbGx5KFxuXHRcdHByb21pc2UudGhlbihyZXNvbHZlLCByZWplY3QpLFxuXHRcdCgpID0+IHtcblx0XHRcdGNsZWFyVGltZW91dCh0aW1lcik7XG5cdFx0fVxuXHQpO1xufSk7XG5cbm1vZHVsZS5leHBvcnRzLlRpbWVvdXRFcnJvciA9IFRpbWVvdXRFcnJvcjtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHR5cGUpIHtcbiAgdmFyIHR5cGVzXG4gIGlmICggdHlwZSAmJiAoJ3RyYW5zaXRpb24nID09PSB0eXBlIHx8ICd0cmFucycgPT09IHR5cGUpICkge1xuICAgIHR5cGVzID0ge1xuICAgICAgJ09UcmFuc2l0aW9uJzogICAgICAnb1RyYW5zaXRpb25FbmQnLFxuICAgICAgJ1dlYmtpdFRyYW5zaXRpb24nOiAnd2Via2l0VHJhbnNpdGlvbkVuZCcsXG4gICAgICAnTW96VHJhbnNpdGlvbic6ICAgICd0cmFuc2l0aW9uZW5kJyxcbiAgICAgICd0cmFuc2l0aW9uJzogICAgICAgJ3RyYW5zaXRpb25lbmQnXG4gICAgfVxuICB9XG4gIGVsc2UgeyAvLyBhbmltYXRpb24gaXMgZGVmYXVsdFxuICAgIHR5cGVzID0ge1xuICAgICAgJ09BbmltYXRpb24nOiAgICAgICdvQW5pbWF0aW9uRW5kJyxcbiAgICAgICdXZWJraXRBbmltYXRpb24nOiAnd2Via2l0QW5pbWF0aW9uRW5kJyxcbiAgICAgICdNb3pBbmltYXRpb24nOiAgICAnYW5pbWF0aW9uZW5kJyxcbiAgICAgICdhbmltYXRpb24nOiAgICAgICAnYW5pbWF0aW9uZW5kJ1xuICAgIH1cbiAgfVxuICB2YXIgZWxlbSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2Zha2UnKVxuICByZXR1cm4gT2JqZWN0LmtleXModHlwZXMpLnJlZHVjZShmdW5jdGlvbiAocHJldiwgdHJhbnMpIHtcbiAgICByZXR1cm4gdW5kZWZpbmVkICE9PSBlbGVtLnN0eWxlW3RyYW5zXT8gdHlwZXNbdHJhbnNdOiBwcmV2XG4gIH0sICcnKVxufVxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSXVMaTl1YjJSbFgyMXZaSFZzWlhNdlpHVjBaV04wTFdGdWFXMWhkR2x2YmkxbGJtUXRhR1ZzY0dWeUwybHVaR1Y0TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sdGRmUT09IiwidmFyIGV4cG9ydHM7XG5cbm1vZHVsZS5leHBvcnRzID0gZXhwb3J0cyA9IHtcbiAgZGVmaW5lZDogZnVuY3Rpb24oc3ViamVjdCkge1xuICAgIHJldHVybiBzdWJqZWN0ICE9PSB2b2lkIDA7XG4gIH0sXG4gIGFycmF5OiBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgcmV0dXJuIHN1YmplY3QgaW5zdGFuY2VvZiBBcnJheTtcbiAgfSxcbiAgb2JqZWN0OiBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzdWJqZWN0ID09PSAnb2JqZWN0JyAmJiBzdWJqZWN0O1xuICB9LFxuICBvYmplY3RQbGFpbjogZnVuY3Rpb24oc3ViamVjdCkge1xuICAgIHJldHVybiBleHBvcnRzLm9iamVjdChzdWJqZWN0KSAmJiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3ViamVjdCkgPT09ICdbb2JqZWN0IE9iamVjdF0nICYmIHN1YmplY3QuY29uc3RydWN0b3IgPT09IE9iamVjdDtcbiAgfSxcbiAgc3RyaW5nOiBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzdWJqZWN0ID09PSAnc3RyaW5nJztcbiAgfSxcbiAgbnVtYmVyOiBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgcmV0dXJuIHR5cGVvZiBzdWJqZWN0ID09PSAnbnVtYmVyJyAmJiAhaXNOYU4oc3ViamVjdCk7XG4gIH0sXG4gIG51bWJlckxvb3NlOiBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgcmV0dXJuIGV4cG9ydHMubnVtYmVyKHN1YmplY3QpIHx8IGV4cG9ydHMuc3RyaW5nKHN1YmplY3QpICYmIGV4cG9ydHMubnVtYmVyKE51bWJlcihzdWJqZWN0KSk7XG4gIH0sXG4gIFwiZnVuY3Rpb25cIjogZnVuY3Rpb24oc3ViamVjdCkge1xuICAgIHJldHVybiB0eXBlb2Ygc3ViamVjdCA9PT0gJ2Z1bmN0aW9uJztcbiAgfSxcbiAgaXRlcmFibGU6IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgICByZXR1cm4gZXhwb3J0cy5vYmplY3Qoc3ViamVjdCkgJiYgZXhwb3J0cy5udW1iZXIoc3ViamVjdC5sZW5ndGgpO1xuICB9XG59O1xuXG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0ltWnBiR1VpT2lJdUxpOXViMlJsWDIxdlpIVnNaWE12UUdSaGJtbGxiR3RoYkdWdUwybHpMM055WXk5dVlYUnBkbVZ6TG1OdlptWmxaU0lzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiWFgwPSIsInZhciBleHBvcnRzO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGV4cG9ydHMgPSB7XG4gIGRvbURvYzogZnVuY3Rpb24oc3ViamVjdCkge1xuICAgIHJldHVybiBzdWJqZWN0ICYmIHN1YmplY3Qubm9kZVR5cGUgPT09IDk7XG4gIH0sXG4gIGRvbUVsOiBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgcmV0dXJuIHN1YmplY3QgJiYgc3ViamVjdC5ub2RlVHlwZSA9PT0gMTtcbiAgfSxcbiAgZG9tVGV4dDogZnVuY3Rpb24oc3ViamVjdCkge1xuICAgIHJldHVybiBzdWJqZWN0ICYmIHN1YmplY3Qubm9kZVR5cGUgPT09IDM7XG4gIH0sXG4gIGRvbU5vZGU6IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgICByZXR1cm4gZXhwb3J0cy5kb21FbChzdWJqZWN0KSB8fCBleHBvcnRzLmRvbVRleHQoc3ViamVjdCk7XG4gIH0sXG4gIGRvbVRleHRhcmVhOiBmdW5jdGlvbihzdWJqZWN0KSB7XG4gICAgcmV0dXJuIHN1YmplY3QgJiYgc3ViamVjdC5ub2RlTmFtZSA9PT0gJ1RFWFRBUkVBJztcbiAgfSxcbiAgZG9tSW5wdXQ6IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgICByZXR1cm4gc3ViamVjdCAmJiBzdWJqZWN0Lm5vZGVOYW1lID09PSAnSU5QVVQnO1xuICB9LFxuICBkb21TZWxlY3Q6IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgICByZXR1cm4gc3ViamVjdCAmJiBzdWJqZWN0Lm5vZGVOYW1lID09PSAnU0VMRUNUJztcbiAgfSxcbiAgZG9tRmllbGQ6IGZ1bmN0aW9uKHN1YmplY3QpIHtcbiAgICByZXR1cm4gZXhwb3J0cy5kb21JbnB1dChzdWJqZWN0KSB8fCBleHBvcnRzLmRvbVRleHRhcmVhKHN1YmplY3QpIHx8IGV4cG9ydHMuZG9tU2VsZWN0KHN1YmplY3QpO1xuICB9XG59O1xuXG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYlhTd2libUZ0WlhNaU9sdGRMQ0p0WVhCd2FXNW5jeUk2SWlJc0ltWnBiR1VpT2lJdUxpOXViMlJsWDIxdlpIVnNaWE12UUdSaGJtbGxiR3RoYkdWdUwybHpMM055WXk5a2IyMHVZMjltWm1WbElpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sdGRmUT09IiwidmFyIFN0YXRlQ2hhaW47XG5cbm1vZHVsZS5leHBvcnRzID0gU3RhdGVDaGFpbiA9IChmdW5jdGlvbigpIHtcbiAgZnVuY3Rpb24gU3RhdGVDaGFpbihzdGF0ZXMpIHtcbiAgICB0aGlzLnN0cmluZyA9IHN0YXRlcy5qb2luKCcrJyk7XG4gICAgdGhpcy5hcnJheSA9IHN0YXRlcy5zbGljZSgpO1xuICAgIHRoaXMubGVuZ3RoID0gc3RhdGVzLmxlbmd0aDtcbiAgfVxuXG4gIFN0YXRlQ2hhaW4ucHJvdG90eXBlLmluY2x1ZGVzID0gZnVuY3Rpb24odGFyZ2V0KSB7XG4gICAgdmFyIGksIGxlbiwgcmVmLCBzdGF0ZTtcbiAgICByZWYgPSB0aGlzLmFycmF5O1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlZi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgc3RhdGUgPSByZWZbaV07XG4gICAgICBpZiAoc3RhdGUgPT09IHRhcmdldCkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9O1xuXG4gIFN0YXRlQ2hhaW4ucHJvdG90eXBlLndpdGhvdXQgPSBmdW5jdGlvbih0YXJnZXQpIHtcbiAgICByZXR1cm4gdGhpcy5hcnJheS5maWx0ZXIoZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgIHJldHVybiBzdGF0ZSAhPT0gdGFyZ2V0O1xuICAgIH0pLmpvaW4oJysnKTtcbiAgfTtcblxuICBTdGF0ZUNoYWluLnByb3RvdHlwZS5pc0FwcGxpY2FibGUgPSBmdW5jdGlvbih0YXJnZXQsIG90aGVyQWN0aXZlKSB7XG4gICAgdmFyIGFjdGl2ZTtcbiAgICBhY3RpdmUgPSB0aGlzLmFycmF5LmZpbHRlcihmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgcmV0dXJuIHN0YXRlID09PSB0YXJnZXQgfHwgb3RoZXJBY3RpdmUuaW5kZXhPZihzdGF0ZSkgIT09IC0xO1xuICAgIH0pO1xuICAgIHJldHVybiBhY3RpdmUubGVuZ3RoID09PSB0aGlzLmFycmF5Lmxlbmd0aDtcbiAgfTtcblxuICByZXR1cm4gU3RhdGVDaGFpbjtcblxufSkoKTtcblxuXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSXVMaTl1YjJSbFgyMXZaSFZzWlhNdmNYVnBZMnRrYjIwdmMzSmpMM0JoY25SekwyVnNaVzFsYm5RdmMzUmhkR1ZEYUdGcGJpNWpiMlptWldVaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNlcxMTkiLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHByb21pc2UsIG9uRmluYWxseSkge1xuXHRvbkZpbmFsbHkgPSBvbkZpbmFsbHkgfHwgZnVuY3Rpb24gKCkge307XG5cblx0cmV0dXJuIHByb21pc2UudGhlbihmdW5jdGlvbiAodmFsKSB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlKSB7XG5cdFx0XHRyZXNvbHZlKG9uRmluYWxseSgpKTtcblx0XHR9KS50aGVuKGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiB2YWw7XG5cdFx0fSk7XG5cdH0sIGZ1bmN0aW9uIChlcnIpIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24gKHJlc29sdmUpIHtcblx0XHRcdHJlc29sdmUob25GaW5hbGx5KCkpO1xuXHRcdH0pLnRoZW4oZnVuY3Rpb24gKCkge1xuXHRcdFx0dGhyb3cgZXJyO1xuXHRcdH0pO1xuXHR9KTtcbn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklpSXNJbVpwYkdVaU9pSXVMaTl1YjJSbFgyMXZaSFZzWlhNdmNDMW1hVzVoYkd4NUwybHVaR1Y0TG1weklpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sdGRmUT09Il19