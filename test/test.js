(function (require, global) {
require = (function (cache, modules, cx) {
return function (r) {
if (!modules[r]) throw new Error(r + ' is not a module');
return cache[r] ? cache[r].exports : ((cache[r] = {
exports: {}
}, cache[r].exports = modules[r].call(cx, require, cache[r], cache[r].exports)));
};
})({}, {
0: function (require, module, exports) {
var assert, chai, expect, helpers;
this.Popup = window.quickpopup;
this.DOM = require(1);
helpers = require(2);
chai = require(3);
chai.use(require(4));
chai.use(require(5));
chai.use(require(6));
chai.use(require(7));
chai.use(require(8));
mocha.setup('tdd');
mocha.slow(400);
mocha.timeout(6000);
if (!window.__karma__) {
mocha.bail();
}
expect = chai.expect;
assert = chai.assert;
this.sandbox = null;
suite("QuickPopup", function () {
setup(helpers.restartSandbox);
teardown(Popup.destroyAll);
test("Version Property", function () {
var packageVersion;
packageVersion = "1.0.0";
return expect(Popup.version).to.equal(packageVersion);
});
suite("instance", function () {
test("should be an event emitter", function () {
var popup;
popup = Popup();
assert.equal(typeof popup.on, 'function');
assert.equal(typeof popup.off, 'function');
assert.equal(typeof popup.emit, 'function');
Promise.delay().then(function () {
return popup.emit('someEvent');
});
return expect(popup).to.emit('someEvent');
});
return suite("args", function () {
test("using no args", function () {
var popup;
popup = Popup();
popup = new Popup();
assert(!(popup instanceof Popup));
assert.equal(typeof popup, 'object');
assert.equal(typeof popup.open, 'function');
return assert.equal(popup.el.text, '');
});
test("with string arg", function () {
var popup;
popup = Popup('provided string');
return assert.equal(popup.el.text, 'provided string');
});
test("with html string arg", function () {
var contents, popup;
popup = Popup('<b class="theBoldOne">provided string</b><i class="theSlantedOne"> is slanted</b>');
assert.equal(popup.el.text, 'provided string is slanted');
contents = popup.el.child.content.lastChild.children;
assert.equal(contents.length, 2);
assert.equal(contents[0].type, 'b');
assert.equal(contents[1].type, 'i');
assert.equal(contents[0].raw.className, 'theBoldOne');
return assert.equal(contents[1].raw.className, 'theSlantedOne');
});
test("with DOM element arg", function () {
var contents, div, popup, span;
span = DOM.span({
"class": 'abc123-child'
}, 'provided el');
div = DOM.div({
"class": 'abc123'
}, span);
popup = Popup(div.raw);
assert.equal(popup.el.text, 'provided el');
contents = popup.el.child.content.children;
assert.equal(contents.length, 1);
assert.equal(contents[0].type, 'div');
assert.equal(contents[0].raw.className, 'abc123');
assert.equal(contents[0], div);
return assert.equal(contents[0].children[0], span);
});
test("with QuickDOM element arg", function () {
var contents, div, popup, span;
span = DOM.span({
"class": 'abc123-child'
}, 'provided el');
div = DOM.div({
"class": 'abc123'
}, span);
popup = Popup(div);
assert.equal(popup.el.text, 'provided el');
contents = popup.el.child.content.children;
assert.equal(contents.length, 1);
assert.equal(contents[0].type, 'div');
assert.equal(contents[0].raw.className, 'abc123');
assert.equal(contents[0], div);
return assert.equal(contents[0].children[0], span);
});
return test("with settings arg", function () {
var popupA, popupB;
popupA = Popup({});
popupB = Popup({
placement: 'bottom'
});
assert.equal(popupA.settings.placement, 'center');
return assert.equal(popupB.settings.placement, 'bottom');
});
});
});
suite("behavior", function () {
test("should create a wrapper element around body contents", function () {
var bodyChildren, popup;
assert.equal(typeof DOM.query('#bodyWrapper'), 'undefined');
bodyChildren = DOM(document.body).children.slice();
popup = Popup();
assert.equal(typeof DOM.query('#bodyWrapper'), 'object');
assert.equal(DOM.query('#bodyWrapper').parent, DOM(document.body));
assert.equal(DOM(document.body).children.length, 2);
assert.equal(DOM.query('#bodyWrapper').children.length, bodyChildren.length);
Popup.unwrapBody();
assert.equal(typeof DOM.query('#bodyWrapper'), 'undefined');
assert.equal(DOM(document.body).children.length, bodyChildren.length + 1);
popup.destroy();
assert.equal(DOM(document.body).children.length, bodyChildren.length);
popup = Popup();
assert.equal(DOM(document.body).children.length, 2);
return assert.equal(DOM.query('#bodyWrapper').children.length, bodyChildren.length);
});
return test("Popup.config() will return a new constructor with customized setting defaults & templates", function () {
var Popup2;
Popup2 = Popup.config({
animation: 100
});
assert.notEqual(Popup2, Popup);
assert.equal(Popup2.defaults.animation, 100);
assert.notEqual(Popup.defaults.animation, 100);
Popup();
return Popup2();
});
});
return suite("open/close", function () {
suiteSetup(function () {
return this.Popup = Popup.config({
animation: 50
});
});
test("will return promises that resolve when animation ends", function () {
var content, openPromise, openTime, popup, startTime;
content = DOM.div(null, 'abc123');
popup = this.Popup(content);
startTime = Date.now();
openTime = null;
assert.equal(popup.state.open, false);
openPromise = popup.open();
assert.ok(openPromise instanceof Promise);
assert.ok(openPromise.isPending());
return Promise.bind(this).then(function () {
return openPromise;
}).then(function () {
openTime = Date.now();
assert.isAtLeast(openTime - startTime, this.Popup.defaults.animation / 2);
return assert.equal(popup.state.open, true);
}).then(function () {
return popup.close();
}).then(function () {
assert.isAtLeast(Date.now() - openTime, this.Popup.defaults.animation / 2);
return assert.equal(popup.state.open, false);
});
});
test("will emit events before/present/finish for open/close", function () {
var count, events, popup;
popup = this.Popup();
events = ['beforeopen', 'open', 'finishopen', 'beforeclose', 'close', 'finishclose'];
count = {};
events.forEach(function (event) {
count[event] = 0;
return popup.on(event, function () {
return count[event]++;
});
});
return Promise.resolve().then(function () {
return assert.deepEqual(count, {
beforeopen: 0,
open: 0,
finishopen: 0,
beforeclose: 0,
close: 0,
finishclose: 0
});
}).then(function () {
return popup.open();
}).then(function () {
return assert.deepEqual(count, {
beforeopen: 1,
open: 1,
finishopen: 1,
beforeclose: 0,
close: 0,
finishclose: 0
});
}).then(function () {
return popup.close();
}).then(function () {
return assert.deepEqual(count, {
beforeopen: 1,
open: 1,
finishopen: 1,
beforeclose: 1,
close: 1,
finishclose: 1
});
});
});
test("will fail to open if another popup is open", function () {
var popupA, popupB;
popupA = this.Popup();
popupB = this.Popup();
return Promise.resolve().then(function () {
assert.equal(popupA.state.open, false);
return assert.equal(popupB.state.open, false);
}).then(function () {
return popupA.open();
}).then(function () {
assert.equal(popupA.state.open, true);
return assert.equal(popupB.state.open, false);
}).then(function () {
return popupB.open();
}).then(function () {
assert.equal(popupA.state.open, true);
return assert.equal(popupB.state.open, false);
});
});
return test("will close all other open popups and will force open when options.forceOpen", function () {
var popupA, popupB;
popupA = this.Popup();
popupB = this.Popup({
forceOpen: true
});
return Promise.resolve().then(function () {
assert.equal(popupA.state.open, false);
return assert.equal(popupB.state.open, false);
}).then(function () {
return popupA.open();
}).then(function () {
assert.equal(popupA.state.open, true);
return assert.equal(popupB.state.open, false);
}).then(function () {
return popupB.open();
}).then(function () {
assert.equal(popupA.state.open, false);
return assert.equal(popupB.state.open, true);
}).then(function () {
return popupA.open();
}).then(function () {
assert.equal(popupA.state.open, false);
return assert.equal(popupB.state.open, true);
});
});
});
});
return module.exports;
},
1: function (require, module, exports) {
var QuickDom, svgNamespace;
svgNamespace = 'http://www.w3.org/2000/svg';
var CSS = require(10);
var extend = require(11);
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
IS = require(32);
IS = IS.create('natives', 'dom');
IS.load({
quickDomEl: function (subject) {
return subject && subject.constructor.name === QuickElement.name;
},
template: function (subject) {
return subject && subject.constructor.name === QuickTemplate.name;
}
});
;
var QuickElement;
QuickElement = (function () {
function QuickElement(type, options) {
this.type = type;
this.options = options;
if (this.type[0] === '*') {
this.svg = true;
}
this.el = this.options.existing || (this.type === 'text' ? document.createTextNode(typeof this.options.text === 'string' ? this.options.text : '') : this.svg ? document.createElementNS(svgNamespace, this.type.slice(1)) : document.createElement(this.type));
if (this.type === 'text') {
this.append = this.prepend = this.attr = function () {};
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
QuickElement.prototype.toJSON = function () {
var child, children, i, len, output;
output = [this.type, extend.clone.keys(allowedOptions)(this.options)];
children = this.children;
for ((i = 0, len = children.length); i < len; i++) {
child = children[i];
output.push(child.toJSON());
}
return output;
};
return QuickElement;
})();
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
QuickElement.prototype._normalizeOptions = function () {
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
QuickElement.prototype._parseStyles = function (styles, store) {
var _mediaStates, _providedStates, _providedStatesShared, _stateShared, _styles, base, flattenNestedStates, forceStyle, i, keys, len, specialStates, state, stateStyles, state_, states;
if (!IS.objectPlain(styles)) {
return;
}
keys = Object.keys(styles);
states = keys.filter(function (key) {
return helpers.isStateStyle(key);
});
specialStates = helpers.removeItem(states.slice(), '$base');
_mediaStates = states.filter(function (key) {
return key[0] === '@';
}).map(function (state) {
return state.slice(1);
});
_providedStates = states.map(function (state) {
return state.slice(1);
});
_styles = store || ({});
_stateShared = _providedStatesShared = void 0;
base = !helpers.includes(states, '$base') ? styles : styles.$base;
_styles.base = helpers.registerStyle(base, 0, forceStyle = this.options.forceStyle);
if (specialStates.length) {
flattenNestedStates = function (styleObject, chain, level) {
var hasNonStateProps, i, len, output, state, stateChain, state_, styleKeys;
styleKeys = Object.keys(styleObject);
output = {};
hasNonStateProps = false;
for ((i = 0, len = styleKeys.length); i < len; i++) {
state = styleKeys[i];
if (!helpers.isStateStyle(state)) {
hasNonStateProps = true;
output[state] = styleObject[state];
} else {
chain.push(state_ = state.slice(1));
stateChain = new (require(56))(chain);
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
for ((i = 0, len = specialStates.length); i < len; i++) {
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
QuickElement.prototype._parseTexts = function (texts, store) {
var _providedStates, _texts, i, len, state, states;
if (!IS.objectPlain(texts)) {
return;
}
states = Object.keys(texts).map(function (state) {
return state.slice(1);
});
_providedStates = states.filter(function (state) {
return state !== 'base';
});
_texts = store || ({});
_texts = {
base: ''
};
for ((i = 0, len = states.length); i < len; i++) {
state = states[i];
_texts[state] = texts['$' + state];
}
return {
_texts: _texts,
_providedStates: _providedStates
};
};
QuickElement.prototype._applyOptions = function () {
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
this.on('inserted', function () {
var _, mediaStates;
if (this.options.styleAfterInsert) {
this.recalcStyle();
}
_ = this._inserted = this;
if ((mediaStates = this._mediaStates) && this._mediaStates.length) {
return this._mediaStates = new (function () {
var i, len, queryString;
for ((i = 0, len = mediaStates.length); i < len; i++) {
queryString = mediaStates[i];
this[queryString] = MediaQuery.register(_, queryString);
}
return this;
})();
}
}, false, true);
if (this.options.recalcOnResize) {
window.addEventListener('resize', (function (_this) {
return function () {
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
QuickElement.prototype._attachStateEvents = function (force) {
var fn, ref1, state, trigger;
ref1 = this.options.stateTriggers;
fn = (function (_this) {
return function (state, trigger) {
var disabler, enabler;
if (!helpers.includes(_this._providedStates, state) && !force && !trigger.force) {
return;
}
enabler = IS.string(trigger) ? trigger : trigger.on;
if (IS.object(trigger)) {
disabler = trigger.off;
}
_this._listenTo(enabler, function () {
return _this.state(state, true, trigger.bubbles);
});
if (disabler) {
return _this._listenTo(disabler, function () {
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
QuickElement.prototype._proxyParent = function () {
var parent;
parent = void 0;
return Object.defineProperty(this, '_parent', {
get: function () {
return parent;
},
set: function (newParent) {
var lastParent;
if (parent = newParent) {
lastParent = this.parents.slice(-1)[0];
if (lastParent.raw === document.documentElement) {
this._unproxyParent(newParent);
} else {
parent.on('inserted', (function (_this) {
return function () {
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
QuickElement.prototype._unproxyParent = function (newParent) {
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
QuickDom = function () {
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
options = args[1] || ({});
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
for ((j = 0, len = children.length); j < len; j++) {
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
QuickDom.template = function (tree) {
return new QuickTemplate(tree, true);
};
QuickDom.html = function (innerHTML) {
var children, container;
container = document.createElement('div');
container.innerHTML = innerHTML;
children = Array.prototype.slice.call(container.childNodes);
return QuickDom.batch(children);
};
QuickDom.query = function (target) {
return QuickDom(document).query(target);
};
QuickDom.queryAll = function (target) {
return QuickDom(document).queryAll(target);
};
QuickDom.isTemplate = function (target) {
return IS.template(target);
};
QuickDom.isQuickEl = function (target) {
return IS.quickDomEl(target);
};
QuickDom.isEl = function (target) {
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
var QuickTemplate, slice = [].slice;
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
QuickTemplate = (function () {
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
for ((i = 0, len = ref.length); i < len; i++) {
child = ref[i];
if (!(child._hasComputers || child.options.computers)) {
continue;
}
this._hasComputers = true;
break;
}
}
}
QuickTemplate.prototype.extend = function (newValues, globalOpts) {
return new QuickTemplate(extendTemplate(this, newValues, globalOpts));
};
QuickTemplate.prototype.spawn = function (newValues, globalOpts) {
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
if (QuickTemplate.name == null) {
QuickTemplate.name = 'QuickTemplate';
}
Object.defineProperty(QuickTemplate.prototype, 'child', {
get: function () {
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
return module.exports;
},
2: function (require, module, exports) {
var detectAnimation;
detectAnimation = require(22);
exports.supportsAnimation = function () {
return !!detectAnimation();
};
exports.transitionEnd = function () {
return detectAnimation('transition');
};
exports.restartSandbox = function () {
if (window.sandbox) {
window.sandbox.remove();
}
window.sandbox = DOM.div({
id: 'sandbox',
style: {
border: '1px solid',
padding: 20,
boxSizing: 'border-box'
}
});
return window.sandbox.appendTo(document.body);
};
return module.exports;
},
3: function (require, module, exports) {
module.exports = require(23);
return module.exports;
},
4: function (require, module, exports) {
((function (chaiDom) {
if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
module.exports = chaiDom;
} else if (typeof define === 'function' && define.amd) {
define(function () {
return chaiDom;
});
} else {
chai.use(chaiDom);
}
})(function (chai, utils) {
var flag = utils.flag, elToString = function (el) {
var desc;
if (el instanceof window.NodeList) {
if (el.length === 0) return 'empty NodeList';
desc = Array.prototype.slice.call(el, 0, 5).map(elToString).join(', ');
return el.length > 5 ? desc + '... (+' + (el.length - 5) + ' more)' : desc;
}
if (!(el instanceof window.HTMLElement)) {
return String(el);
}
desc = el.tagName.toLowerCase();
if (el.id) {
desc += '#' + el.id;
}
if (el.className) {
desc += '.' + String(el.className).replace(/\s+/g, '.');
}
Array.prototype.forEach.call(el.attributes, function (attr) {
if (attr.name !== 'class' && attr.name !== 'id') {
desc += '[' + attr.name + (attr.value ? '="' + attr.value + '"]' : ']');
}
});
return desc;
}, attrAssert = function (name, val) {
var el = flag(this, 'object'), actual = el.getAttribute(name);
if (!flag(this, 'negate') || undefined === val) {
this.assert(!!el.attributes[name], 'expected ' + elToString(el) + ' to have an attribute #{exp}', 'expected ' + elToString(el) + ' not to have an attribute #{exp}', name);
}
if (undefined !== val) {
this.assert(val === actual, 'expected ' + elToString(el) + ' to have an attribute ' + utils.inspect(name) + ' with the value #{exp}, but the value was #{act}', 'expected ' + elToString(el) + ' not to have an attribute ' + utils.inspect(name) + ' with the value #{act}', val, actual);
}
flag(this, 'object', actual);
};
utils.elToString = elToString;
chai.Assertion.addMethod('attr', attrAssert);
chai.Assertion.addMethod('attribute', attrAssert);
chai.Assertion.addMethod('class', function (className) {
var el = flag(this, 'object');
this.assert(el.classList.contains(className), 'expected ' + elToString(el) + ' to have class #{exp}', 'expected ' + elToString(el) + ' not to have class #{exp}', className);
});
chai.Assertion.addMethod('id', function (id) {
var el = flag(this, 'object');
this.assert(el.id == id, 'expected ' + elToString(el) + ' to have id #{exp}', 'expected ' + elToString(el) + ' not to have id #{exp}', id);
});
chai.Assertion.addMethod('html', function (html) {
var el = flag(this, 'object'), actual = flag(this, 'object').innerHTML;
if (flag(this, 'contains')) {
this.assert(actual.indexOf(html) >= 0, 'expected #{act} to contain HTML #{exp}', 'expected #{act} not to contain HTML #{exp}', html, actual);
} else {
this.assert(actual === html, 'expected ' + elToString(el) + ' to have HTML #{exp}, but the HTML was #{act}', 'expected ' + elToString(el) + ' not to have HTML #{exp}', html, actual);
}
});
chai.Assertion.addMethod('text', function (text) {
var obj = flag(this, 'object'), contains = flag(this, 'contains'), actual, result;
if (obj instanceof window.NodeList) {
actual = Array.prototype.map.call(obj, function (el) {
return el.textContent;
});
if (Array.isArray(text)) {
result = contains ? text[flag(this, 'negate') ? 'some' : 'every'](function (t) {
return Array.prototype.some.call(obj, function (el) {
return el.textContent === t;
});
}) : utils.eql(actual, text);
actual = actual.join();
text = text.join();
} else {
actual = actual.join('');
result = contains ? actual.indexOf(text) >= 0 : actual === text;
}
} else {
actual = flag(this, 'object').textContent;
result = contains ? actual.indexOf(text) >= 0 : actual === text;
}
var objDesc = elToString(obj);
if (contains) {
this.assert(result, 'expected ' + objDesc + ' to contain #{exp}, but the text was #{act}', 'expected ' + objDesc + ' not to contain #{exp}, but the text was #{act}', text, actual);
} else {
this.assert(result, 'expected ' + objDesc + ' to have text #{exp}, but the text was #{act}', 'expected ' + objDesc + ' not to have text #{exp}', text, actual);
}
});
chai.Assertion.addMethod('value', function (value) {
var el = flag(this, 'object'), actual = flag(this, 'object').value;
this.assert(flag(this, 'object').value === value, 'expected ' + elToString(el) + ' to have value #{exp}, but the value was #{act}', 'expected ' + elToString(el) + ' not to have value #{exp}', value, actual);
});
chai.Assertion.overwriteProperty('exist', function (_super) {
return function () {
var obj = flag(this, 'object');
if (obj instanceof window.NodeList) {
this.assert(obj.length > 0, 'expected an empty NodeList to have nodes', 'expected ' + elToString(obj) + ' to not exist');
} else {
_super.apply(this, arguments);
}
};
});
chai.Assertion.overwriteProperty('empty', function (_super) {
return function () {
var obj = flag(this, 'object');
if (obj instanceof window.HTMLElement) {
this.assert(obj.children.length === 0, 'expected ' + elToString(obj) + ' to be empty', 'expected ' + elToString(obj) + ' to not be empty');
} else if (obj instanceof window.NodeList) {
this.assert(obj.length === 0, 'expected ' + elToString(obj) + ' to be empty', 'expected ' + elToString(obj) + ' to not be empty');
} else {
_super.apply(this, arguments);
}
};
});
chai.Assertion.overwriteChainableMethod('length', function (_super) {
return function (length) {
var obj = flag(this, 'object');
if (obj instanceof window.NodeList || obj instanceof window.HTMLElement) {
var actualLength = obj.children ? obj.children.length : obj.length;
this.assert(actualLength === length, 'expected ' + elToString(obj) + ' to have #{exp} children but it had #{act} children', 'expected ' + elToString(obj) + ' to not have #{exp} children', length, actualLength);
} else {
_super.apply(this, arguments);
}
};
}, function (_super) {
return function () {
_super.call(this);
};
});
chai.Assertion.overwriteMethod('match', function (_super) {
return function (selector) {
var obj = flag(this, 'object');
if (obj instanceof window.HTMLElement) {
this.assert(obj.matches(selector), 'expected ' + elToString(obj) + ' to match #{exp}', 'expected ' + elToString(obj) + ' to not match #{exp}', selector);
} else if (obj instanceof window.NodeList) {
this.assert((!!obj.length && Array.prototype.every.call(obj, function (el) {
return el.matches(selector);
})), 'expected ' + elToString(obj) + ' to match #{exp}', 'expected ' + elToString(obj) + ' to not match #{exp}', selector);
} else {
_super.apply(this, arguments);
}
};
});
chai.Assertion.overwriteChainableMethod('contain', function (_super) {
return function (subitem) {
var obj = flag(this, 'object');
if (obj instanceof window.HTMLElement) {
if (typeof subitem === 'string') {
this.assert(!!obj.querySelector(subitem), 'expected ' + elToString(obj) + ' to contain #{exp}', 'expected ' + elToString(obj) + ' to not contain #{exp}', subitem);
} else {
this.assert(obj.contains(subitem), 'expected ' + elToString(obj) + ' to contain ' + elToString(subitem), 'expected ' + elToString(obj) + ' to not contain ' + elToString(subitem));
}
} else {
_super.apply(this, arguments);
}
};
}, function (_super) {
return function () {
_super.call(this);
};
});
chai.Assertion.addProperty('displayed', function () {
var el = flag(this, 'object'), actual = document.body.contains(el) ? window.getComputedStyle(el).display : el.style.display;
this.assert(actual !== 'none', 'expected ' + elToString(el) + ' to be displayed, but it was not', 'expected ' + elToString(el) + ' to not be displayed, but it was as ' + actual, actual);
});
}));
return module.exports;
},
5: function (require, module, exports) {
module.exports = chaiStyle;
function chaiStyle(chai, utils) {
const {Assertion} = chai;
const {flag} = utils;
Assertion.addMethod('style', function (property, value = '') {
const element = flag(this, 'object');
const style = window.getComputedStyle(element);
value = value.trim();
const isNonColors = style[property] === 'rgba(0, 0, 0, 0)' || style[property] === 'transparent';
const propertyValue = isNonColors ? '' : style[property];
const assertion = value ? compareCSSValue(propertyValue, value) : Boolean(propertyValue);
const elementTag = element.tagName.toLowerCase();
const throwMessage = `expect ${elementTag} to have {${property}: ${value}}, is receiving {${property}: ${propertyValue}}`;
const throwMessageNegative = `expect ${elementTag} to not have {${property}: ${value}}, is receiving {${property}: ${propertyValue}}`;
this.assert(assertion, throwMessage, throwMessageNegative, value);
function compareCSSValue(computed, expected) {
const propertyHifenCase = property.replace(/[A-Z]/g, match => '-' + match.toLowerCase());
const fake = document.createElement('div');
fake.style.fontSize = style.fontSize;
fake.style.setProperty(propertyHifenCase, expected, 'important');
const iframe = document.createElement('iframe');
iframe.style.visibility = 'hidden';
document.body.appendChild(iframe);
iframe.appendChild(fake);
const fakeStyle = window.getComputedStyle(fake);
const value = fakeStyle[property];
const hasAutoValue = value.includes('auto');
const reg = new RegExp(escapeRegExp(value).replace(/auto/g, '(\\d+(.\\d+)?px|auto)'));
return hasAutoValue ? reg.test(computed) : computed === value;
}
});
}
function escapeRegExp(value) {
return String(value).replace(/[\\^$*+?.()|[\]{}]/g, '\\$&');
}
return module.exports;
},
6: function (require, module, exports) {
'use strict';
var deepEqual = require(24);
var type = require(25);
var DEFAULT_TOLERANCE = 1e-6;
function isNumber(val) {
return type(val) === 'number';
}
function bothNumbers(left, right) {
return isNumber(right) && isNumber(left);
}
function almostEqual(left, right, tol) {
return Math.abs(left - right) <= tol;
}
function comparator(tolerance) {
return function (left, right) {
if (bothNumbers(left, right)) {
return almostEqual(left, right, tolerance);
}
return null;
};
}
function chaiAlmost(customTolerance) {
var standardTolerance = customTolerance || DEFAULT_TOLERANCE;
return function (chai, utils) {
var Assertion = chai.Assertion;
var flag = utils.flag;
function overrideAssertEqual(_super) {
return function assertEqual(val, msg) {
if (msg) flag(this, 'message', msg);
var deep = flag(this, 'deep');
var tolerance = flag(this, 'tolerance');
if (deep) {
return this.eql(val);
} else if (tolerance && bothNumbers(val, this._obj)) {
this.assert(almostEqual(val, this._obj, tolerance), 'expected #{this} to almost equal #{exp}', 'expected #{this} to not almost equal #{exp}', val, this._obj, true);
} else {
return _super.apply(this, arguments);
}
};
}
function overrideAssertEql(_super) {
return function assertEql(val, msg) {
if (msg) flag(this, 'message', msg);
var tolerance = flag(this, 'tolerance');
if (tolerance) {
this.assert(deepEqual(val, this._obj, {
comparator: comparator(tolerance)
}), 'expected #{this} to deeply almost equal #{exp}', 'expected #{this} to not deeply almost equal #{exp}', val, this._obj, true);
} else {
return _super.apply(this, arguments);
}
};
}
function method(val, toleranceOverride) {
var tolerance = toleranceOverride || standardTolerance;
flag(this, 'tolerance', tolerance);
return this.equal(val);
}
function chainingBehavior() {
flag(this, 'tolerance', standardTolerance);
}
Assertion.addChainableMethod('almost', method, chainingBehavior);
Assertion.overwriteMethod('equal', overrideAssertEqual);
Assertion.overwriteMethod('equals', overrideAssertEqual);
Assertion.overwriteMethod('eq', overrideAssertEqual);
Assertion.overwriteMethod('eql', overrideAssertEql);
Assertion.overwriteMethod('eqls', overrideAssertEql);
};
}
module.exports = chaiAlmost;
return module.exports;
},
7: function (require, module, exports) {
const check = require(26);
module.exports = chai => {
const types = ['number', 'string', 'boolean', 'object', 'array', 'date', 'function'];
types.forEach(type => {
chai.Assertion.addMethod(type, function () {
this.assert(check[type](this._obj), `expected #{this} to be ${type}`, `expected #{this} not to be ${type}`);
});
});
};
return module.exports;
},
8: function (require, module, exports) {
function plugin(chai, utils) {
var Assertion = chai.Assertion;
function isEmitter() {
if (typeof EventEmitter !== "undefined" && EventEmitter !== null && this._obj instanceof EventEmitter) {
return this.assert(true, "", "expected #{this} to not be an EventEmitter");
}
if (typeof EventTarget !== "undefined" && EventTarget !== null && this._obj instanceof EventTarget) {
return this.assert(true, "", "expected #{this} to not be an EventTarget");
}
var obj = this._obj;
var node = ["on", "emit"].every(function (method) {
return typeof obj[method] === "function";
});
if (node) {
return this.assert(true, "", "expected #{this} to not be an EventEmitter");
}
var browser = ["addEventListener", "dispatchEvent", "removeEventListener"].every(function (method) {
return typeof obj[method] === "function";
});
if (browser) {
return this.assert(true, "", "expected #{this} to not be an EventEmitter");
}
this.assert(false, "expected #{this} to be an EventEmitter", "");
}
;
Assertion.addProperty("emitter", isEmitter);
Assertion.addProperty("target", isEmitter);
Assertion.addMethod("emit", function (name, args) {
new Assertion(this._obj).to.be.an.emitter;
new Assertion(name).to.be.a("string");
var obj = this._obj;
var _this = this;
var assert = function () {
_this.assert.apply(_this, arguments);
};
var timeout = utils.flag(this, 'timeout') || 1500;
if (utils.flag(this, 'negate')) {
return new Promise(function (resolve, reject) {
var done = false;
obj.on(name, function () {
if (done) {
return;
}
done = true;
assert(false, "expected #{this} to not emit " + name + ".");
resolve();
});
setTimeout(function () {
if (done) {
return;
}
done = true;
resolve();
}, timeout);
});
} else {
return new Promise(function (resolve, reject) {
var done = false;
obj.on(name, function () {
if (done) {
return;
}
done = true;
resolve();
});
setTimeout(function () {
if (done) {
return;
}
done = true;
assert(false, "expected #{this} to emit " + name + ".");
resolve();
}, timeout);
});
}
});
}
if (typeof require === "function" && typeof exports === "object" && typeof module === "object") {
module.exports = plugin;
} else if (typeof define === "function" && define.amd) {
define(function () {
return plugin;
});
} else {
chai.use(plugin);
}
return module.exports;
},
10: function (require, module, exports) {
var QuickCSS, constants, helpers;
constants = require(27);
helpers = require(28);
QuickCSS = function (targetEl, property, value, important) {
var computedStyle, i, len, subEl, subProperty, subValue;
if (helpers.isIterable(targetEl)) {
for ((i = 0, len = targetEl.length); i < len; i++) {
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
QuickCSS.animation = function (name, frames) {
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
QuickCSS.register = function (rule, level, important) {
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
QuickCSS.clearRegistered = function (level) {
return helpers.clearInlineStyle(level || 0);
};
QuickCSS.UNSET = (function () {
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
return module.exports;
},
11: function (require, module, exports) {
var exports, extend, modifiers, newBuilder, normalizeKeys;
extend = require(30);
normalizeKeys = function (keys) {
var i, key, len, output;
if (keys) {
output = {};
if (typeof keys !== 'object') {
output[keys] = true;
} else {
if (!Array.isArray(keys)) {
keys = Object.keys(keys);
}
for ((i = 0, len = keys.length); i < len; i++) {
key = keys[i];
output[key] = true;
}
}
return output;
}
};
newBuilder = function (isBase) {
var builder;
builder = function (target) {
var theTarget;
var $_len = arguments.length, $_i = -1, sources = new Array($_len);
while (++$_i < $_len) sources[$_i] = arguments[$_i];
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
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
_.options.deep = true;
return _;
}
},
'own': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
_.options.own = true;
return _;
}
},
'allowNull': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
_.options.allowNull = true;
return _;
}
},
'nullDeletes': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
_.options.nullDeletes = true;
return _;
}
},
'concat': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
_.options.concat = true;
return _;
}
},
'clone': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
_.options.target = {};
return _;
}
},
'notDeep': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
return function (keys) {
_.options.notDeep = normalizeKeys(keys);
return _;
};
}
},
'deepOnly': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
return function (keys) {
_.options.deepOnly = normalizeKeys(keys);
return _;
};
}
},
'keys': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
return function (keys) {
_.options.keys = normalizeKeys(keys);
return _;
};
}
},
'notKeys': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
return function (keys) {
_.options.notKeys = normalizeKeys(keys);
return _;
};
}
},
'transform': {
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
return function (transform) {
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
get: function () {
var _;
_ = this.isBase ? newBuilder() : this;
return function (filter) {
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
return module.exports;
},
22: function (require, module, exports) {
module.exports = function (type) {
var types;
if (type && ('transition' === type || 'trans' === type)) {
types = {
'OTransition': 'oTransitionEnd',
'WebkitTransition': 'webkitTransitionEnd',
'MozTransition': 'transitionend',
'transition': 'transitionend'
};
} else {
types = {
'OAnimation': 'oAnimationEnd',
'WebkitAnimation': 'webkitAnimationEnd',
'MozAnimation': 'animationend',
'animation': 'animationend'
};
}
var elem = document.createElement('fake');
return Object.keys(types).reduce(function (prev, trans) {
return undefined !== elem.style[trans] ? types[trans] : prev;
}, '');
};
return module.exports;
},
23: function (require, module, exports) {
var used = [];
exports.version = '4.1.2';
exports.AssertionError = require(45);
var util = require(46);
exports.use = function (fn) {
if (!~used.indexOf(fn)) {
fn(exports, util);
used.push(fn);
}
return exports;
};
exports.util = util;
var config = require(47);
exports.config = config;
var assertion = require(48);
exports.use(assertion);
var core = require(49);
exports.use(core);
var expect = require(50);
exports.use(expect);
var should = require(51);
exports.use(should);
var assert = require(52);
exports.use(assert);
return module.exports;
},
24: function (require, module, exports) {
'use strict';
var type = require(53);
function FakeMap() {
this.clear();
}
FakeMap.prototype = {
clear: function clearMap() {
this.keys = [];
this.values = [];
return this;
},
set: function setMap(key, value) {
var index = this.keys.indexOf(key);
if (index >= 0) {
this.values[index] = value;
} else {
this.keys.push(key);
this.values.push(value);
}
return this;
},
get: function getMap(key) {
return this.values[this.keys.indexOf(key)];
},
delete: function deleteMap(key) {
var index = this.keys.indexOf(key);
if (index >= 0) {
this.values = this.values.slice(0, index).concat(this.values.slice(index + 1));
this.keys = this.keys.slice(0, index).concat(this.keys.slice(index + 1));
}
return this;
}
};
var MemoizeMap = null;
if (typeof WeakMap === 'function') {
MemoizeMap = WeakMap;
} else {
MemoizeMap = FakeMap;
}
function memoizeCompare(leftHandOperand, rightHandOperand, memoizeMap) {
if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
return null;
}
var leftHandMap = memoizeMap.get(leftHandOperand);
if (leftHandMap) {
var result = leftHandMap.get(rightHandOperand);
if (typeof result === 'boolean') {
return result;
}
}
return null;
}
function memoizeSet(leftHandOperand, rightHandOperand, memoizeMap, result) {
if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
return;
}
var leftHandMap = memoizeMap.get(leftHandOperand);
if (leftHandMap) {
leftHandMap.set(rightHandOperand, result);
} else {
leftHandMap = new MemoizeMap();
leftHandMap.set(rightHandOperand, result);
memoizeMap.set(leftHandOperand, leftHandMap);
}
}
module.exports = deepEqual;
module.exports.MemoizeMap = MemoizeMap;
function deepEqual(leftHandOperand, rightHandOperand, options) {
if (options && options.comparator) {
return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
}
var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
if (simpleResult !== null) {
return simpleResult;
}
return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
}
function simpleEqual(leftHandOperand, rightHandOperand) {
if (leftHandOperand === rightHandOperand) {
return leftHandOperand !== 0 || 1 / leftHandOperand === 1 / rightHandOperand;
}
if (leftHandOperand !== leftHandOperand && rightHandOperand !== rightHandOperand) {
return true;
}
if (isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
return false;
}
return null;
}
function extensiveDeepEqual(leftHandOperand, rightHandOperand, options) {
options = options || ({});
options.memoize = options.memoize === false ? false : options.memoize || new MemoizeMap();
var comparator = options && options.comparator;
var memoizeResultLeft = memoizeCompare(leftHandOperand, rightHandOperand, options.memoize);
if (memoizeResultLeft !== null) {
return memoizeResultLeft;
}
var memoizeResultRight = memoizeCompare(rightHandOperand, leftHandOperand, options.memoize);
if (memoizeResultRight !== null) {
return memoizeResultRight;
}
if (comparator) {
var comparatorResult = comparator(leftHandOperand, rightHandOperand);
if (comparatorResult === false || comparatorResult === true) {
memoizeSet(leftHandOperand, rightHandOperand, options.memoize, comparatorResult);
return comparatorResult;
}
var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
if (simpleResult !== null) {
return simpleResult;
}
}
var leftHandType = type(leftHandOperand);
if (leftHandType !== type(rightHandOperand)) {
memoizeSet(leftHandOperand, rightHandOperand, options.memoize, false);
return false;
}
memoizeSet(leftHandOperand, rightHandOperand, options.memoize, true);
var result = extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options);
memoizeSet(leftHandOperand, rightHandOperand, options.memoize, result);
return result;
}
function extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options) {
switch (leftHandType) {
case 'String':
case 'Number':
case 'Boolean':
case 'Date':
return deepEqual(leftHandOperand.valueOf(), rightHandOperand.valueOf());
case 'Promise':
case 'Symbol':
case 'function':
case 'WeakMap':
case 'WeakSet':
case 'Error':
return leftHandOperand === rightHandOperand;
case 'Arguments':
case 'Int8Array':
case 'Uint8Array':
case 'Uint8ClampedArray':
case 'Int16Array':
case 'Uint16Array':
case 'Int32Array':
case 'Uint32Array':
case 'Float32Array':
case 'Float64Array':
case 'Array':
return iterableEqual(leftHandOperand, rightHandOperand, options);
case 'RegExp':
return regexpEqual(leftHandOperand, rightHandOperand);
case 'Generator':
return generatorEqual(leftHandOperand, rightHandOperand, options);
case 'DataView':
return iterableEqual(new Uint8Array(leftHandOperand.buffer), new Uint8Array(rightHandOperand.buffer), options);
case 'ArrayBuffer':
return iterableEqual(new Uint8Array(leftHandOperand), new Uint8Array(rightHandOperand), options);
case 'Set':
return entriesEqual(leftHandOperand, rightHandOperand, options);
case 'Map':
return entriesEqual(leftHandOperand, rightHandOperand, options);
default:
return objectEqual(leftHandOperand, rightHandOperand, options);
}
}
function regexpEqual(leftHandOperand, rightHandOperand) {
return leftHandOperand.toString() === rightHandOperand.toString();
}
function entriesEqual(leftHandOperand, rightHandOperand, options) {
if (leftHandOperand.size !== rightHandOperand.size) {
return false;
}
if (leftHandOperand.size === 0) {
return true;
}
var leftHandItems = [];
var rightHandItems = [];
leftHandOperand.forEach(function gatherEntries(key, value) {
leftHandItems.push([key, value]);
});
rightHandOperand.forEach(function gatherEntries(key, value) {
rightHandItems.push([key, value]);
});
return iterableEqual(leftHandItems.sort(), rightHandItems.sort(), options);
}
function iterableEqual(leftHandOperand, rightHandOperand, options) {
var length = leftHandOperand.length;
if (length !== rightHandOperand.length) {
return false;
}
if (length === 0) {
return true;
}
var index = -1;
while (++index < length) {
if (deepEqual(leftHandOperand[index], rightHandOperand[index], options) === false) {
return false;
}
}
return true;
}
function generatorEqual(leftHandOperand, rightHandOperand, options) {
return iterableEqual(getGeneratorEntries(leftHandOperand), getGeneratorEntries(rightHandOperand), options);
}
function hasIteratorFunction(target) {
return typeof Symbol !== 'undefined' && typeof target === 'object' && typeof Symbol.iterator !== 'undefined' && typeof target[Symbol.iterator] === 'function';
}
function getIteratorEntries(target) {
if (hasIteratorFunction(target)) {
try {
return getGeneratorEntries(target[Symbol.iterator]());
} catch (iteratorError) {
return [];
}
}
return [];
}
function getGeneratorEntries(generator) {
var generatorResult = generator.next();
var accumulator = [generatorResult.value];
while (generatorResult.done === false) {
generatorResult = generator.next();
accumulator.push(generatorResult.value);
}
return accumulator;
}
function getEnumerableKeys(target) {
var keys = [];
for (var key in target) {
keys.push(key);
}
return keys;
}
function keysEqual(leftHandOperand, rightHandOperand, keys, options) {
var length = keys.length;
if (length === 0) {
return true;
}
for (var i = 0; i < length; i += 1) {
if (deepEqual(leftHandOperand[keys[i]], rightHandOperand[keys[i]], options) === false) {
return false;
}
}
return true;
}
function objectEqual(leftHandOperand, rightHandOperand, options) {
var leftHandKeys = getEnumerableKeys(leftHandOperand);
var rightHandKeys = getEnumerableKeys(rightHandOperand);
if (leftHandKeys.length && leftHandKeys.length === rightHandKeys.length) {
leftHandKeys.sort();
rightHandKeys.sort();
if (iterableEqual(leftHandKeys, rightHandKeys) === false) {
return false;
}
return keysEqual(leftHandOperand, rightHandOperand, leftHandKeys, options);
}
var leftHandEntries = getIteratorEntries(leftHandOperand);
var rightHandEntries = getIteratorEntries(rightHandOperand);
if (leftHandEntries.length && leftHandEntries.length === rightHandEntries.length) {
leftHandEntries.sort();
rightHandEntries.sort();
return iterableEqual(leftHandEntries, rightHandEntries, options);
}
if (leftHandKeys.length === 0 && leftHandEntries.length === 0 && rightHandKeys.length === 0 && rightHandEntries.length === 0) {
return true;
}
return false;
}
function isPrimitive(value) {
return value === null || typeof value !== 'object';
}
return module.exports;
},
25: function (require, module, exports) {
'use strict';
var promiseExists = typeof Promise === 'function';
var globalObject = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : self;
var isDom = ('location' in globalObject) && ('document' in globalObject);
var symbolExists = typeof Symbol !== 'undefined';
var mapExists = typeof Map !== 'undefined';
var setExists = typeof Set !== 'undefined';
var weakMapExists = typeof WeakMap !== 'undefined';
var weakSetExists = typeof WeakSet !== 'undefined';
var dataViewExists = typeof DataView !== 'undefined';
var symbolIteratorExists = symbolExists && typeof Symbol.iterator !== 'undefined';
var symbolToStringTagExists = symbolExists && typeof Symbol.toStringTag !== 'undefined';
var setEntriesExists = setExists && typeof Set.prototype.entries === 'function';
var mapEntriesExists = mapExists && typeof Map.prototype.entries === 'function';
var setIteratorPrototype = setEntriesExists && Object.getPrototypeOf(new Set().entries());
var mapIteratorPrototype = mapEntriesExists && Object.getPrototypeOf(new Map().entries());
var arrayIteratorExists = symbolIteratorExists && typeof Array.prototype[Symbol.iterator] === 'function';
var arrayIteratorPrototype = arrayIteratorExists && Object.getPrototypeOf([][Symbol.iterator]());
var stringIteratorExists = symbolIteratorExists && typeof String.prototype[Symbol.iterator] === 'function';
var stringIteratorPrototype = stringIteratorExists && Object.getPrototypeOf(('')[Symbol.iterator]());
var toStringLeftSliceLength = 8;
var toStringRightSliceLength = -1;
module.exports = function typeDetect(obj) {
var typeofObj = typeof obj;
if (typeofObj !== 'object') {
return typeofObj;
}
if (obj === null) {
return 'null';
}
if (obj === globalObject) {
return 'global';
}
if (Array.isArray(obj) && (symbolToStringTagExists === false || !((Symbol.toStringTag in obj)))) {
return 'Array';
}
if (isDom) {
if (obj === globalObject.location) {
return 'Location';
}
if (obj === globalObject.document) {
return 'Document';
}
if (obj === (globalObject.navigator || ({})).mimeTypes) {
return 'MimeTypeArray';
}
if (obj === (globalObject.navigator || ({})).plugins) {
return 'PluginArray';
}
if (obj instanceof HTMLElement && obj.tagName === 'BLOCKQUOTE') {
return 'HTMLQuoteElement';
}
if (obj instanceof HTMLElement && obj.tagName === 'TD') {
return 'HTMLTableDataCellElement';
}
if (obj instanceof HTMLElement && obj.tagName === 'TH') {
return 'HTMLTableHeaderCellElement';
}
}
var stringTag = (symbolToStringTagExists && obj[Symbol.toStringTag]);
if (typeof stringTag === 'string') {
return stringTag;
}
var objPrototype = Object.getPrototypeOf(obj);
if (objPrototype === RegExp.prototype) {
return 'RegExp';
}
if (objPrototype === Date.prototype) {
return 'Date';
}
if (promiseExists && objPrototype === Promise.prototype) {
return 'Promise';
}
if (setExists && objPrototype === Set.prototype) {
return 'Set';
}
if (mapExists && objPrototype === Map.prototype) {
return 'Map';
}
if (weakSetExists && objPrototype === WeakSet.prototype) {
return 'WeakSet';
}
if (weakMapExists && objPrototype === WeakMap.prototype) {
return 'WeakMap';
}
if (dataViewExists && objPrototype === DataView.prototype) {
return 'DataView';
}
if (mapExists && objPrototype === mapIteratorPrototype) {
return 'Map Iterator';
}
if (setExists && objPrototype === setIteratorPrototype) {
return 'Set Iterator';
}
if (arrayIteratorExists && objPrototype === arrayIteratorPrototype) {
return 'Array Iterator';
}
if (stringIteratorExists && objPrototype === stringIteratorPrototype) {
return 'String Iterator';
}
if (objPrototype === null) {
return 'Object';
}
return Object.prototype.toString.call(obj).slice(toStringLeftSliceLength, toStringRightSliceLength);
};
module.exports.typeDetect = module.exports;
return module.exports;
},
26: function (require, module, exports) {
((function (globals) {
'use strict';
var strings, messages, predicates, functions, assert, not, maybe, collections, slice, neginf, posinf, isArray, haveSymbols;
strings = {
v: 'value',
n: 'number',
s: 'string',
b: 'boolean',
o: 'object',
t: 'type',
a: 'array',
al: 'array-like',
i: 'iterable',
d: 'date',
f: 'function',
l: 'length'
};
messages = {};
predicates = {};
[{
n: 'equal',
f: equal,
s: 'v'
}, {
n: 'undefined',
f: isUndefined,
s: 'v'
}, {
n: 'null',
f: isNull,
s: 'v'
}, {
n: 'assigned',
f: assigned,
s: 'v'
}, {
n: 'primitive',
f: primitive,
s: 'v'
}, {
n: 'includes',
f: includes,
s: 'v'
}, {
n: 'zero',
f: zero
}, {
n: 'infinity',
f: infinity
}, {
n: 'number',
f: number
}, {
n: 'integer',
f: integer
}, {
n: 'even',
f: even
}, {
n: 'odd',
f: odd
}, {
n: 'greater',
f: greater
}, {
n: 'less',
f: less
}, {
n: 'between',
f: between
}, {
n: 'greaterOrEqual',
f: greaterOrEqual
}, {
n: 'lessOrEqual',
f: lessOrEqual
}, {
n: 'inRange',
f: inRange
}, {
n: 'positive',
f: positive
}, {
n: 'negative',
f: negative
}, {
n: 'string',
f: string,
s: 's'
}, {
n: 'emptyString',
f: emptyString,
s: 's'
}, {
n: 'nonEmptyString',
f: nonEmptyString,
s: 's'
}, {
n: 'contains',
f: contains,
s: 's'
}, {
n: 'match',
f: match,
s: 's'
}, {
n: 'boolean',
f: boolean,
s: 'b'
}, {
n: 'object',
f: object,
s: 'o'
}, {
n: 'emptyObject',
f: emptyObject,
s: 'o'
}, {
n: 'nonEmptyObject',
f: nonEmptyObject,
s: 'o'
}, {
n: 'instanceStrict',
f: instanceStrict,
s: 't'
}, {
n: 'instance',
f: instance,
s: 't'
}, {
n: 'like',
f: like,
s: 't'
}, {
n: 'array',
f: array,
s: 'a'
}, {
n: 'emptyArray',
f: emptyArray,
s: 'a'
}, {
n: 'nonEmptyArray',
f: nonEmptyArray,
s: 'a'
}, {
n: 'arrayLike',
f: arrayLike,
s: 'al'
}, {
n: 'iterable',
f: iterable,
s: 'i'
}, {
n: 'date',
f: date,
s: 'd'
}, {
n: 'function',
f: isFunction,
s: 'f'
}, {
n: 'hasLength',
f: hasLength,
s: 'l'
}].map(function (data) {
var n = data.n;
messages[n] = 'Invalid ' + strings[data.s || 'n'];
predicates[n] = data.f;
});
functions = {
apply: apply,
map: map,
all: all,
any: any
};
collections = ['array', 'arrayLike', 'iterable', 'object'];
slice = Array.prototype.slice;
neginf = Number.NEGATIVE_INFINITY;
posinf = Number.POSITIVE_INFINITY;
isArray = Array.isArray;
haveSymbols = typeof Symbol === 'function';
functions = mixin(functions, predicates);
assert = createModifiedPredicates(assertModifier, assertImpl);
not = createModifiedPredicates(notModifier, notImpl);
maybe = createModifiedPredicates(maybeModifier, maybeImpl);
assert.not = createModifiedModifier(assertModifier, not);
assert.maybe = createModifiedModifier(assertModifier, maybe);
collections.forEach(createOfPredicates);
createOfModifiers(assert, assertModifier);
createOfModifiers(not, notModifier);
collections.forEach(createMaybeOfModifiers);
exportFunctions(mixin(functions, {
assert: assert,
not: not,
maybe: maybe
}));
function equal(lhs, rhs) {
return lhs === rhs;
}
function isUndefined(data) {
return data === undefined;
}
function isNull(data) {
return data === null;
}
function assigned(data) {
return data !== undefined && data !== null;
}
function primitive(data) {
var type;
switch (data) {
case null:
case undefined:
case false:
case true:
return true;
}
type = typeof data;
return type === 'string' || type === 'number' || (haveSymbols && type === 'symbol');
}
function zero(data) {
return data === 0;
}
function infinity(data) {
return data === neginf || data === posinf;
}
function number(data) {
return typeof data === 'number' && data > neginf && data < posinf;
}
function integer(data) {
return typeof data === 'number' && data % 1 === 0;
}
function even(data) {
return typeof data === 'number' && data % 2 === 0;
}
function odd(data) {
return integer(data) && data % 2 !== 0;
}
function greater(lhs, rhs) {
return number(lhs) && lhs > rhs;
}
function less(lhs, rhs) {
return number(lhs) && lhs < rhs;
}
function between(data, x, y) {
if (x < y) {
return greater(data, x) && data < y;
}
return less(data, x) && data > y;
}
function greaterOrEqual(lhs, rhs) {
return number(lhs) && lhs >= rhs;
}
function lessOrEqual(lhs, rhs) {
return number(lhs) && lhs <= rhs;
}
function inRange(data, x, y) {
if (x < y) {
return greaterOrEqual(data, x) && data <= y;
}
return lessOrEqual(data, x) && data >= y;
}
function positive(data) {
return greater(data, 0);
}
function negative(data) {
return less(data, 0);
}
function string(data) {
return typeof data === 'string';
}
function emptyString(data) {
return data === '';
}
function nonEmptyString(data) {
return string(data) && data !== '';
}
function contains(data, substring) {
return string(data) && data.indexOf(substring) !== -1;
}
function match(data, regex) {
return string(data) && !!data.match(regex);
}
function boolean(data) {
return data === false || data === true;
}
function object(data) {
return Object.prototype.toString.call(data) === '[object Object]';
}
function emptyObject(data) {
return object(data) && Object.keys(data).length === 0;
}
function nonEmptyObject(data) {
return object(data) && Object.keys(data).length > 0;
}
function instanceStrict(data, prototype) {
try {
return data instanceof prototype;
} catch (error) {
return false;
}
}
function instance(data, prototype) {
try {
return instanceStrict(data, prototype) || data.constructor.name === prototype.name || Object.prototype.toString.call(data) === '[object ' + prototype.name + ']';
} catch (error) {
return false;
}
}
function like(data, archetype) {
var name;
for (name in archetype) {
if (archetype.hasOwnProperty(name)) {
if (data.hasOwnProperty(name) === false || typeof data[name] !== typeof archetype[name]) {
return false;
}
if (object(data[name]) && like(data[name], archetype[name]) === false) {
return false;
}
}
}
return true;
}
function array(data) {
return isArray(data);
}
function emptyArray(data) {
return array(data) && data.length === 0;
}
function nonEmptyArray(data) {
return array(data) && greater(data.length, 0);
}
function arrayLike(data) {
return assigned(data) && greaterOrEqual(data.length, 0);
}
function iterable(data) {
if (!haveSymbols) {
return arrayLike(data);
}
return assigned(data) && isFunction(data[Symbol.iterator]);
}
function includes(data, value) {
var iterator, iteration, keys, length, i;
if (!assigned(data)) {
return false;
}
if (haveSymbols && data[Symbol.iterator] && isFunction(data.values)) {
iterator = data.values();
do {
iteration = iterator.next();
if (iteration.value === value) {
return true;
}
} while (!iteration.done);
return false;
}
keys = Object.keys(data);
length = keys.length;
for (i = 0; i < length; ++i) {
if (data[keys[i]] === value) {
return true;
}
}
return false;
}
function hasLength(data, length) {
return assigned(data) && data.length === length;
}
function date(data) {
return instanceStrict(data, Date) && integer(data.getTime());
}
function isFunction(data) {
return typeof data === 'function';
}
function apply(data, predicates) {
assert.array(data);
if (isFunction(predicates)) {
return data.map(function (value) {
return predicates(value);
});
}
assert.array(predicates);
assert.hasLength(data, predicates.length);
return data.map(function (value, index) {
return predicates[index](value);
});
}
function map(data, predicates) {
assert.object(data);
if (isFunction(predicates)) {
return mapSimple(data, predicates);
}
assert.object(predicates);
return mapComplex(data, predicates);
}
function mapSimple(data, predicate) {
var result = {};
Object.keys(data).forEach(function (key) {
result[key] = predicate(data[key]);
});
return result;
}
function mapComplex(data, predicates) {
var result = {};
Object.keys(predicates).forEach(function (key) {
var predicate = predicates[key];
if (isFunction(predicate)) {
if (not.assigned(data)) {
result[key] = !!predicate.m;
} else {
result[key] = predicate(data[key]);
}
} else if (object(predicate)) {
result[key] = mapComplex(data[key], predicate);
}
});
return result;
}
function all(data) {
if (array(data)) {
return testArray(data, false);
}
assert.object(data);
return testObject(data, false);
}
function testArray(data, result) {
var i;
for (i = 0; i < data.length; i += 1) {
if (data[i] === result) {
return result;
}
}
return !result;
}
function testObject(data, result) {
var key, value;
for (key in data) {
if (data.hasOwnProperty(key)) {
value = data[key];
if (object(value) && testObject(value, result) === result) {
return result;
}
if (value === result) {
return result;
}
}
}
return !result;
}
function any(data) {
if (array(data)) {
return testArray(data, true);
}
assert.object(data);
return testObject(data, true);
}
function mixin(target, source) {
Object.keys(source).forEach(function (key) {
target[key] = source[key];
});
return target;
}
function assertModifier(predicate, defaultMessage) {
return function () {
return assertPredicate(predicate, arguments, defaultMessage);
};
}
function assertPredicate(predicate, args, defaultMessage) {
var argCount = predicate.l || predicate.length;
var message = args[argCount];
var ErrorType = args[argCount + 1];
assertImpl(predicate.apply(null, args), nonEmptyString(message) ? message : defaultMessage, isFunction(ErrorType) ? ErrorType : TypeError);
return args[0];
}
function assertImpl(value, message, ErrorType) {
if (value) {
return value;
}
throw new (ErrorType || Error)(message || 'Assertion failed');
}
function notModifier(predicate) {
var modifiedPredicate = function () {
return notImpl(predicate.apply(null, arguments));
};
modifiedPredicate.l = predicate.length;
return modifiedPredicate;
}
function notImpl(value) {
return !value;
}
function maybeModifier(predicate) {
var modifiedPredicate = function () {
if (not.assigned(arguments[0])) {
return true;
}
return predicate.apply(null, arguments);
};
modifiedPredicate.l = predicate.length;
modifiedPredicate.m = true;
return modifiedPredicate;
}
function maybeImpl(value) {
if (assigned(value) === false) {
return true;
}
return value;
}
function ofModifier(target, type, predicate) {
var modifiedPredicate = function () {
var collection, args;
collection = arguments[0];
if (target === 'maybe' && not.assigned(collection)) {
return true;
}
if (!type(collection)) {
return false;
}
collection = coerceCollection(type, collection);
args = slice.call(arguments, 1);
try {
collection.forEach(function (item) {
if ((target !== 'maybe' || assigned(item)) && !predicate.apply(null, [item].concat(args))) {
throw 0;
}
});
} catch (ignore) {
return false;
}
return true;
};
modifiedPredicate.l = predicate.length;
return modifiedPredicate;
}
function coerceCollection(type, collection) {
switch (type) {
case arrayLike:
return slice.call(collection);
case object:
return Object.keys(collection).map(function (key) {
return collection[key];
});
default:
return collection;
}
}
function createModifiedPredicates(modifier, object) {
return createModifiedFunctions([modifier, predicates, object]);
}
function createModifiedFunctions(args) {
var modifier, object, functions, result;
modifier = args.shift();
object = args.pop();
functions = args.pop();
result = object || ({});
Object.keys(functions).forEach(function (key) {
Object.defineProperty(result, key, {
configurable: false,
enumerable: true,
writable: false,
value: modifier.apply(null, args.concat(functions[key], messages[key]))
});
});
return result;
}
function createModifiedModifier(modifier, modified) {
return createModifiedFunctions([modifier, modified, null]);
}
function createOfPredicates(key) {
predicates[key].of = createModifiedFunctions([ofModifier.bind(null, null), predicates[key], predicates, null]);
}
function createOfModifiers(base, modifier) {
collections.forEach(function (key) {
base[key].of = createModifiedModifier(modifier, predicates[key].of);
});
}
function createMaybeOfModifiers(key) {
maybe[key].of = createModifiedFunctions([ofModifier.bind(null, 'maybe'), predicates[key], predicates, null]);
assert.maybe[key].of = createModifiedModifier(assertModifier, maybe[key].of);
assert.not[key].of = createModifiedModifier(assertModifier, not[key].of);
}
function exportFunctions(functions) {
if (typeof define === 'function' && define.amd) {
define(function () {
return functions;
});
} else if (typeof module !== 'undefined' && module !== null && module.exports) {
module.exports = functions;
} else {
globals.check = functions;
}
}
})(this));
return module.exports;
},
27: function (require, module, exports) {
exports.REGEX_LEN_VAL = /^\d+(?:[a-z]|\%)+$/i;
exports.REGEX_DIGITS = /\d+$/;
exports.REGEX_SPACE = /\s/;
exports.REGEX_KEBAB = /([A-Z])+/g;
exports.IMPORTANT = 'important';
exports.POSSIBLE_PREFIXES = ['webkit', 'moz', 'ms', 'o'];
exports.REQUIRES_UNIT_VALUE = ['background-position-x', 'background-position-y', 'block-size', 'border-width', 'columnRule-width', 'cx', 'cy', 'font-size', 'grid-column-gap', 'grid-row-gap', 'height', 'inline-size', 'line-height', 'minBlock-size', 'min-height', 'min-inline-size', 'min-width', 'max-height', 'max-width', 'outline-offset', 'outline-width', 'perspective', 'shape-margin', 'stroke-dashoffset', 'stroke-width', 'text-indent', 'width', 'word-spacing', 'top', 'bottom', 'left', 'right', 'x', 'y'];
exports.QUAD_SHORTHANDS = ['margin', 'padding', 'border', 'border-radius'];
exports.DIRECTIONS = ['top', 'bottom', 'left', 'right'];
exports.QUAD_SHORTHANDS.forEach(function (property) {
var direction, i, len, ref;
exports.REQUIRES_UNIT_VALUE.push(property);
ref = exports.DIRECTIONS;
for ((i = 0, len = ref.length); i < len; i++) {
direction = ref[i];
exports.REQUIRES_UNIT_VALUE.push(property + '-' + direction);
}
});
return module.exports;
},
28: function (require, module, exports) {
var constants, helpers, sampleStyle, styleConfig;
constants = require(27);
sampleStyle = document.createElement('div').style;
helpers = exports;
helpers.includes = function (target, item) {
return target && target.indexOf(item) !== -1;
};
helpers.isIterable = function (target) {
return target && typeof target === 'object' && typeof target.length === 'number' && !target.nodeType;
};
helpers.toKebabCase = function (string) {
return string.replace(constants.REGEX_KEBAB, function (e, letter) {
return "-" + (letter.toLowerCase());
});
};
helpers.isPropSupported = function (property) {
return typeof sampleStyle[property] !== 'undefined';
};
helpers.isValueSupported = function (property, value) {
if (window.CSS && window.CSS.supports) {
return window.CSS.supports(property, value);
} else {
sampleStyle[property] = value;
return sampleStyle[property] === '' + value;
}
};
helpers.getPrefix = function (property, skipInitialCheck) {
var j, len1, prefix, ref;
if (skipInitialCheck || !helpers.isPropSupported(property)) {
ref = constants.POSSIBLE_PREFIXES;
for ((j = 0, len1 = ref.length); j < len1; j++) {
prefix = ref[j];
if (helpers.isPropSupported("-" + prefix + "-" + property)) {
return "-" + prefix + "-";
}
}
}
return '';
};
helpers.normalizeProperty = function (property) {
property = helpers.toKebabCase(property);
if (helpers.isPropSupported(property)) {
return property;
} else {
return "" + (helpers.getPrefix(property, true)) + property;
}
};
helpers.normalizeValue = function (property, value) {
if (helpers.includes(constants.REQUIRES_UNIT_VALUE, property) && value !== null) {
value = '' + value;
if (constants.REGEX_DIGITS.test(value) && !constants.REGEX_LEN_VAL.test(value) && !constants.REGEX_SPACE.test(value)) {
value += property === 'line-height' ? 'em' : 'px';
}
}
return value;
};
helpers.sort = function (array) {
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
helpers.hash = function (string) {
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
helpers.ruleToString = function (rule, important) {
var j, len1, output, prop, property, props, value;
output = '';
props = helpers.sort(Object.keys(rule));
for ((j = 0, len1 = props.length); j < len1; j++) {
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
helpers.inlineStyle = function (rule, valueToStore, level) {
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
helpers.clearInlineStyle = function (level) {
var config, j, key, keys, len1;
if (config = styleConfig[level]) {
if (!config.content) {
return;
}
config.el.textContent = config.content = '';
keys = Object.keys(config.cache);
for ((j = 0, len1 = keys.length); j < len1; j++) {
key = keys[j];
config.cache[key] = null;
}
}
};
return module.exports;
},
30: function (require, module, exports) {
var extend, isArray, isObject, shouldDeepExtend;
isArray = function (target) {
return Array.isArray(target);
};
isObject = function (target) {
return target && Object.prototype.toString.call(target) === '[object Object]' || isArray(target);
};
shouldDeepExtend = function (options, target, parentKey) {
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
module.exports = extend = function (options, target, sources, parentKey) {
var i, key, len, source, sourceValue, subTarget, targetValue;
if (!target || typeof target !== 'object' && typeof target !== 'function') {
target = {};
}
for ((i = 0, len = sources.length); i < len; i++) {
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
return module.exports;
},
32: function (require, module, exports) {
var Checks, availSets;
availSets = {
natives: require(54),
dom: require(55)
};
Checks = (function () {
Checks.prototype.create = function () {
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
for ((i = 0, len = sets.length); i < len; i++) {
set = sets[i];
if (availSets[set]) {
this.load(availSets[set]);
}
}
}
Checks.prototype.load = function (set) {
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
return module.exports;
},
45: function (require, module, exports) {
function exclude() {
var excludes = [].slice.call(arguments);
function excludeProps(res, obj) {
Object.keys(obj).forEach(function (key) {
if (!~excludes.indexOf(key)) res[key] = obj[key];
});
}
return function extendExclude() {
var args = [].slice.call(arguments), i = 0, res = {};
for (; i < args.length; i++) {
excludeProps(res, args[i]);
}
return res;
};
}
;
module.exports = AssertionError;
function AssertionError(message, _props, ssf) {
var extend = exclude('name', 'message', 'stack', 'constructor', 'toJSON'), props = extend(_props || ({}));
this.message = message || 'Unspecified AssertionError';
this.showDiff = false;
for (var key in props) {
this[key] = props[key];
}
ssf = ssf || arguments.callee;
if (ssf && Error.captureStackTrace) {
Error.captureStackTrace(this, ssf);
} else {
try {
throw new Error();
} catch (e) {
this.stack = e.stack;
}
}
}
AssertionError.prototype = Object.create(Error.prototype);
AssertionError.prototype.name = 'AssertionError';
AssertionError.prototype.constructor = AssertionError;
AssertionError.prototype.toJSON = function (stack) {
var extend = exclude('constructor', 'toJSON', 'stack'), props = extend({
name: this.name
}, this);
if (false !== stack && this.stack) {
props.stack = this.stack;
}
return props;
};
return module.exports;
},
46: function (require, module, exports) {
var pathval = require(57);
exports.test = require(58);
exports.type = require(25);
exports.expectTypes = require(59);
exports.getMessage = require(60);
exports.getActual = require(61);
exports.inspect = require(62);
exports.objDisplay = require(63);
exports.flag = require(64);
exports.transferFlags = require(65);
exports.eql = require(66);
exports.getPathInfo = pathval.getPathInfo;
exports.hasProperty = pathval.hasProperty;
exports.getName = require(67);
exports.addProperty = require(68);
exports.addMethod = require(69);
exports.overwriteProperty = require(70);
exports.overwriteMethod = require(71);
exports.addChainableMethod = require(72);
exports.overwriteChainableMethod = require(73);
exports.compareByInspect = require(74);
exports.getOwnEnumerablePropertySymbols = require(75);
exports.getOwnEnumerableProperties = require(76);
exports.checkError = require(77);
exports.proxify = require(78);
exports.addLengthGuard = require(79);
exports.isProxyEnabled = require(80);
exports.isNaN = require(81);
return module.exports;
},
47: function (require, module, exports) {
module.exports = {
includeStack: false,
showDiff: true,
truncateThreshold: 40,
useProxy: true,
proxyExcludedKeys: ['then', 'inspect', 'toJSON']
};
return module.exports;
},
48: function (require, module, exports) {
var config = require(47);
module.exports = function (_chai, util) {
var AssertionError = _chai.AssertionError, flag = util.flag;
_chai.Assertion = Assertion;
function Assertion(obj, msg, ssfi, lockSsfi) {
flag(this, 'ssfi', ssfi || Assertion);
flag(this, 'lockSsfi', lockSsfi);
flag(this, 'object', obj);
flag(this, 'message', msg);
return util.proxify(this);
}
Object.defineProperty(Assertion, 'includeStack', {
get: function () {
console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
return config.includeStack;
},
set: function (value) {
console.warn('Assertion.includeStack is deprecated, use chai.config.includeStack instead.');
config.includeStack = value;
}
});
Object.defineProperty(Assertion, 'showDiff', {
get: function () {
console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
return config.showDiff;
},
set: function (value) {
console.warn('Assertion.showDiff is deprecated, use chai.config.showDiff instead.');
config.showDiff = value;
}
});
Assertion.addProperty = function (name, fn) {
util.addProperty(this.prototype, name, fn);
};
Assertion.addMethod = function (name, fn) {
util.addMethod(this.prototype, name, fn);
};
Assertion.addChainableMethod = function (name, fn, chainingBehavior) {
util.addChainableMethod(this.prototype, name, fn, chainingBehavior);
};
Assertion.overwriteProperty = function (name, fn) {
util.overwriteProperty(this.prototype, name, fn);
};
Assertion.overwriteMethod = function (name, fn) {
util.overwriteMethod(this.prototype, name, fn);
};
Assertion.overwriteChainableMethod = function (name, fn, chainingBehavior) {
util.overwriteChainableMethod(this.prototype, name, fn, chainingBehavior);
};
Assertion.prototype.assert = function (expr, msg, negateMsg, expected, _actual, showDiff) {
var ok = util.test(this, arguments);
if (false !== showDiff) showDiff = true;
if (undefined === expected && undefined === _actual) showDiff = false;
if (true !== config.showDiff) showDiff = false;
if (!ok) {
msg = util.getMessage(this, arguments);
var actual = util.getActual(this, arguments);
throw new AssertionError(msg, {
actual: actual,
expected: expected,
showDiff: showDiff
}, ((config.includeStack)) ? this.assert : flag(this, 'ssfi'));
}
};
Object.defineProperty(Assertion.prototype, '_obj', {
get: function () {
return flag(this, 'object');
},
set: function (val) {
flag(this, 'object', val);
}
});
};
return module.exports;
},
49: function (require, module, exports) {
module.exports = function (chai, _) {
var Assertion = chai.Assertion, AssertionError = chai.AssertionError, flag = _.flag;
['to', 'be', 'been', 'is', 'and', 'has', 'have', 'with', 'that', 'which', 'at', 'of', 'same', 'but', 'does'].forEach(function (chain) {
Assertion.addProperty(chain);
});
Assertion.addProperty('not', function () {
flag(this, 'negate', true);
});
Assertion.addProperty('deep', function () {
flag(this, 'deep', true);
});
Assertion.addProperty('nested', function () {
flag(this, 'nested', true);
});
Assertion.addProperty('own', function () {
flag(this, 'own', true);
});
Assertion.addProperty('ordered', function () {
flag(this, 'ordered', true);
});
Assertion.addProperty('any', function () {
flag(this, 'any', true);
flag(this, 'all', false);
});
Assertion.addProperty('all', function () {
flag(this, 'all', true);
flag(this, 'any', false);
});
function an(type, msg) {
if (msg) flag(this, 'message', msg);
type = type.toLowerCase();
var obj = flag(this, 'object'), article = ~['a', 'e', 'i', 'o', 'u'].indexOf(type.charAt(0)) ? 'an ' : 'a ';
this.assert(type === _.type(obj).toLowerCase(), 'expected #{this} to be ' + article + type, 'expected #{this} not to be ' + article + type);
}
Assertion.addChainableMethod('an', an);
Assertion.addChainableMethod('a', an);
function SameValueZero(a, b) {
return (_.isNaN(a) && _.isNaN(b)) || a === b;
}
function includeChainingBehavior() {
flag(this, 'contains', true);
}
function include(val, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object'), objType = _.type(obj).toLowerCase(), flagMsg = flag(this, 'message'), negate = flag(this, 'negate'), ssfi = flag(this, 'ssfi'), isDeep = flag(this, 'deep'), descriptor = isDeep ? 'deep ' : '';
flagMsg = flagMsg ? flagMsg + ': ' : '';
var included = false;
switch (objType) {
case 'string':
included = obj.indexOf(val) !== -1;
break;
case 'weakset':
if (isDeep) {
throw new AssertionError(flagMsg + 'unable to use .deep.include with WeakSet', undefined, ssfi);
}
included = obj.has(val);
break;
case 'map':
var isEql = isDeep ? _.eql : SameValueZero;
obj.forEach(function (item) {
included = included || isEql(item, val);
});
break;
case 'set':
if (isDeep) {
obj.forEach(function (item) {
included = included || _.eql(item, val);
});
} else {
included = obj.has(val);
}
break;
case 'array':
if (isDeep) {
included = obj.some(function (item) {
return _.eql(item, val);
});
} else {
included = obj.indexOf(val) !== -1;
}
break;
default:
if (val !== Object(val)) {
throw new AssertionError(flagMsg + 'object tested must be an array, a map, an object,' + ' a set, a string, or a weakset, but ' + objType + ' given', undefined, ssfi);
}
var props = Object.keys(val), firstErr = null, numErrs = 0;
props.forEach(function (prop) {
var propAssertion = new Assertion(obj);
_.transferFlags(this, propAssertion, true);
flag(propAssertion, 'lockSsfi', true);
if (!negate || props.length === 1) {
propAssertion.property(prop, val[prop]);
return;
}
try {
propAssertion.property(prop, val[prop]);
} catch (err) {
if (!_.checkError.compatibleConstructor(err, AssertionError)) {
throw err;
}
if (firstErr === null) firstErr = err;
numErrs++;
}
}, this);
if (negate && props.length > 1 && numErrs === props.length) {
throw firstErr;
}
return;
}
this.assert(included, 'expected #{this} to ' + descriptor + 'include ' + _.inspect(val), 'expected #{this} to not ' + descriptor + 'include ' + _.inspect(val));
}
Assertion.addChainableMethod('include', include, includeChainingBehavior);
Assertion.addChainableMethod('contain', include, includeChainingBehavior);
Assertion.addChainableMethod('contains', include, includeChainingBehavior);
Assertion.addChainableMethod('includes', include, includeChainingBehavior);
Assertion.addProperty('ok', function () {
this.assert(flag(this, 'object'), 'expected #{this} to be truthy', 'expected #{this} to be falsy');
});
Assertion.addProperty('true', function () {
this.assert(true === flag(this, 'object'), 'expected #{this} to be true', 'expected #{this} to be false', flag(this, 'negate') ? false : true);
});
Assertion.addProperty('false', function () {
this.assert(false === flag(this, 'object'), 'expected #{this} to be false', 'expected #{this} to be true', flag(this, 'negate') ? true : false);
});
Assertion.addProperty('null', function () {
this.assert(null === flag(this, 'object'), 'expected #{this} to be null', 'expected #{this} not to be null');
});
Assertion.addProperty('undefined', function () {
this.assert(undefined === flag(this, 'object'), 'expected #{this} to be undefined', 'expected #{this} not to be undefined');
});
Assertion.addProperty('NaN', function () {
this.assert(_.isNaN(flag(this, 'object')), 'expected #{this} to be NaN', 'expected #{this} not to be NaN');
});
Assertion.addProperty('exist', function () {
var val = flag(this, 'object');
this.assert(val !== null && val !== undefined, 'expected #{this} to exist', 'expected #{this} to not exist');
});
Assertion.addProperty('empty', function () {
var val = flag(this, 'object'), ssfi = flag(this, 'ssfi'), flagMsg = flag(this, 'message'), itemsCount;
flagMsg = flagMsg ? flagMsg + ': ' : '';
switch (_.type(val).toLowerCase()) {
case 'array':
case 'string':
itemsCount = val.length;
break;
case 'map':
case 'set':
itemsCount = val.size;
break;
case 'weakmap':
case 'weakset':
throw new AssertionError(flagMsg + '.empty was passed a weak collection', undefined, ssfi);
case 'function':
var msg = flagMsg + '.empty was passed a function ' + _.getName(val);
throw new AssertionError(msg.trim(), undefined, ssfi);
default:
if (val !== Object(val)) {
throw new AssertionError(flagMsg + '.empty was passed non-string primitive ' + _.inspect(val), undefined, ssfi);
}
itemsCount = Object.keys(val).length;
}
this.assert(0 === itemsCount, 'expected #{this} to be empty', 'expected #{this} not to be empty');
});
function checkArguments() {
var obj = flag(this, 'object'), type = _.type(obj);
this.assert('Arguments' === type, 'expected #{this} to be arguments but got ' + type, 'expected #{this} to not be arguments');
}
Assertion.addProperty('arguments', checkArguments);
Assertion.addProperty('Arguments', checkArguments);
function assertEqual(val, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object');
if (flag(this, 'deep')) {
return this.eql(val);
} else {
this.assert(val === obj, 'expected #{this} to equal #{exp}', 'expected #{this} to not equal #{exp}', val, this._obj, true);
}
}
Assertion.addMethod('equal', assertEqual);
Assertion.addMethod('equals', assertEqual);
Assertion.addMethod('eq', assertEqual);
function assertEql(obj, msg) {
if (msg) flag(this, 'message', msg);
this.assert(_.eql(obj, flag(this, 'object')), 'expected #{this} to deeply equal #{exp}', 'expected #{this} to not deeply equal #{exp}', obj, this._obj, true);
}
Assertion.addMethod('eql', assertEql);
Assertion.addMethod('eqls', assertEql);
function assertAbove(n, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object'), doLength = flag(this, 'doLength'), flagMsg = flag(this, 'message'), msgPrefix = (((flagMsg)) ? flagMsg + ': ' : ''), ssfi = flag(this, 'ssfi'), objType = _.type(obj).toLowerCase(), nType = _.type(n).toLowerCase(), shouldThrow = true;
if (doLength) {
new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
}
if (!doLength && (objType === 'date' && nType !== 'date')) {
errorMessage = msgPrefix + 'the argument to above must be a date';
} else if (nType !== 'number' && (doLength || objType === 'number')) {
errorMessage = msgPrefix + 'the argument to above must be a number';
} else if (!doLength && (objType !== 'date' && objType !== 'number')) {
var printObj = ((objType === 'string')) ? "'" + obj + "'" : obj;
errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
} else {
shouldThrow = false;
}
if (shouldThrow) {
throw new AssertionError(errorMessage, undefined, ssfi);
}
if (doLength) {
var len = obj.length;
this.assert(len > n, 'expected #{this} to have a length above #{exp} but got #{act}', 'expected #{this} to not have a length above #{exp}', n, len);
} else {
this.assert(obj > n, 'expected #{this} to be above #{exp}', 'expected #{this} to be at most #{exp}', n);
}
}
Assertion.addMethod('above', assertAbove);
Assertion.addMethod('gt', assertAbove);
Assertion.addMethod('greaterThan', assertAbove);
function assertLeast(n, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object'), doLength = flag(this, 'doLength'), flagMsg = flag(this, 'message'), msgPrefix = (((flagMsg)) ? flagMsg + ': ' : ''), ssfi = flag(this, 'ssfi'), objType = _.type(obj).toLowerCase(), nType = _.type(n).toLowerCase(), shouldThrow = true;
if (doLength) {
new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
}
if (!doLength && (objType === 'date' && nType !== 'date')) {
errorMessage = msgPrefix + 'the argument to least must be a date';
} else if (nType !== 'number' && (doLength || objType === 'number')) {
errorMessage = msgPrefix + 'the argument to least must be a number';
} else if (!doLength && (objType !== 'date' && objType !== 'number')) {
var printObj = ((objType === 'string')) ? "'" + obj + "'" : obj;
errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
} else {
shouldThrow = false;
}
if (shouldThrow) {
throw new AssertionError(errorMessage, undefined, ssfi);
}
if (doLength) {
var len = obj.length;
this.assert(len >= n, 'expected #{this} to have a length at least #{exp} but got #{act}', 'expected #{this} to have a length below #{exp}', n, len);
} else {
this.assert(obj >= n, 'expected #{this} to be at least #{exp}', 'expected #{this} to be below #{exp}', n);
}
}
Assertion.addMethod('least', assertLeast);
Assertion.addMethod('gte', assertLeast);
function assertBelow(n, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object'), doLength = flag(this, 'doLength'), flagMsg = flag(this, 'message'), msgPrefix = (((flagMsg)) ? flagMsg + ': ' : ''), ssfi = flag(this, 'ssfi'), objType = _.type(obj).toLowerCase(), nType = _.type(n).toLowerCase(), shouldThrow = true;
if (doLength) {
new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
}
if (!doLength && (objType === 'date' && nType !== 'date')) {
errorMessage = msgPrefix + 'the argument to below must be a date';
} else if (nType !== 'number' && (doLength || objType === 'number')) {
errorMessage = msgPrefix + 'the argument to below must be a number';
} else if (!doLength && (objType !== 'date' && objType !== 'number')) {
var printObj = ((objType === 'string')) ? "'" + obj + "'" : obj;
errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
} else {
shouldThrow = false;
}
if (shouldThrow) {
throw new AssertionError(errorMessage, undefined, ssfi);
}
if (doLength) {
var len = obj.length;
this.assert(len < n, 'expected #{this} to have a length below #{exp} but got #{act}', 'expected #{this} to not have a length below #{exp}', n, len);
} else {
this.assert(obj < n, 'expected #{this} to be below #{exp}', 'expected #{this} to be at least #{exp}', n);
}
}
Assertion.addMethod('below', assertBelow);
Assertion.addMethod('lt', assertBelow);
Assertion.addMethod('lessThan', assertBelow);
function assertMost(n, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object'), doLength = flag(this, 'doLength'), flagMsg = flag(this, 'message'), msgPrefix = (((flagMsg)) ? flagMsg + ': ' : ''), ssfi = flag(this, 'ssfi'), objType = _.type(obj).toLowerCase(), nType = _.type(n).toLowerCase(), shouldThrow = true;
if (doLength) {
new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
}
if (!doLength && (objType === 'date' && nType !== 'date')) {
errorMessage = msgPrefix + 'the argument to most must be a date';
} else if (nType !== 'number' && (doLength || objType === 'number')) {
errorMessage = msgPrefix + 'the argument to most must be a number';
} else if (!doLength && (objType !== 'date' && objType !== 'number')) {
var printObj = ((objType === 'string')) ? "'" + obj + "'" : obj;
errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
} else {
shouldThrow = false;
}
if (shouldThrow) {
throw new AssertionError(errorMessage, undefined, ssfi);
}
if (doLength) {
var len = obj.length;
this.assert(len <= n, 'expected #{this} to have a length at most #{exp} but got #{act}', 'expected #{this} to have a length above #{exp}', n, len);
} else {
this.assert(obj <= n, 'expected #{this} to be at most #{exp}', 'expected #{this} to be above #{exp}', n);
}
}
Assertion.addMethod('most', assertMost);
Assertion.addMethod('lte', assertMost);
Assertion.addMethod('within', function (start, finish, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object'), doLength = flag(this, 'doLength'), flagMsg = flag(this, 'message'), msgPrefix = (((flagMsg)) ? flagMsg + ': ' : ''), ssfi = flag(this, 'ssfi'), objType = _.type(obj).toLowerCase(), startType = _.type(start).toLowerCase(), finishType = _.type(finish).toLowerCase(), shouldThrow = true, range = ((startType === 'date' && finishType === 'date')) ? start.toUTCString() + '..' + finish.toUTCString() : start + '..' + finish;
if (doLength) {
new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
}
if (!doLength && (objType === 'date' && (startType !== 'date' || finishType !== 'date'))) {
errorMessage = msgPrefix + 'the arguments to within must be dates';
} else if ((startType !== 'number' || finishType !== 'number') && (doLength || objType === 'number')) {
errorMessage = msgPrefix + 'the arguments to within must be numbers';
} else if (!doLength && (objType !== 'date' && objType !== 'number')) {
var printObj = ((objType === 'string')) ? "'" + obj + "'" : obj;
errorMessage = msgPrefix + 'expected ' + printObj + ' to be a number or a date';
} else {
shouldThrow = false;
}
if (shouldThrow) {
throw new AssertionError(errorMessage, undefined, ssfi);
}
if (doLength) {
var len = obj.length;
this.assert(len >= start && len <= finish, 'expected #{this} to have a length within ' + range, 'expected #{this} to not have a length within ' + range);
} else {
this.assert(obj >= start && obj <= finish, 'expected #{this} to be within ' + range, 'expected #{this} to not be within ' + range);
}
});
function assertInstanceOf(constructor, msg) {
if (msg) flag(this, 'message', msg);
var target = flag(this, 'object');
var ssfi = flag(this, 'ssfi');
var flagMsg = flag(this, 'message');
try {
var isInstanceOf = target instanceof constructor;
} catch (err) {
if (err instanceof TypeError) {
flagMsg = flagMsg ? flagMsg + ': ' : '';
throw new AssertionError(flagMsg + 'The instanceof assertion needs a constructor but ' + _.type(constructor) + ' was given.', undefined, ssfi);
}
throw err;
}
var name = _.getName(constructor);
if (name === null) {
name = 'an unnamed constructor';
}
this.assert(isInstanceOf, 'expected #{this} to be an instance of ' + name, 'expected #{this} to not be an instance of ' + name);
}
;
Assertion.addMethod('instanceof', assertInstanceOf);
Assertion.addMethod('instanceOf', assertInstanceOf);
function assertProperty(name, val, msg) {
if (msg) flag(this, 'message', msg);
var isNested = flag(this, 'nested'), isOwn = flag(this, 'own'), flagMsg = flag(this, 'message'), obj = flag(this, 'object'), ssfi = flag(this, 'ssfi');
if (isNested && isOwn) {
flagMsg = flagMsg ? flagMsg + ': ' : '';
throw new AssertionError(flagMsg + 'The "nested" and "own" flags cannot be combined.', undefined, ssfi);
}
if (obj === null || obj === undefined) {
flagMsg = flagMsg ? flagMsg + ': ' : '';
throw new AssertionError(flagMsg + 'Target cannot be null or undefined.', undefined, ssfi);
}
var isDeep = flag(this, 'deep'), negate = flag(this, 'negate'), pathInfo = isNested ? _.getPathInfo(obj, name) : null, value = isNested ? pathInfo.value : obj[name];
var descriptor = '';
if (isDeep) descriptor += 'deep ';
if (isOwn) descriptor += 'own ';
if (isNested) descriptor += 'nested ';
descriptor += 'property ';
var hasProperty;
if (isOwn) hasProperty = Object.prototype.hasOwnProperty.call(obj, name); else if (isNested) hasProperty = pathInfo.exists; else hasProperty = _.hasProperty(obj, name);
if (!negate || arguments.length === 1) {
this.assert(hasProperty, 'expected #{this} to have ' + descriptor + _.inspect(name), 'expected #{this} to not have ' + descriptor + _.inspect(name));
}
if (arguments.length > 1) {
this.assert(hasProperty && (isDeep ? _.eql(val, value) : val === value), 'expected #{this} to have ' + descriptor + _.inspect(name) + ' of #{exp}, but got #{act}', 'expected #{this} to not have ' + descriptor + _.inspect(name) + ' of #{act}', val, value);
}
flag(this, 'object', value);
}
Assertion.addMethod('property', assertProperty);
function assertOwnProperty(name, value, msg) {
flag(this, 'own', true);
assertProperty.apply(this, arguments);
}
Assertion.addMethod('ownProperty', assertOwnProperty);
Assertion.addMethod('haveOwnProperty', assertOwnProperty);
function assertOwnPropertyDescriptor(name, descriptor, msg) {
if (typeof descriptor === 'string') {
msg = descriptor;
descriptor = null;
}
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object');
var actualDescriptor = Object.getOwnPropertyDescriptor(Object(obj), name);
if (actualDescriptor && descriptor) {
this.assert(_.eql(descriptor, actualDescriptor), 'expected the own property descriptor for ' + _.inspect(name) + ' on #{this} to match ' + _.inspect(descriptor) + ', got ' + _.inspect(actualDescriptor), 'expected the own property descriptor for ' + _.inspect(name) + ' on #{this} to not match ' + _.inspect(descriptor), descriptor, actualDescriptor, true);
} else {
this.assert(actualDescriptor, 'expected #{this} to have an own property descriptor for ' + _.inspect(name), 'expected #{this} to not have an own property descriptor for ' + _.inspect(name));
}
flag(this, 'object', actualDescriptor);
}
Assertion.addMethod('ownPropertyDescriptor', assertOwnPropertyDescriptor);
Assertion.addMethod('haveOwnPropertyDescriptor', assertOwnPropertyDescriptor);
function assertLengthChain() {
flag(this, 'doLength', true);
}
function assertLength(n, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object'), flagMsg = flag(this, 'message'), ssfi = flag(this, 'ssfi');
new Assertion(obj, flagMsg, ssfi, true).to.have.property('length');
var len = obj.length;
this.assert(len == n, 'expected #{this} to have a length of #{exp} but got #{act}', 'expected #{this} to not have a length of #{act}', n, len);
}
Assertion.addChainableMethod('length', assertLength, assertLengthChain);
Assertion.addChainableMethod('lengthOf', assertLength, assertLengthChain);
function assertMatch(re, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object');
this.assert(re.exec(obj), 'expected #{this} to match ' + re, 'expected #{this} not to match ' + re);
}
Assertion.addMethod('match', assertMatch);
Assertion.addMethod('matches', assertMatch);
Assertion.addMethod('string', function (str, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object'), flagMsg = flag(this, 'message'), ssfi = flag(this, 'ssfi');
new Assertion(obj, flagMsg, ssfi, true).is.a('string');
this.assert(~obj.indexOf(str), 'expected #{this} to contain ' + _.inspect(str), 'expected #{this} to not contain ' + _.inspect(str));
});
function assertKeys(keys) {
var obj = flag(this, 'object'), objType = _.type(obj), keysType = _.type(keys), ssfi = flag(this, 'ssfi'), isDeep = flag(this, 'deep'), str, deepStr = '', ok = true, flagMsg = flag(this, 'message');
flagMsg = flagMsg ? flagMsg + ': ' : '';
var mixedArgsMsg = flagMsg + 'when testing keys against an object or an array you must give a single Array|Object|String argument or multiple String arguments';
if (objType === 'Map' || objType === 'Set') {
deepStr = isDeep ? 'deeply ' : '';
actual = [];
obj.forEach(function (val, key) {
actual.push(key);
});
if (keysType !== 'Array') {
keys = Array.prototype.slice.call(arguments);
}
} else {
actual = _.getOwnEnumerableProperties(obj);
switch (keysType) {
case 'Array':
if (arguments.length > 1) {
throw new AssertionError(mixedArgsMsg, undefined, ssfi);
}
break;
case 'Object':
if (arguments.length > 1) {
throw new AssertionError(mixedArgsMsg, undefined, ssfi);
}
keys = Object.keys(keys);
break;
default:
keys = Array.prototype.slice.call(arguments);
}
keys = keys.map(function (val) {
return typeof val === 'symbol' ? val : String(val);
});
}
if (!keys.length) {
throw new AssertionError(flagMsg + 'keys required', undefined, ssfi);
}
var len = keys.length, any = flag(this, 'any'), all = flag(this, 'all'), expected = keys, actual;
if (!any && !all) {
all = true;
}
if (any) {
ok = expected.some(function (expectedKey) {
return actual.some(function (actualKey) {
if (isDeep) {
return _.eql(expectedKey, actualKey);
} else {
return expectedKey === actualKey;
}
});
});
}
if (all) {
ok = expected.every(function (expectedKey) {
return actual.some(function (actualKey) {
if (isDeep) {
return _.eql(expectedKey, actualKey);
} else {
return expectedKey === actualKey;
}
});
});
if (!flag(this, 'contains')) {
ok = ok && keys.length == actual.length;
}
}
if (len > 1) {
keys = keys.map(function (key) {
return _.inspect(key);
});
var last = keys.pop();
if (all) {
str = keys.join(', ') + ', and ' + last;
}
if (any) {
str = keys.join(', ') + ', or ' + last;
}
} else {
str = _.inspect(keys[0]);
}
str = (len > 1 ? 'keys ' : 'key ') + str;
str = (flag(this, 'contains') ? 'contain ' : 'have ') + str;
this.assert(ok, 'expected #{this} to ' + deepStr + str, 'expected #{this} to not ' + deepStr + str, expected.slice(0).sort(_.compareByInspect), actual.sort(_.compareByInspect), true);
}
Assertion.addMethod('keys', assertKeys);
Assertion.addMethod('key', assertKeys);
function assertThrows(errorLike, errMsgMatcher, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object'), ssfi = flag(this, 'ssfi'), flagMsg = flag(this, 'message'), negate = flag(this, 'negate') || false;
new Assertion(obj, flagMsg, ssfi, true).is.a('function');
if (errorLike instanceof RegExp || typeof errorLike === 'string') {
errMsgMatcher = errorLike;
errorLike = null;
}
var caughtErr;
try {
obj();
} catch (err) {
caughtErr = err;
}
var everyArgIsUndefined = errorLike === undefined && errMsgMatcher === undefined;
var everyArgIsDefined = Boolean(errorLike && errMsgMatcher);
var errorLikeFail = false;
var errMsgMatcherFail = false;
if (everyArgIsUndefined || !everyArgIsUndefined && !negate) {
var errorLikeString = 'an error';
if (errorLike instanceof Error) {
errorLikeString = '#{exp}';
} else if (errorLike) {
errorLikeString = _.checkError.getConstructorName(errorLike);
}
this.assert(caughtErr, 'expected #{this} to throw ' + errorLikeString, 'expected #{this} to not throw an error but #{act} was thrown', errorLike && errorLike.toString(), (caughtErr instanceof Error ? caughtErr.toString() : (typeof caughtErr === 'string' ? caughtErr : caughtErr && _.checkError.getConstructorName(caughtErr))));
}
if (errorLike && caughtErr) {
if (errorLike instanceof Error) {
var isCompatibleInstance = _.checkError.compatibleInstance(caughtErr, errorLike);
if (isCompatibleInstance === negate) {
if (everyArgIsDefined && negate) {
errorLikeFail = true;
} else {
this.assert(negate, 'expected #{this} to throw #{exp} but #{act} was thrown', 'expected #{this} to not throw #{exp}' + (caughtErr && !negate ? ' but #{act} was thrown' : ''), errorLike.toString(), caughtErr.toString());
}
}
}
var isCompatibleConstructor = _.checkError.compatibleConstructor(caughtErr, errorLike);
if (isCompatibleConstructor === negate) {
if (everyArgIsDefined && negate) {
errorLikeFail = true;
} else {
this.assert(negate, 'expected #{this} to throw #{exp} but #{act} was thrown', 'expected #{this} to not throw #{exp}' + (caughtErr ? ' but #{act} was thrown' : ''), (errorLike instanceof Error ? errorLike.toString() : errorLike && _.checkError.getConstructorName(errorLike)), (caughtErr instanceof Error ? caughtErr.toString() : caughtErr && _.checkError.getConstructorName(caughtErr)));
}
}
}
if (caughtErr && errMsgMatcher !== undefined && errMsgMatcher !== null) {
var placeholder = 'including';
if (errMsgMatcher instanceof RegExp) {
placeholder = 'matching';
}
var isCompatibleMessage = _.checkError.compatibleMessage(caughtErr, errMsgMatcher);
if (isCompatibleMessage === negate) {
if (everyArgIsDefined && negate) {
errMsgMatcherFail = true;
} else {
this.assert(negate, 'expected #{this} to throw error ' + placeholder + ' #{exp} but got #{act}', 'expected #{this} to throw error not ' + placeholder + ' #{exp}', errMsgMatcher, _.checkError.getMessage(caughtErr));
}
}
}
if (errorLikeFail && errMsgMatcherFail) {
this.assert(negate, 'expected #{this} to throw #{exp} but #{act} was thrown', 'expected #{this} to not throw #{exp}' + (caughtErr ? ' but #{act} was thrown' : ''), (errorLike instanceof Error ? errorLike.toString() : errorLike && _.checkError.getConstructorName(errorLike)), (caughtErr instanceof Error ? caughtErr.toString() : caughtErr && _.checkError.getConstructorName(caughtErr)));
}
flag(this, 'object', caughtErr);
}
;
Assertion.addMethod('throw', assertThrows);
Assertion.addMethod('throws', assertThrows);
Assertion.addMethod('Throw', assertThrows);
function respondTo(method, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object'), itself = flag(this, 'itself'), context = (('function' === typeof obj && !itself)) ? obj.prototype[method] : obj[method];
this.assert('function' === typeof context, 'expected #{this} to respond to ' + _.inspect(method), 'expected #{this} to not respond to ' + _.inspect(method));
}
Assertion.addMethod('respondTo', respondTo);
Assertion.addMethod('respondsTo', respondTo);
Assertion.addProperty('itself', function () {
flag(this, 'itself', true);
});
function satisfy(matcher, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object');
var result = matcher(obj);
this.assert(result, 'expected #{this} to satisfy ' + _.objDisplay(matcher), 'expected #{this} to not satisfy' + _.objDisplay(matcher), flag(this, 'negate') ? false : true, result);
}
Assertion.addMethod('satisfy', satisfy);
Assertion.addMethod('satisfies', satisfy);
function closeTo(expected, delta, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object'), flagMsg = flag(this, 'message'), ssfi = flag(this, 'ssfi');
new Assertion(obj, flagMsg, ssfi, true).is.a('number');
if (typeof expected !== 'number' || typeof delta !== 'number') {
flagMsg = flagMsg ? flagMsg + ': ' : '';
throw new AssertionError(flagMsg + 'the arguments to closeTo or approximately must be numbers', undefined, ssfi);
}
this.assert(Math.abs(obj - expected) <= delta, 'expected #{this} to be close to ' + expected + ' +/- ' + delta, 'expected #{this} not to be close to ' + expected + ' +/- ' + delta);
}
Assertion.addMethod('closeTo', closeTo);
Assertion.addMethod('approximately', closeTo);
function isSubsetOf(subset, superset, cmp, contains, ordered) {
if (!contains) {
if (subset.length !== superset.length) return false;
superset = superset.slice();
}
return subset.every(function (elem, idx) {
if (ordered) return cmp ? cmp(elem, superset[idx]) : elem === superset[idx];
if (!cmp) {
var matchIdx = superset.indexOf(elem);
if (matchIdx === -1) return false;
if (!contains) superset.splice(matchIdx, 1);
return true;
}
return superset.some(function (elem2, matchIdx) {
if (!cmp(elem, elem2)) return false;
if (!contains) superset.splice(matchIdx, 1);
return true;
});
});
}
Assertion.addMethod('members', function (subset, msg) {
if (msg) flag(this, 'message', msg);
var obj = flag(this, 'object'), flagMsg = flag(this, 'message'), ssfi = flag(this, 'ssfi');
new Assertion(obj, flagMsg, ssfi, true).to.be.an('array');
new Assertion(subset, flagMsg, ssfi, true).to.be.an('array');
var contains = flag(this, 'contains');
var ordered = flag(this, 'ordered');
var subject, failMsg, failNegateMsg, lengthCheck;
if (contains) {
subject = ordered ? 'an ordered superset' : 'a superset';
failMsg = 'expected #{this} to be ' + subject + ' of #{exp}';
failNegateMsg = 'expected #{this} to not be ' + subject + ' of #{exp}';
} else {
subject = ordered ? 'ordered members' : 'members';
failMsg = 'expected #{this} to have the same ' + subject + ' as #{exp}';
failNegateMsg = 'expected #{this} to not have the same ' + subject + ' as #{exp}';
}
var cmp = flag(this, 'deep') ? _.eql : undefined;
this.assert(isSubsetOf(subset, obj, cmp, contains, ordered), failMsg, failNegateMsg, subset, obj, true);
});
function oneOf(list, msg) {
if (msg) flag(this, 'message', msg);
var expected = flag(this, 'object'), flagMsg = flag(this, 'message'), ssfi = flag(this, 'ssfi');
new Assertion(list, flagMsg, ssfi, true).to.be.an('array');
this.assert(list.indexOf(expected) > -1, 'expected #{this} to be one of #{exp}', 'expected #{this} to not be one of #{exp}', list, expected);
}
Assertion.addMethod('oneOf', oneOf);
function assertChanges(subject, prop, msg) {
if (msg) flag(this, 'message', msg);
var fn = flag(this, 'object'), flagMsg = flag(this, 'message'), ssfi = flag(this, 'ssfi');
new Assertion(fn, flagMsg, ssfi, true).is.a('function');
var initial;
if (!prop) {
new Assertion(subject, flagMsg, ssfi, true).is.a('function');
initial = subject();
} else {
new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
initial = subject[prop];
}
fn();
var final = prop === undefined || prop === null ? subject() : subject[prop];
var msgObj = prop === undefined || prop === null ? initial : '.' + prop;
flag(this, 'deltaMsgObj', msgObj);
flag(this, 'initialDeltaValue', initial);
flag(this, 'finalDeltaValue', final);
flag(this, 'deltaBehavior', 'change');
flag(this, 'realDelta', final !== initial);
this.assert(initial !== final, 'expected ' + msgObj + ' to change', 'expected ' + msgObj + ' to not change');
}
Assertion.addMethod('change', assertChanges);
Assertion.addMethod('changes', assertChanges);
function assertIncreases(subject, prop, msg) {
if (msg) flag(this, 'message', msg);
var fn = flag(this, 'object'), flagMsg = flag(this, 'message'), ssfi = flag(this, 'ssfi');
new Assertion(fn, flagMsg, ssfi, true).is.a('function');
var initial;
if (!prop) {
new Assertion(subject, flagMsg, ssfi, true).is.a('function');
initial = subject();
} else {
new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
initial = subject[prop];
}
new Assertion(initial, flagMsg, ssfi, true).is.a('number');
fn();
var final = prop === undefined || prop === null ? subject() : subject[prop];
var msgObj = prop === undefined || prop === null ? initial : '.' + prop;
flag(this, 'deltaMsgObj', msgObj);
flag(this, 'initialDeltaValue', initial);
flag(this, 'finalDeltaValue', final);
flag(this, 'deltaBehavior', 'increase');
flag(this, 'realDelta', final - initial);
this.assert(final - initial > 0, 'expected ' + msgObj + ' to increase', 'expected ' + msgObj + ' to not increase');
}
Assertion.addMethod('increase', assertIncreases);
Assertion.addMethod('increases', assertIncreases);
function assertDecreases(subject, prop, msg) {
if (msg) flag(this, 'message', msg);
var fn = flag(this, 'object'), flagMsg = flag(this, 'message'), ssfi = flag(this, 'ssfi');
new Assertion(fn, flagMsg, ssfi, true).is.a('function');
var initial;
if (!prop) {
new Assertion(subject, flagMsg, ssfi, true).is.a('function');
initial = subject();
} else {
new Assertion(subject, flagMsg, ssfi, true).to.have.property(prop);
initial = subject[prop];
}
new Assertion(initial, flagMsg, ssfi, true).is.a('number');
fn();
var final = prop === undefined || prop === null ? subject() : subject[prop];
var msgObj = prop === undefined || prop === null ? initial : '.' + prop;
flag(this, 'deltaMsgObj', msgObj);
flag(this, 'initialDeltaValue', initial);
flag(this, 'finalDeltaValue', final);
flag(this, 'deltaBehavior', 'decrease');
flag(this, 'realDelta', initial - final);
this.assert(final - initial < 0, 'expected ' + msgObj + ' to decrease', 'expected ' + msgObj + ' to not decrease');
}
Assertion.addMethod('decrease', assertDecreases);
Assertion.addMethod('decreases', assertDecreases);
function assertDelta(delta, msg) {
if (msg) flag(this, 'message', msg);
var msgObj = flag(this, 'deltaMsgObj');
var initial = flag(this, 'initialDeltaValue');
var final = flag(this, 'finalDeltaValue');
var behavior = flag(this, 'deltaBehavior');
var realDelta = flag(this, 'realDelta');
var expression;
if (behavior === 'change') {
expression = Math.abs(final - initial) === Math.abs(delta);
} else {
expression = realDelta === Math.abs(delta);
}
this.assert(expression, 'expected ' + msgObj + ' to ' + behavior + ' by ' + delta, 'expected ' + msgObj + ' to not ' + behavior + ' by ' + delta);
}
Assertion.addMethod('by', assertDelta);
Assertion.addProperty('extensible', function () {
var obj = flag(this, 'object');
var isExtensible = obj === Object(obj) && Object.isExtensible(obj);
this.assert(isExtensible, 'expected #{this} to be extensible', 'expected #{this} to not be extensible');
});
Assertion.addProperty('sealed', function () {
var obj = flag(this, 'object');
var isSealed = obj === Object(obj) ? Object.isSealed(obj) : true;
this.assert(isSealed, 'expected #{this} to be sealed', 'expected #{this} to not be sealed');
});
Assertion.addProperty('frozen', function () {
var obj = flag(this, 'object');
var isFrozen = obj === Object(obj) ? Object.isFrozen(obj) : true;
this.assert(isFrozen, 'expected #{this} to be frozen', 'expected #{this} to not be frozen');
});
Assertion.addProperty('finite', function (msg) {
var obj = flag(this, 'object');
this.assert(typeof obj === "number" && isFinite(obj), 'expected #{this} to be a finite number', 'expected #{this} to not be a finite number');
});
};
return module.exports;
},
50: function (require, module, exports) {
module.exports = function (chai, util) {
chai.expect = function (val, message) {
return new chai.Assertion(val, message);
};
chai.expect.fail = function (actual, expected, message, operator) {
message = message || 'expect.fail()';
throw new chai.AssertionError(message, {
actual: actual,
expected: expected,
operator: operator
}, chai.expect.fail);
};
};
return module.exports;
},
51: function (require, module, exports) {
module.exports = function (chai, util) {
var Assertion = chai.Assertion;
function loadShould() {
function shouldGetter() {
if (this instanceof String || this instanceof Number || this instanceof Boolean || typeof Symbol === 'function' && this instanceof Symbol) {
return new Assertion(this.valueOf(), null, shouldGetter);
}
return new Assertion(this, null, shouldGetter);
}
function shouldSetter(value) {
Object.defineProperty(this, 'should', {
value: value,
enumerable: true,
configurable: true,
writable: true
});
}
Object.defineProperty(Object.prototype, 'should', {
set: shouldSetter,
get: shouldGetter,
configurable: true
});
var should = {};
should.fail = function (actual, expected, message, operator) {
message = message || 'should.fail()';
throw new chai.AssertionError(message, {
actual: actual,
expected: expected,
operator: operator
}, should.fail);
};
should.equal = function (val1, val2, msg) {
new Assertion(val1, msg).to.equal(val2);
};
should.Throw = function (fn, errt, errs, msg) {
new Assertion(fn, msg).to.Throw(errt, errs);
};
should.exist = function (val, msg) {
new Assertion(val, msg).to.exist;
};
should.not = {};
should.not.equal = function (val1, val2, msg) {
new Assertion(val1, msg).to.not.equal(val2);
};
should.not.Throw = function (fn, errt, errs, msg) {
new Assertion(fn, msg).to.not.Throw(errt, errs);
};
should.not.exist = function (val, msg) {
new Assertion(val, msg).to.not.exist;
};
should['throw'] = should['Throw'];
should.not['throw'] = should.not['Throw'];
return should;
}
;
chai.should = loadShould;
chai.Should = loadShould;
};
return module.exports;
},
52: function (require, module, exports) {
module.exports = function (chai, util) {
var Assertion = chai.Assertion, flag = util.flag;
var assert = chai.assert = function (express, errmsg) {
var test = new Assertion(null, null, chai.assert, true);
test.assert(express, errmsg, '[ negation message unavailable ]');
};
assert.fail = function (actual, expected, message, operator) {
message = message || 'assert.fail()';
throw new chai.AssertionError(message, {
actual: actual,
expected: expected,
operator: operator
}, assert.fail);
};
assert.isOk = function (val, msg) {
new Assertion(val, msg, assert.isOk, true).is.ok;
};
assert.isNotOk = function (val, msg) {
new Assertion(val, msg, assert.isNotOk, true).is.not.ok;
};
assert.equal = function (act, exp, msg) {
var test = new Assertion(act, msg, assert.equal, true);
test.assert(exp == flag(test, 'object'), 'expected #{this} to equal #{exp}', 'expected #{this} to not equal #{act}', exp, act, true);
};
assert.notEqual = function (act, exp, msg) {
var test = new Assertion(act, msg, assert.notEqual, true);
test.assert(exp != flag(test, 'object'), 'expected #{this} to not equal #{exp}', 'expected #{this} to equal #{act}', exp, act, true);
};
assert.strictEqual = function (act, exp, msg) {
new Assertion(act, msg, assert.strictEqual, true).to.equal(exp);
};
assert.notStrictEqual = function (act, exp, msg) {
new Assertion(act, msg, assert.notStrictEqual, true).to.not.equal(exp);
};
assert.deepEqual = assert.deepStrictEqual = function (act, exp, msg) {
new Assertion(act, msg, assert.deepEqual, true).to.eql(exp);
};
assert.notDeepEqual = function (act, exp, msg) {
new Assertion(act, msg, assert.notDeepEqual, true).to.not.eql(exp);
};
assert.isAbove = function (val, abv, msg) {
new Assertion(val, msg, assert.isAbove, true).to.be.above(abv);
};
assert.isAtLeast = function (val, atlst, msg) {
new Assertion(val, msg, assert.isAtLeast, true).to.be.least(atlst);
};
assert.isBelow = function (val, blw, msg) {
new Assertion(val, msg, assert.isBelow, true).to.be.below(blw);
};
assert.isAtMost = function (val, atmst, msg) {
new Assertion(val, msg, assert.isAtMost, true).to.be.most(atmst);
};
assert.isTrue = function (val, msg) {
new Assertion(val, msg, assert.isTrue, true).is['true'];
};
assert.isNotTrue = function (val, msg) {
new Assertion(val, msg, assert.isNotTrue, true).to.not.equal(true);
};
assert.isFalse = function (val, msg) {
new Assertion(val, msg, assert.isFalse, true).is['false'];
};
assert.isNotFalse = function (val, msg) {
new Assertion(val, msg, assert.isNotFalse, true).to.not.equal(false);
};
assert.isNull = function (val, msg) {
new Assertion(val, msg, assert.isNull, true).to.equal(null);
};
assert.isNotNull = function (val, msg) {
new Assertion(val, msg, assert.isNotNull, true).to.not.equal(null);
};
assert.isNaN = function (val, msg) {
new Assertion(val, msg, assert.isNaN, true).to.be.NaN;
};
assert.isNotNaN = function (val, msg) {
new Assertion(val, msg, assert.isNotNaN, true).not.to.be.NaN;
};
assert.exists = function (val, msg) {
new Assertion(val, msg, assert.exists, true).to.exist;
};
assert.notExists = function (val, msg) {
new Assertion(val, msg, assert.notExists, true).to.not.exist;
};
assert.isUndefined = function (val, msg) {
new Assertion(val, msg, assert.isUndefined, true).to.equal(undefined);
};
assert.isDefined = function (val, msg) {
new Assertion(val, msg, assert.isDefined, true).to.not.equal(undefined);
};
assert.isFunction = function (val, msg) {
new Assertion(val, msg, assert.isFunction, true).to.be.a('function');
};
assert.isNotFunction = function (val, msg) {
new Assertion(val, msg, assert.isNotFunction, true).to.not.be.a('function');
};
assert.isObject = function (val, msg) {
new Assertion(val, msg, assert.isObject, true).to.be.a('object');
};
assert.isNotObject = function (val, msg) {
new Assertion(val, msg, assert.isNotObject, true).to.not.be.a('object');
};
assert.isArray = function (val, msg) {
new Assertion(val, msg, assert.isArray, true).to.be.an('array');
};
assert.isNotArray = function (val, msg) {
new Assertion(val, msg, assert.isNotArray, true).to.not.be.an('array');
};
assert.isString = function (val, msg) {
new Assertion(val, msg, assert.isString, true).to.be.a('string');
};
assert.isNotString = function (val, msg) {
new Assertion(val, msg, assert.isNotString, true).to.not.be.a('string');
};
assert.isNumber = function (val, msg) {
new Assertion(val, msg, assert.isNumber, true).to.be.a('number');
};
assert.isNotNumber = function (val, msg) {
new Assertion(val, msg, assert.isNotNumber, true).to.not.be.a('number');
};
assert.isFinite = function (val, msg) {
new Assertion(val, msg, assert.isFinite, true).to.be.finite;
};
assert.isBoolean = function (val, msg) {
new Assertion(val, msg, assert.isBoolean, true).to.be.a('boolean');
};
assert.isNotBoolean = function (val, msg) {
new Assertion(val, msg, assert.isNotBoolean, true).to.not.be.a('boolean');
};
assert.typeOf = function (val, type, msg) {
new Assertion(val, msg, assert.typeOf, true).to.be.a(type);
};
assert.notTypeOf = function (val, type, msg) {
new Assertion(val, msg, assert.notTypeOf, true).to.not.be.a(type);
};
assert.instanceOf = function (val, type, msg) {
new Assertion(val, msg, assert.instanceOf, true).to.be.instanceOf(type);
};
assert.notInstanceOf = function (val, type, msg) {
new Assertion(val, msg, assert.notInstanceOf, true).to.not.be.instanceOf(type);
};
assert.include = function (exp, inc, msg) {
new Assertion(exp, msg, assert.include, true).include(inc);
};
assert.notInclude = function (exp, inc, msg) {
new Assertion(exp, msg, assert.notInclude, true).not.include(inc);
};
assert.deepInclude = function (exp, inc, msg) {
new Assertion(exp, msg, assert.deepInclude, true).deep.include(inc);
};
assert.notDeepInclude = function (exp, inc, msg) {
new Assertion(exp, msg, assert.notDeepInclude, true).not.deep.include(inc);
};
assert.nestedInclude = function (exp, inc, msg) {
new Assertion(exp, msg, assert.nestedInclude, true).nested.include(inc);
};
assert.notNestedInclude = function (exp, inc, msg) {
new Assertion(exp, msg, assert.notNestedInclude, true).not.nested.include(inc);
};
assert.deepNestedInclude = function (exp, inc, msg) {
new Assertion(exp, msg, assert.deepNestedInclude, true).deep.nested.include(inc);
};
assert.notDeepNestedInclude = function (exp, inc, msg) {
new Assertion(exp, msg, assert.notDeepNestedInclude, true).not.deep.nested.include(inc);
};
assert.ownInclude = function (exp, inc, msg) {
new Assertion(exp, msg, assert.ownInclude, true).own.include(inc);
};
assert.notOwnInclude = function (exp, inc, msg) {
new Assertion(exp, msg, assert.notOwnInclude, true).not.own.include(inc);
};
assert.deepOwnInclude = function (exp, inc, msg) {
new Assertion(exp, msg, assert.deepOwnInclude, true).deep.own.include(inc);
};
assert.notDeepOwnInclude = function (exp, inc, msg) {
new Assertion(exp, msg, assert.notDeepOwnInclude, true).not.deep.own.include(inc);
};
assert.match = function (exp, re, msg) {
new Assertion(exp, msg, assert.match, true).to.match(re);
};
assert.notMatch = function (exp, re, msg) {
new Assertion(exp, msg, assert.notMatch, true).to.not.match(re);
};
assert.property = function (obj, prop, msg) {
new Assertion(obj, msg, assert.property, true).to.have.property(prop);
};
assert.notProperty = function (obj, prop, msg) {
new Assertion(obj, msg, assert.notProperty, true).to.not.have.property(prop);
};
assert.propertyVal = function (obj, prop, val, msg) {
new Assertion(obj, msg, assert.propertyVal, true).to.have.property(prop, val);
};
assert.notPropertyVal = function (obj, prop, val, msg) {
new Assertion(obj, msg, assert.notPropertyVal, true).to.not.have.property(prop, val);
};
assert.deepPropertyVal = function (obj, prop, val, msg) {
new Assertion(obj, msg, assert.deepPropertyVal, true).to.have.deep.property(prop, val);
};
assert.notDeepPropertyVal = function (obj, prop, val, msg) {
new Assertion(obj, msg, assert.notDeepPropertyVal, true).to.not.have.deep.property(prop, val);
};
assert.ownProperty = function (obj, prop, msg) {
new Assertion(obj, msg, assert.ownProperty, true).to.have.own.property(prop);
};
assert.notOwnProperty = function (obj, prop, msg) {
new Assertion(obj, msg, assert.notOwnProperty, true).to.not.have.own.property(prop);
};
assert.ownPropertyVal = function (obj, prop, value, msg) {
new Assertion(obj, msg, assert.ownPropertyVal, true).to.have.own.property(prop, value);
};
assert.notOwnPropertyVal = function (obj, prop, value, msg) {
new Assertion(obj, msg, assert.notOwnPropertyVal, true).to.not.have.own.property(prop, value);
};
assert.deepOwnPropertyVal = function (obj, prop, value, msg) {
new Assertion(obj, msg, assert.deepOwnPropertyVal, true).to.have.deep.own.property(prop, value);
};
assert.notDeepOwnPropertyVal = function (obj, prop, value, msg) {
new Assertion(obj, msg, assert.notDeepOwnPropertyVal, true).to.not.have.deep.own.property(prop, value);
};
assert.nestedProperty = function (obj, prop, msg) {
new Assertion(obj, msg, assert.nestedProperty, true).to.have.nested.property(prop);
};
assert.notNestedProperty = function (obj, prop, msg) {
new Assertion(obj, msg, assert.notNestedProperty, true).to.not.have.nested.property(prop);
};
assert.nestedPropertyVal = function (obj, prop, val, msg) {
new Assertion(obj, msg, assert.nestedPropertyVal, true).to.have.nested.property(prop, val);
};
assert.notNestedPropertyVal = function (obj, prop, val, msg) {
new Assertion(obj, msg, assert.notNestedPropertyVal, true).to.not.have.nested.property(prop, val);
};
assert.deepNestedPropertyVal = function (obj, prop, val, msg) {
new Assertion(obj, msg, assert.deepNestedPropertyVal, true).to.have.deep.nested.property(prop, val);
};
assert.notDeepNestedPropertyVal = function (obj, prop, val, msg) {
new Assertion(obj, msg, assert.notDeepNestedPropertyVal, true).to.not.have.deep.nested.property(prop, val);
};
assert.lengthOf = function (exp, len, msg) {
new Assertion(exp, msg, assert.lengthOf, true).to.have.lengthOf(len);
};
assert.hasAnyKeys = function (obj, keys, msg) {
new Assertion(obj, msg, assert.hasAnyKeys, true).to.have.any.keys(keys);
};
assert.hasAllKeys = function (obj, keys, msg) {
new Assertion(obj, msg, assert.hasAllKeys, true).to.have.all.keys(keys);
};
assert.containsAllKeys = function (obj, keys, msg) {
new Assertion(obj, msg, assert.containsAllKeys, true).to.contain.all.keys(keys);
};
assert.doesNotHaveAnyKeys = function (obj, keys, msg) {
new Assertion(obj, msg, assert.doesNotHaveAnyKeys, true).to.not.have.any.keys(keys);
};
assert.doesNotHaveAllKeys = function (obj, keys, msg) {
new Assertion(obj, msg, assert.doesNotHaveAllKeys, true).to.not.have.all.keys(keys);
};
assert.hasAnyDeepKeys = function (obj, keys, msg) {
new Assertion(obj, msg, assert.hasAnyDeepKeys, true).to.have.any.deep.keys(keys);
};
assert.hasAllDeepKeys = function (obj, keys, msg) {
new Assertion(obj, msg, assert.hasAllDeepKeys, true).to.have.all.deep.keys(keys);
};
assert.containsAllDeepKeys = function (obj, keys, msg) {
new Assertion(obj, msg, assert.containsAllDeepKeys, true).to.contain.all.deep.keys(keys);
};
assert.doesNotHaveAnyDeepKeys = function (obj, keys, msg) {
new Assertion(obj, msg, assert.doesNotHaveAnyDeepKeys, true).to.not.have.any.deep.keys(keys);
};
assert.doesNotHaveAllDeepKeys = function (obj, keys, msg) {
new Assertion(obj, msg, assert.doesNotHaveAllDeepKeys, true).to.not.have.all.deep.keys(keys);
};
assert.throws = function (fn, errorLike, errMsgMatcher, msg) {
if ('string' === typeof errorLike || errorLike instanceof RegExp) {
errMsgMatcher = errorLike;
errorLike = null;
}
var assertErr = new Assertion(fn, msg, assert.throws, true).to.throw(errorLike, errMsgMatcher);
return flag(assertErr, 'object');
};
assert.doesNotThrow = function (fn, errorLike, errMsgMatcher, msg) {
if ('string' === typeof errorLike || errorLike instanceof RegExp) {
errMsgMatcher = errorLike;
errorLike = null;
}
new Assertion(fn, msg, assert.doesNotThrow, true).to.not.throw(errorLike, errMsgMatcher);
};
assert.operator = function (val, operator, val2, msg) {
var ok;
switch (operator) {
case '==':
ok = val == val2;
break;
case '===':
ok = val === val2;
break;
case '>':
ok = val > val2;
break;
case '>=':
ok = val >= val2;
break;
case '<':
ok = val < val2;
break;
case '<=':
ok = val <= val2;
break;
case '!=':
ok = val != val2;
break;
case '!==':
ok = val !== val2;
break;
default:
msg = msg ? msg + ': ' : msg;
throw new chai.AssertionError(msg + 'Invalid operator "' + operator + '"', undefined, assert.operator);
}
var test = new Assertion(ok, msg, assert.operator, true);
test.assert(true === flag(test, 'object'), 'expected ' + util.inspect(val) + ' to be ' + operator + ' ' + util.inspect(val2), 'expected ' + util.inspect(val) + ' to not be ' + operator + ' ' + util.inspect(val2));
};
assert.closeTo = function (act, exp, delta, msg) {
new Assertion(act, msg, assert.closeTo, true).to.be.closeTo(exp, delta);
};
assert.approximately = function (act, exp, delta, msg) {
new Assertion(act, msg, assert.approximately, true).to.be.approximately(exp, delta);
};
assert.sameMembers = function (set1, set2, msg) {
new Assertion(set1, msg, assert.sameMembers, true).to.have.same.members(set2);
};
assert.notSameMembers = function (set1, set2, msg) {
new Assertion(set1, msg, assert.notSameMembers, true).to.not.have.same.members(set2);
};
assert.sameDeepMembers = function (set1, set2, msg) {
new Assertion(set1, msg, assert.sameDeepMembers, true).to.have.same.deep.members(set2);
};
assert.notSameDeepMembers = function (set1, set2, msg) {
new Assertion(set1, msg, assert.notSameDeepMembers, true).to.not.have.same.deep.members(set2);
};
assert.sameOrderedMembers = function (set1, set2, msg) {
new Assertion(set1, msg, assert.sameOrderedMembers, true).to.have.same.ordered.members(set2);
};
assert.notSameOrderedMembers = function (set1, set2, msg) {
new Assertion(set1, msg, assert.notSameOrderedMembers, true).to.not.have.same.ordered.members(set2);
};
assert.sameDeepOrderedMembers = function (set1, set2, msg) {
new Assertion(set1, msg, assert.sameDeepOrderedMembers, true).to.have.same.deep.ordered.members(set2);
};
assert.notSameDeepOrderedMembers = function (set1, set2, msg) {
new Assertion(set1, msg, assert.notSameDeepOrderedMembers, true).to.not.have.same.deep.ordered.members(set2);
};
assert.includeMembers = function (superset, subset, msg) {
new Assertion(superset, msg, assert.includeMembers, true).to.include.members(subset);
};
assert.notIncludeMembers = function (superset, subset, msg) {
new Assertion(superset, msg, assert.notIncludeMembers, true).to.not.include.members(subset);
};
assert.includeDeepMembers = function (superset, subset, msg) {
new Assertion(superset, msg, assert.includeDeepMembers, true).to.include.deep.members(subset);
};
assert.notIncludeDeepMembers = function (superset, subset, msg) {
new Assertion(superset, msg, assert.notIncludeDeepMembers, true).to.not.include.deep.members(subset);
};
assert.includeOrderedMembers = function (superset, subset, msg) {
new Assertion(superset, msg, assert.includeOrderedMembers, true).to.include.ordered.members(subset);
};
assert.notIncludeOrderedMembers = function (superset, subset, msg) {
new Assertion(superset, msg, assert.notIncludeOrderedMembers, true).to.not.include.ordered.members(subset);
};
assert.includeDeepOrderedMembers = function (superset, subset, msg) {
new Assertion(superset, msg, assert.includeDeepOrderedMembers, true).to.include.deep.ordered.members(subset);
};
assert.notIncludeDeepOrderedMembers = function (superset, subset, msg) {
new Assertion(superset, msg, assert.notIncludeDeepOrderedMembers, true).to.not.include.deep.ordered.members(subset);
};
assert.oneOf = function (inList, list, msg) {
new Assertion(inList, msg, assert.oneOf, true).to.be.oneOf(list);
};
assert.changes = function (fn, obj, prop, msg) {
if (arguments.length === 3 && typeof obj === 'function') {
msg = prop;
prop = null;
}
new Assertion(fn, msg, assert.changes, true).to.change(obj, prop);
};
assert.changesBy = function (fn, obj, prop, delta, msg) {
if (arguments.length === 4 && typeof obj === 'function') {
var tmpMsg = delta;
delta = prop;
msg = tmpMsg;
} else if (arguments.length === 3) {
delta = prop;
prop = null;
}
new Assertion(fn, msg, assert.changesBy, true).to.change(obj, prop).by(delta);
};
assert.doesNotChange = function (fn, obj, prop, msg) {
if (arguments.length === 3 && typeof obj === 'function') {
msg = prop;
prop = null;
}
return new Assertion(fn, msg, assert.doesNotChange, true).to.not.change(obj, prop);
};
assert.changesButNotBy = function (fn, obj, prop, delta, msg) {
if (arguments.length === 4 && typeof obj === 'function') {
var tmpMsg = delta;
delta = prop;
msg = tmpMsg;
} else if (arguments.length === 3) {
delta = prop;
prop = null;
}
new Assertion(fn, msg, assert.changesButNotBy, true).to.change(obj, prop).but.not.by(delta);
};
assert.increases = function (fn, obj, prop, msg) {
if (arguments.length === 3 && typeof obj === 'function') {
msg = prop;
prop = null;
}
return new Assertion(fn, msg, assert.increases, true).to.increase(obj, prop);
};
assert.increasesBy = function (fn, obj, prop, delta, msg) {
if (arguments.length === 4 && typeof obj === 'function') {
var tmpMsg = delta;
delta = prop;
msg = tmpMsg;
} else if (arguments.length === 3) {
delta = prop;
prop = null;
}
new Assertion(fn, msg, assert.increasesBy, true).to.increase(obj, prop).by(delta);
};
assert.doesNotIncrease = function (fn, obj, prop, msg) {
if (arguments.length === 3 && typeof obj === 'function') {
msg = prop;
prop = null;
}
return new Assertion(fn, msg, assert.doesNotIncrease, true).to.not.increase(obj, prop);
};
assert.increasesButNotBy = function (fn, obj, prop, delta, msg) {
if (arguments.length === 4 && typeof obj === 'function') {
var tmpMsg = delta;
delta = prop;
msg = tmpMsg;
} else if (arguments.length === 3) {
delta = prop;
prop = null;
}
new Assertion(fn, msg, assert.increasesButNotBy, true).to.increase(obj, prop).but.not.by(delta);
};
assert.decreases = function (fn, obj, prop, msg) {
if (arguments.length === 3 && typeof obj === 'function') {
msg = prop;
prop = null;
}
return new Assertion(fn, msg, assert.decreases, true).to.decrease(obj, prop);
};
assert.decreasesBy = function (fn, obj, prop, delta, msg) {
if (arguments.length === 4 && typeof obj === 'function') {
var tmpMsg = delta;
delta = prop;
msg = tmpMsg;
} else if (arguments.length === 3) {
delta = prop;
prop = null;
}
new Assertion(fn, msg, assert.decreasesBy, true).to.decrease(obj, prop).by(delta);
};
assert.doesNotDecrease = function (fn, obj, prop, msg) {
if (arguments.length === 3 && typeof obj === 'function') {
msg = prop;
prop = null;
}
return new Assertion(fn, msg, assert.doesNotDecrease, true).to.not.decrease(obj, prop);
};
assert.doesNotDecreaseBy = function (fn, obj, prop, delta, msg) {
if (arguments.length === 4 && typeof obj === 'function') {
var tmpMsg = delta;
delta = prop;
msg = tmpMsg;
} else if (arguments.length === 3) {
delta = prop;
prop = null;
}
return new Assertion(fn, msg, assert.doesNotDecreaseBy, true).to.not.decrease(obj, prop).by(delta);
};
assert.decreasesButNotBy = function (fn, obj, prop, delta, msg) {
if (arguments.length === 4 && typeof obj === 'function') {
var tmpMsg = delta;
delta = prop;
msg = tmpMsg;
} else if (arguments.length === 3) {
delta = prop;
prop = null;
}
new Assertion(fn, msg, assert.decreasesButNotBy, true).to.decrease(obj, prop).but.not.by(delta);
};
assert.ifError = function (val) {
if (val) {
throw (val);
}
};
assert.isExtensible = function (obj, msg) {
new Assertion(obj, msg, assert.isExtensible, true).to.be.extensible;
};
assert.isNotExtensible = function (obj, msg) {
new Assertion(obj, msg, assert.isNotExtensible, true).to.not.be.extensible;
};
assert.isSealed = function (obj, msg) {
new Assertion(obj, msg, assert.isSealed, true).to.be.sealed;
};
assert.isNotSealed = function (obj, msg) {
new Assertion(obj, msg, assert.isNotSealed, true).to.not.be.sealed;
};
assert.isFrozen = function (obj, msg) {
new Assertion(obj, msg, assert.isFrozen, true).to.be.frozen;
};
assert.isNotFrozen = function (obj, msg) {
new Assertion(obj, msg, assert.isNotFrozen, true).to.not.be.frozen;
};
assert.isEmpty = function (val, msg) {
new Assertion(val, msg, assert.isEmpty, true).to.be.empty;
};
assert.isNotEmpty = function (val, msg) {
new Assertion(val, msg, assert.isNotEmpty, true).to.not.be.empty;
};
(function alias(name, as) {
assert[as] = assert[name];
return alias;
})('isOk', 'ok')('isNotOk', 'notOk')('throws', 'throw')('throws', 'Throw')('isExtensible', 'extensible')('isNotExtensible', 'notExtensible')('isSealed', 'sealed')('isNotSealed', 'notSealed')('isFrozen', 'frozen')('isNotFrozen', 'notFrozen')('isEmpty', 'empty')('isNotEmpty', 'notEmpty');
};
return module.exports;
},
53: function (require, module, exports) {
'use strict';
var getPrototypeOfExists = typeof Object.getPrototypeOf === 'function';
var promiseExists = typeof Promise === 'function';
var globalObject = typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : self;
var isDom = ('location' in globalObject) && ('document' in globalObject);
var htmlElementExists = typeof HTMLElement !== 'undefined';
var isArrayExists = typeof Array.isArray === 'function';
var symbolExists = typeof Symbol !== 'undefined';
var mapExists = typeof Map !== 'undefined';
var setExists = typeof Set !== 'undefined';
var weakMapExists = typeof WeakMap !== 'undefined';
var weakSetExists = typeof WeakSet !== 'undefined';
var dataViewExists = typeof DataView !== 'undefined';
var symbolIteratorExists = symbolExists && typeof Symbol.iterator !== 'undefined';
var symbolToStringTagExists = symbolExists && typeof Symbol.toStringTag !== 'undefined';
var setEntriesExists = setExists && typeof Set.prototype.entries === 'function';
var mapEntriesExists = mapExists && typeof Map.prototype.entries === 'function';
var setIteratorPrototype = getPrototypeOfExists && setEntriesExists && Object.getPrototypeOf(new Set().entries());
var mapIteratorPrototype = getPrototypeOfExists && mapEntriesExists && Object.getPrototypeOf(new Map().entries());
var arrayIteratorExists = symbolIteratorExists && typeof Array.prototype[Symbol.iterator] === 'function';
var arrayIteratorPrototype = arrayIteratorExists && Object.getPrototypeOf([][Symbol.iterator]());
var stringIteratorExists = symbolIteratorExists && typeof Array.prototype[Symbol.iterator] === 'function';
var stringIteratorPrototype = stringIteratorExists && Object.getPrototypeOf(('')[Symbol.iterator]());
var toStringLeftSliceLength = 8;
var toStringRightSliceLength = -1;
module.exports = function typeDetect(obj) {
var typeofObj = typeof obj;
if (typeofObj !== 'object') {
return typeofObj;
}
if (obj === null) {
return 'null';
}
if (obj === globalObject) {
return 'global';
}
if (isArrayExists && Array.isArray(obj)) {
return 'Array';
}
if (isDom) {
if (obj === globalObject.location) {
return 'Location';
}
if (obj === globalObject.document) {
return 'Document';
}
if (obj === (globalObject.navigator || ({})).mimeTypes) {
return 'MimeTypeArray';
}
if (obj === (globalObject.navigator || ({})).plugins) {
return 'PluginArray';
}
if (htmlElementExists && obj instanceof HTMLElement && obj.tagName === 'BLOCKQUOTE') {
return 'HTMLQuoteElement';
}
if (htmlElementExists && obj instanceof HTMLElement && obj.tagName === 'TD') {
return 'HTMLTableDataCellElement';
}
if (htmlElementExists && obj instanceof HTMLElement && obj.tagName === 'TH') {
return 'HTMLTableHeaderCellElement';
}
}
var stringTag = (symbolToStringTagExists && obj[Symbol.toStringTag]);
if (typeof stringTag === 'string') {
return stringTag;
}
if (getPrototypeOfExists) {
var objPrototype = Object.getPrototypeOf(obj);
if (objPrototype === RegExp.prototype) {
return 'RegExp';
}
if (objPrototype === Date.prototype) {
return 'Date';
}
if (promiseExists && objPrototype === Promise.prototype) {
return 'Promise';
}
if (setExists && objPrototype === Set.prototype) {
return 'Set';
}
if (mapExists && objPrototype === Map.prototype) {
return 'Map';
}
if (weakSetExists && objPrototype === WeakSet.prototype) {
return 'WeakSet';
}
if (weakMapExists && objPrototype === WeakMap.prototype) {
return 'WeakMap';
}
if (dataViewExists && objPrototype === DataView.prototype) {
return 'DataView';
}
if (mapExists && objPrototype === mapIteratorPrototype) {
return 'Map Iterator';
}
if (setExists && objPrototype === setIteratorPrototype) {
return 'Set Iterator';
}
if (arrayIteratorExists && objPrototype === arrayIteratorPrototype) {
return 'Array Iterator';
}
if (stringIteratorExists && objPrototype === stringIteratorPrototype) {
return 'String Iterator';
}
if (objPrototype === null) {
return 'Object';
}
}
return Object.prototype.toString.call(obj).slice(toStringLeftSliceLength, toStringRightSliceLength);
};
module.exports.typeDetect = module.exports;
return module.exports;
},
54: function (require, module, exports) {
var exports;
module.exports = exports = {
defined: function (subject) {
return subject !== void 0;
},
array: function (subject) {
return subject instanceof Array;
},
object: function (subject) {
return typeof subject === 'object' && subject;
},
objectPlain: function (subject) {
return exports.object(subject) && Object.prototype.toString.call(subject) === '[object Object]' && subject.constructor === Object;
},
string: function (subject) {
return typeof subject === 'string';
},
number: function (subject) {
return typeof subject === 'number' && !isNaN(subject);
},
numberLoose: function (subject) {
return exports.number(subject) || exports.string(subject) && exports.number(Number(subject));
},
"function": function (subject) {
return typeof subject === 'function';
},
iterable: function (subject) {
return exports.object(subject) && exports.number(subject.length);
}
};
return module.exports;
},
55: function (require, module, exports) {
var exports;
module.exports = exports = {
domDoc: function (subject) {
return subject && subject.nodeType === 9;
},
domEl: function (subject) {
return subject && subject.nodeType === 1;
},
domText: function (subject) {
return subject && subject.nodeType === 3;
},
domNode: function (subject) {
return exports.domEl(subject) || exports.domText(subject);
},
domTextarea: function (subject) {
return subject && subject.nodeName === 'TEXTAREA';
},
domInput: function (subject) {
return subject && subject.nodeName === 'INPUT';
},
domSelect: function (subject) {
return subject && subject.nodeName === 'SELECT';
},
domField: function (subject) {
return exports.domInput(subject) || exports.domTextarea(subject) || exports.domSelect(subject);
}
};
return module.exports;
},
56: function (require, module, exports) {
var StateChain;
module.exports = StateChain = (function () {
function StateChain(states) {
this.string = states.join('+');
this.array = states.slice();
this.length = states.length;
}
StateChain.prototype.includes = function (target) {
var i, len, ref, state;
ref = this.array;
for ((i = 0, len = ref.length); i < len; i++) {
state = ref[i];
if (state === target) {
return true;
}
}
return false;
};
StateChain.prototype.without = function (target) {
return this.array.filter(function (state) {
return state !== target;
}).join('+');
};
StateChain.prototype.isApplicable = function (target, otherActive) {
var active;
active = this.array.filter(function (state) {
return state === target || otherActive.indexOf(state) !== -1;
});
return active.length === this.array.length;
};
return StateChain;
})();
return module.exports;
},
57: function (require, module, exports) {
'use strict';
function hasProperty(obj, name) {
if (typeof obj === 'undefined' || obj === null) {
return false;
}
return (name in Object(obj));
}
function parsePath(path) {
var str = path.replace(/([^\\])\[/g, '$1.[');
var parts = str.match(/(\\\.|[^.]+?)+/g);
return parts.map(function mapMatches(value) {
var regexp = /^\[(\d+)\]$/;
var mArr = regexp.exec(value);
var parsed = null;
if (mArr) {
parsed = {
i: parseFloat(mArr[1])
};
} else {
parsed = {
p: value.replace(/\\([.\[\]])/g, '$1')
};
}
return parsed;
});
}
function internalGetPathValue(obj, parsed, pathDepth) {
var temporaryValue = obj;
var res = null;
pathDepth = (typeof pathDepth === 'undefined' ? parsed.length : pathDepth);
for (var i = 0; i < pathDepth; i++) {
var part = parsed[i];
if (temporaryValue) {
if (typeof part.p === 'undefined') {
temporaryValue = temporaryValue[part.i];
} else {
temporaryValue = temporaryValue[part.p];
}
if (i === (pathDepth - 1)) {
res = temporaryValue;
}
}
}
return res;
}
function internalSetPathValue(obj, val, parsed) {
var tempObj = obj;
var pathDepth = parsed.length;
var part = null;
for (var i = 0; i < pathDepth; i++) {
var propName = null;
var propVal = null;
part = parsed[i];
if (i === (pathDepth - 1)) {
propName = typeof part.p === 'undefined' ? part.i : part.p;
tempObj[propName] = val;
} else if (typeof part.p !== 'undefined' && tempObj[part.p]) {
tempObj = tempObj[part.p];
} else if (typeof part.i !== 'undefined' && tempObj[part.i]) {
tempObj = tempObj[part.i];
} else {
var next = parsed[i + 1];
propName = typeof part.p === 'undefined' ? part.i : part.p;
propVal = typeof next.p === 'undefined' ? [] : {};
tempObj[propName] = propVal;
tempObj = tempObj[propName];
}
}
}
function getPathInfo(obj, path) {
var parsed = parsePath(path);
var last = parsed[parsed.length - 1];
var info = {
parent: parsed.length > 1 ? internalGetPathValue(obj, parsed, parsed.length - 1) : obj,
name: last.p || last.i,
value: internalGetPathValue(obj, parsed)
};
info.exists = hasProperty(info.parent, info.name);
return info;
}
function getPathValue(obj, path) {
var info = getPathInfo(obj, path);
return info.value;
}
function setPathValue(obj, path, val) {
var parsed = parsePath(path);
internalSetPathValue(obj, val, parsed);
return obj;
}
module.exports = {
hasProperty: hasProperty,
getPathInfo: getPathInfo,
getPathValue: getPathValue,
setPathValue: setPathValue
};
return module.exports;
},
58: function (require, module, exports) {
var flag = require(64);
module.exports = function test(obj, args) {
var negate = flag(obj, 'negate'), expr = args[0];
return negate ? !expr : expr;
};
return module.exports;
},
59: function (require, module, exports) {
var AssertionError = require(45);
var flag = require(64);
var type = require(25);
module.exports = function expectTypes(obj, types) {
var flagMsg = flag(obj, 'message');
var ssfi = flag(obj, 'ssfi');
flagMsg = flagMsg ? flagMsg + ': ' : '';
obj = flag(obj, 'object');
types = types.map(function (t) {
return t.toLowerCase();
});
types.sort();
var str = types.map(function (t, index) {
var art = ~['a', 'e', 'i', 'o', 'u'].indexOf(t.charAt(0)) ? 'an' : 'a';
var or = types.length > 1 && index === types.length - 1 ? 'or ' : '';
return or + art + ' ' + t;
}).join(', ');
var objType = type(obj).toLowerCase();
if (!types.some(function (expected) {
return objType === expected;
})) {
throw new AssertionError(flagMsg + 'object tested must be ' + str + ', but ' + objType + ' given', undefined, ssfi);
}
};
return module.exports;
},
60: function (require, module, exports) {
var flag = require(64), getActual = require(61), inspect = require(62), objDisplay = require(63);
module.exports = function getMessage(obj, args) {
var negate = flag(obj, 'negate'), val = flag(obj, 'object'), expected = args[3], actual = getActual(obj, args), msg = negate ? args[2] : args[1], flagMsg = flag(obj, 'message');
if (typeof msg === "function") msg = msg();
msg = msg || '';
msg = msg.replace(/#\{this\}/g, function () {
return objDisplay(val);
}).replace(/#\{act\}/g, function () {
return objDisplay(actual);
}).replace(/#\{exp\}/g, function () {
return objDisplay(expected);
});
return flagMsg ? flagMsg + ': ' + msg : msg;
};
return module.exports;
},
61: function (require, module, exports) {
module.exports = function getActual(obj, args) {
return args.length > 4 ? args[4] : obj._obj;
};
return module.exports;
},
62: function (require, module, exports) {
var getName = require(67);
var getProperties = require(82);
var getEnumerableProperties = require(83);
var config = require(47);
module.exports = inspect;
function inspect(obj, showHidden, depth, colors) {
var ctx = {
showHidden: showHidden,
seen: [],
stylize: function (str) {
return str;
}
};
return formatValue(ctx, obj, (typeof depth === 'undefined' ? 2 : depth));
}
var isDOMElement = function (object) {
if (typeof HTMLElement === 'object') {
return object instanceof HTMLElement;
} else {
return object && typeof object === 'object' && ('nodeType' in object) && object.nodeType === 1 && typeof object.nodeName === 'string';
}
};
function formatValue(ctx, value, recurseTimes) {
if (value && typeof value.inspect === 'function' && value.inspect !== exports.inspect && !(value.constructor && value.constructor.prototype === value)) {
var ret = value.inspect(recurseTimes, ctx);
if (typeof ret !== 'string') {
ret = formatValue(ctx, ret, recurseTimes);
}
return ret;
}
var primitive = formatPrimitive(ctx, value);
if (primitive) {
return primitive;
}
if (isDOMElement(value)) {
if (('outerHTML' in value)) {
return value.outerHTML;
} else {
try {
if (document.xmlVersion) {
var xmlSerializer = new XMLSerializer();
return xmlSerializer.serializeToString(value);
} else {
var ns = "http://www.w3.org/1999/xhtml";
var container = document.createElementNS(ns, '_');
container.appendChild(value.cloneNode(false));
var html = container.innerHTML.replace('><', '>' + value.innerHTML + '<');
container.innerHTML = '';
return html;
}
} catch (err) {}
}
}
var visibleKeys = getEnumerableProperties(value);
var keys = ctx.showHidden ? getProperties(value) : visibleKeys;
var name, nameSuffix;
if (keys.length === 0 || (isError(value) && ((keys.length === 1 && keys[0] === 'stack') || (keys.length === 2 && keys[0] === 'description' && keys[1] === 'stack')))) {
if (typeof value === 'function') {
name = getName(value);
nameSuffix = name ? ': ' + name : '';
return ctx.stylize('[Function' + nameSuffix + ']', 'special');
}
if (isRegExp(value)) {
return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
}
if (isDate(value)) {
return ctx.stylize(Date.prototype.toUTCString.call(value), 'date');
}
if (isError(value)) {
return formatError(value);
}
}
var base = '', array = false, typedArray = false, braces = ['{', '}'];
if (isTypedArray(value)) {
typedArray = true;
braces = ['[', ']'];
}
if (isArray(value)) {
array = true;
braces = ['[', ']'];
}
if (typeof value === 'function') {
name = getName(value);
nameSuffix = name ? ': ' + name : '';
base = ' [Function' + nameSuffix + ']';
}
if (isRegExp(value)) {
base = ' ' + RegExp.prototype.toString.call(value);
}
if (isDate(value)) {
base = ' ' + Date.prototype.toUTCString.call(value);
}
if (isError(value)) {
return formatError(value);
}
if (keys.length === 0 && (!array || value.length == 0)) {
return braces[0] + base + braces[1];
}
if (recurseTimes < 0) {
if (isRegExp(value)) {
return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
} else {
return ctx.stylize('[Object]', 'special');
}
}
ctx.seen.push(value);
var output;
if (array) {
output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
} else if (typedArray) {
return formatTypedArray(value);
} else {
output = keys.map(function (key) {
return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
});
}
ctx.seen.pop();
return reduceToSingleString(output, base, braces);
}
function formatPrimitive(ctx, value) {
switch (typeof value) {
case 'undefined':
return ctx.stylize('undefined', 'undefined');
case 'string':
var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '').replace(/'/g, "\\'").replace(/\\"/g, '"') + '\'';
return ctx.stylize(simple, 'string');
case 'number':
if (value === 0 && (1 / value) === -Infinity) {
return ctx.stylize('-0', 'number');
}
return ctx.stylize('' + value, 'number');
case 'boolean':
return ctx.stylize('' + value, 'boolean');
case 'symbol':
return ctx.stylize(value.toString(), 'symbol');
}
if (value === null) {
return ctx.stylize('null', 'null');
}
}
function formatError(value) {
return '[' + Error.prototype.toString.call(value) + ']';
}
function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
var output = [];
for (var i = 0, l = value.length; i < l; ++i) {
if (Object.prototype.hasOwnProperty.call(value, String(i))) {
output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, String(i), true));
} else {
output.push('');
}
}
keys.forEach(function (key) {
if (!key.match(/^\d+$/)) {
output.push(formatProperty(ctx, value, recurseTimes, visibleKeys, key, true));
}
});
return output;
}
function formatTypedArray(value) {
var str = '[ ';
for (var i = 0; i < value.length; ++i) {
if (str.length >= config.truncateThreshold - 7) {
str += '...';
break;
}
str += value[i] + ', ';
}
str += ' ]';
if (str.indexOf(',  ]') !== -1) {
str = str.replace(',  ]', ' ]');
}
return str;
}
function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
var name;
var propDescriptor = Object.getOwnPropertyDescriptor(value, key);
var str;
if (propDescriptor) {
if (propDescriptor.get) {
if (propDescriptor.set) {
str = ctx.stylize('[Getter/Setter]', 'special');
} else {
str = ctx.stylize('[Getter]', 'special');
}
} else {
if (propDescriptor.set) {
str = ctx.stylize('[Setter]', 'special');
}
}
}
if (visibleKeys.indexOf(key) < 0) {
name = '[' + key + ']';
}
if (!str) {
if (ctx.seen.indexOf(value[key]) < 0) {
if (recurseTimes === null) {
str = formatValue(ctx, value[key], null);
} else {
str = formatValue(ctx, value[key], recurseTimes - 1);
}
if (str.indexOf('\n') > -1) {
if (array) {
str = str.split('\n').map(function (line) {
return '  ' + line;
}).join('\n').substr(2);
} else {
str = '\n' + str.split('\n').map(function (line) {
return '   ' + line;
}).join('\n');
}
}
} else {
str = ctx.stylize('[Circular]', 'special');
}
}
if (typeof name === 'undefined') {
if (array && key.match(/^\d+$/)) {
return str;
}
name = JSON.stringify('' + key);
if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
name = name.substr(1, name.length - 2);
name = ctx.stylize(name, 'name');
} else {
name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
name = ctx.stylize(name, 'string');
}
}
return name + ': ' + str;
}
function reduceToSingleString(output, base, braces) {
var numLinesEst = 0;
var length = output.reduce(function (prev, cur) {
numLinesEst++;
if (cur.indexOf('\n') >= 0) numLinesEst++;
return prev + cur.length + 1;
}, 0);
if (length > 60) {
return braces[0] + (base === '' ? '' : base + '\n ') + ' ' + output.join(',\n  ') + ' ' + braces[1];
}
return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
}
function isTypedArray(ar) {
return (typeof ar === 'object' && (/\w+Array]$/).test(objectToString(ar)));
}
function isArray(ar) {
return Array.isArray(ar) || (typeof ar === 'object' && objectToString(ar) === '[object Array]');
}
function isRegExp(re) {
return typeof re === 'object' && objectToString(re) === '[object RegExp]';
}
function isDate(d) {
return typeof d === 'object' && objectToString(d) === '[object Date]';
}
function isError(e) {
return typeof e === 'object' && objectToString(e) === '[object Error]';
}
function objectToString(o) {
return Object.prototype.toString.call(o);
}
return module.exports;
},
63: function (require, module, exports) {
var inspect = require(62);
var config = require(47);
module.exports = function objDisplay(obj) {
var str = inspect(obj), type = Object.prototype.toString.call(obj);
if (config.truncateThreshold && str.length >= config.truncateThreshold) {
if (type === '[object Function]') {
return !obj.name || obj.name === '' ? '[Function]' : '[Function: ' + obj.name + ']';
} else if (type === '[object Array]') {
return '[ Array(' + obj.length + ') ]';
} else if (type === '[object Object]') {
var keys = Object.keys(obj), kstr = keys.length > 2 ? keys.splice(0, 2).join(', ') + ', ...' : keys.join(', ');
return '{ Object (' + kstr + ') }';
} else {
return str;
}
} else {
return str;
}
};
return module.exports;
},
64: function (require, module, exports) {
module.exports = function flag(obj, key, value) {
var flags = obj.__flags || (obj.__flags = Object.create(null));
if (arguments.length === 3) {
flags[key] = value;
} else {
return flags[key];
}
};
return module.exports;
},
65: function (require, module, exports) {
module.exports = function transferFlags(assertion, object, includeAll) {
var flags = assertion.__flags || (assertion.__flags = Object.create(null));
if (!object.__flags) {
object.__flags = Object.create(null);
}
includeAll = arguments.length === 3 ? includeAll : true;
for (var flag in flags) {
if (includeAll || (flag !== 'object' && flag !== 'ssfi' && flag !== 'lockSsfi' && flag != 'message')) {
object.__flags[flag] = flags[flag];
}
}
};
return module.exports;
},
66: function (require, module, exports) {
'use strict';
var type = require(25);
function FakeMap() {
this._key = 'chai/deep-eql__' + Math.random() + Date.now();
}
FakeMap.prototype = {
get: function getMap(key) {
return key[this._key];
},
set: function setMap(key, value) {
if (Object.isExtensible(key)) {
Object.defineProperty(key, this._key, {
value: value,
configurable: true
});
}
}
};
var MemoizeMap = typeof WeakMap === 'function' ? WeakMap : FakeMap;
function memoizeCompare(leftHandOperand, rightHandOperand, memoizeMap) {
if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
return null;
}
var leftHandMap = memoizeMap.get(leftHandOperand);
if (leftHandMap) {
var result = leftHandMap.get(rightHandOperand);
if (typeof result === 'boolean') {
return result;
}
}
return null;
}
function memoizeSet(leftHandOperand, rightHandOperand, memoizeMap, result) {
if (!memoizeMap || isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
return;
}
var leftHandMap = memoizeMap.get(leftHandOperand);
if (leftHandMap) {
leftHandMap.set(rightHandOperand, result);
} else {
leftHandMap = new MemoizeMap();
leftHandMap.set(rightHandOperand, result);
memoizeMap.set(leftHandOperand, leftHandMap);
}
}
module.exports = deepEqual;
module.exports.MemoizeMap = MemoizeMap;
function deepEqual(leftHandOperand, rightHandOperand, options) {
if (options && options.comparator) {
return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
}
var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
if (simpleResult !== null) {
return simpleResult;
}
return extensiveDeepEqual(leftHandOperand, rightHandOperand, options);
}
function simpleEqual(leftHandOperand, rightHandOperand) {
if (leftHandOperand === rightHandOperand) {
return leftHandOperand !== 0 || 1 / leftHandOperand === 1 / rightHandOperand;
}
if (leftHandOperand !== leftHandOperand && rightHandOperand !== rightHandOperand) {
return true;
}
if (isPrimitive(leftHandOperand) || isPrimitive(rightHandOperand)) {
return false;
}
return null;
}
function extensiveDeepEqual(leftHandOperand, rightHandOperand, options) {
options = options || ({});
options.memoize = options.memoize === false ? false : options.memoize || new MemoizeMap();
var comparator = options && options.comparator;
var memoizeResultLeft = memoizeCompare(leftHandOperand, rightHandOperand, options.memoize);
if (memoizeResultLeft !== null) {
return memoizeResultLeft;
}
var memoizeResultRight = memoizeCompare(rightHandOperand, leftHandOperand, options.memoize);
if (memoizeResultRight !== null) {
return memoizeResultRight;
}
if (comparator) {
var comparatorResult = comparator(leftHandOperand, rightHandOperand);
if (comparatorResult === false || comparatorResult === true) {
memoizeSet(leftHandOperand, rightHandOperand, options.memoize, comparatorResult);
return comparatorResult;
}
var simpleResult = simpleEqual(leftHandOperand, rightHandOperand);
if (simpleResult !== null) {
return simpleResult;
}
}
var leftHandType = type(leftHandOperand);
if (leftHandType !== type(rightHandOperand)) {
memoizeSet(leftHandOperand, rightHandOperand, options.memoize, false);
return false;
}
memoizeSet(leftHandOperand, rightHandOperand, options.memoize, true);
var result = extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options);
memoizeSet(leftHandOperand, rightHandOperand, options.memoize, result);
return result;
}
function extensiveDeepEqualByType(leftHandOperand, rightHandOperand, leftHandType, options) {
switch (leftHandType) {
case 'String':
case 'Number':
case 'Boolean':
case 'Date':
return deepEqual(leftHandOperand.valueOf(), rightHandOperand.valueOf());
case 'Promise':
case 'Symbol':
case 'function':
case 'WeakMap':
case 'WeakSet':
case 'Error':
return leftHandOperand === rightHandOperand;
case 'Arguments':
case 'Int8Array':
case 'Uint8Array':
case 'Uint8ClampedArray':
case 'Int16Array':
case 'Uint16Array':
case 'Int32Array':
case 'Uint32Array':
case 'Float32Array':
case 'Float64Array':
case 'Array':
return iterableEqual(leftHandOperand, rightHandOperand, options);
case 'RegExp':
return regexpEqual(leftHandOperand, rightHandOperand);
case 'Generator':
return generatorEqual(leftHandOperand, rightHandOperand, options);
case 'DataView':
return iterableEqual(new Uint8Array(leftHandOperand.buffer), new Uint8Array(rightHandOperand.buffer), options);
case 'ArrayBuffer':
return iterableEqual(new Uint8Array(leftHandOperand), new Uint8Array(rightHandOperand), options);
case 'Set':
return entriesEqual(leftHandOperand, rightHandOperand, options);
case 'Map':
return entriesEqual(leftHandOperand, rightHandOperand, options);
default:
return objectEqual(leftHandOperand, rightHandOperand, options);
}
}
function regexpEqual(leftHandOperand, rightHandOperand) {
return leftHandOperand.toString() === rightHandOperand.toString();
}
function entriesEqual(leftHandOperand, rightHandOperand, options) {
if (leftHandOperand.size !== rightHandOperand.size) {
return false;
}
if (leftHandOperand.size === 0) {
return true;
}
var leftHandItems = [];
var rightHandItems = [];
leftHandOperand.forEach(function gatherEntries(key, value) {
leftHandItems.push([key, value]);
});
rightHandOperand.forEach(function gatherEntries(key, value) {
rightHandItems.push([key, value]);
});
return iterableEqual(leftHandItems.sort(), rightHandItems.sort(), options);
}
function iterableEqual(leftHandOperand, rightHandOperand, options) {
var length = leftHandOperand.length;
if (length !== rightHandOperand.length) {
return false;
}
if (length === 0) {
return true;
}
var index = -1;
while (++index < length) {
if (deepEqual(leftHandOperand[index], rightHandOperand[index], options) === false) {
return false;
}
}
return true;
}
function generatorEqual(leftHandOperand, rightHandOperand, options) {
return iterableEqual(getGeneratorEntries(leftHandOperand), getGeneratorEntries(rightHandOperand), options);
}
function hasIteratorFunction(target) {
return typeof Symbol !== 'undefined' && typeof target === 'object' && typeof Symbol.iterator !== 'undefined' && typeof target[Symbol.iterator] === 'function';
}
function getIteratorEntries(target) {
if (hasIteratorFunction(target)) {
try {
return getGeneratorEntries(target[Symbol.iterator]());
} catch (iteratorError) {
return [];
}
}
return [];
}
function getGeneratorEntries(generator) {
var generatorResult = generator.next();
var accumulator = [generatorResult.value];
while (generatorResult.done === false) {
generatorResult = generator.next();
accumulator.push(generatorResult.value);
}
return accumulator;
}
function getEnumerableKeys(target) {
var keys = [];
for (var key in target) {
keys.push(key);
}
return keys;
}
function keysEqual(leftHandOperand, rightHandOperand, keys, options) {
var length = keys.length;
if (length === 0) {
return true;
}
for (var i = 0; i < length; i += 1) {
if (deepEqual(leftHandOperand[keys[i]], rightHandOperand[keys[i]], options) === false) {
return false;
}
}
return true;
}
function objectEqual(leftHandOperand, rightHandOperand, options) {
var leftHandKeys = getEnumerableKeys(leftHandOperand);
var rightHandKeys = getEnumerableKeys(rightHandOperand);
if (leftHandKeys.length && leftHandKeys.length === rightHandKeys.length) {
leftHandKeys.sort();
rightHandKeys.sort();
if (iterableEqual(leftHandKeys, rightHandKeys) === false) {
return false;
}
return keysEqual(leftHandOperand, rightHandOperand, leftHandKeys, options);
}
var leftHandEntries = getIteratorEntries(leftHandOperand);
var rightHandEntries = getIteratorEntries(rightHandOperand);
if (leftHandEntries.length && leftHandEntries.length === rightHandEntries.length) {
leftHandEntries.sort();
rightHandEntries.sort();
return iterableEqual(leftHandEntries, rightHandEntries, options);
}
if (leftHandKeys.length === 0 && leftHandEntries.length === 0 && rightHandKeys.length === 0 && rightHandEntries.length === 0) {
return true;
}
return false;
}
function isPrimitive(value) {
return value === null || typeof value !== 'object';
}
return module.exports;
},
67: function (require, module, exports) {
'use strict';
var toString = Function.prototype.toString;
var functionNameMatch = /\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\s\(\/]+)/;
function getFuncName(aFunc) {
if (typeof aFunc !== 'function') {
return null;
}
var name = '';
if (typeof Function.prototype.name === 'undefined' && typeof aFunc.name === 'undefined') {
var match = toString.call(aFunc).match(functionNameMatch);
if (match) {
name = match[1];
}
} else {
name = aFunc.name;
}
return name;
}
module.exports = getFuncName;
return module.exports;
},
68: function (require, module, exports) {
var chai = require(23);
var flag = require(64);
var isProxyEnabled = require(80);
var transferFlags = require(65);
module.exports = function addProperty(ctx, name, getter) {
getter = getter === undefined ? function () {} : getter;
Object.defineProperty(ctx, name, {
get: function propertyGetter() {
if (!isProxyEnabled() && !flag(this, 'lockSsfi')) {
flag(this, 'ssfi', propertyGetter);
}
var result = getter.call(this);
if (result !== undefined) return result;
var newAssertion = new chai.Assertion();
transferFlags(this, newAssertion);
return newAssertion;
},
configurable: true
});
};
return module.exports;
},
69: function (require, module, exports) {
var addLengthGuard = require(79);
var chai = require(23);
var flag = require(64);
var proxify = require(78);
var transferFlags = require(65);
module.exports = function addMethod(ctx, name, method) {
var methodWrapper = function () {
if (!flag(this, 'lockSsfi')) {
flag(this, 'ssfi', methodWrapper);
}
var result = method.apply(this, arguments);
if (result !== undefined) return result;
var newAssertion = new chai.Assertion();
transferFlags(this, newAssertion);
return newAssertion;
};
addLengthGuard(methodWrapper, name, false);
ctx[name] = proxify(methodWrapper, name);
};
return module.exports;
},
70: function (require, module, exports) {
var chai = require(23);
var flag = require(64);
var isProxyEnabled = require(80);
var transferFlags = require(65);
module.exports = function overwriteProperty(ctx, name, getter) {
var _get = Object.getOwnPropertyDescriptor(ctx, name), _super = function () {};
if (_get && 'function' === typeof _get.get) _super = _get.get;
Object.defineProperty(ctx, name, {
get: function overwritingPropertyGetter() {
if (!isProxyEnabled() && !flag(this, 'lockSsfi')) {
flag(this, 'ssfi', overwritingPropertyGetter);
}
var origLockSsfi = flag(this, 'lockSsfi');
flag(this, 'lockSsfi', true);
var result = getter(_super).call(this);
flag(this, 'lockSsfi', origLockSsfi);
if (result !== undefined) {
return result;
}
var newAssertion = new chai.Assertion();
transferFlags(this, newAssertion);
return newAssertion;
},
configurable: true
});
};
return module.exports;
},
71: function (require, module, exports) {
var addLengthGuard = require(79);
var chai = require(23);
var flag = require(64);
var proxify = require(78);
var transferFlags = require(65);
module.exports = function overwriteMethod(ctx, name, method) {
var _method = ctx[name], _super = function () {
throw new Error(name + ' is not a function');
};
if (_method && 'function' === typeof _method) _super = _method;
var overwritingMethodWrapper = function () {
if (!flag(this, 'lockSsfi')) {
flag(this, 'ssfi', overwritingMethodWrapper);
}
var origLockSsfi = flag(this, 'lockSsfi');
flag(this, 'lockSsfi', true);
var result = method(_super).apply(this, arguments);
flag(this, 'lockSsfi', origLockSsfi);
if (result !== undefined) {
return result;
}
var newAssertion = new chai.Assertion();
transferFlags(this, newAssertion);
return newAssertion;
};
addLengthGuard(overwritingMethodWrapper, name, false);
ctx[name] = proxify(overwritingMethodWrapper, name);
};
return module.exports;
},
72: function (require, module, exports) {
var addLengthGuard = require(79);
var chai = require(23);
var flag = require(64);
var proxify = require(78);
var transferFlags = require(65);
var canSetPrototype = typeof Object.setPrototypeOf === 'function';
var testFn = function () {};
var excludeNames = Object.getOwnPropertyNames(testFn).filter(function (name) {
var propDesc = Object.getOwnPropertyDescriptor(testFn, name);
if (typeof propDesc !== 'object') return true;
return !propDesc.configurable;
});
var call = Function.prototype.call, apply = Function.prototype.apply;
module.exports = function addChainableMethod(ctx, name, method, chainingBehavior) {
if (typeof chainingBehavior !== 'function') {
chainingBehavior = function () {};
}
var chainableBehavior = {
method: method,
chainingBehavior: chainingBehavior
};
if (!ctx.__methods) {
ctx.__methods = {};
}
ctx.__methods[name] = chainableBehavior;
Object.defineProperty(ctx, name, {
get: function chainableMethodGetter() {
chainableBehavior.chainingBehavior.call(this);
var chainableMethodWrapper = function () {
if (!flag(this, 'lockSsfi')) {
flag(this, 'ssfi', chainableMethodWrapper);
}
var result = chainableBehavior.method.apply(this, arguments);
if (result !== undefined) {
return result;
}
var newAssertion = new chai.Assertion();
transferFlags(this, newAssertion);
return newAssertion;
};
addLengthGuard(chainableMethodWrapper, name, true);
if (canSetPrototype) {
var prototype = Object.create(this);
prototype.call = call;
prototype.apply = apply;
Object.setPrototypeOf(chainableMethodWrapper, prototype);
} else {
var asserterNames = Object.getOwnPropertyNames(ctx);
asserterNames.forEach(function (asserterName) {
if (excludeNames.indexOf(asserterName) !== -1) {
return;
}
var pd = Object.getOwnPropertyDescriptor(ctx, asserterName);
Object.defineProperty(chainableMethodWrapper, asserterName, pd);
});
}
transferFlags(this, chainableMethodWrapper);
return proxify(chainableMethodWrapper);
},
configurable: true
});
};
return module.exports;
},
73: function (require, module, exports) {
var chai = require(23);
var transferFlags = require(65);
module.exports = function overwriteChainableMethod(ctx, name, method, chainingBehavior) {
var chainableBehavior = ctx.__methods[name];
var _chainingBehavior = chainableBehavior.chainingBehavior;
chainableBehavior.chainingBehavior = function overwritingChainableMethodGetter() {
var result = chainingBehavior(_chainingBehavior).call(this);
if (result !== undefined) {
return result;
}
var newAssertion = new chai.Assertion();
transferFlags(this, newAssertion);
return newAssertion;
};
var _method = chainableBehavior.method;
chainableBehavior.method = function overwritingChainableMethodWrapper() {
var result = method(_method).apply(this, arguments);
if (result !== undefined) {
return result;
}
var newAssertion = new chai.Assertion();
transferFlags(this, newAssertion);
return newAssertion;
};
};
return module.exports;
},
74: function (require, module, exports) {
var inspect = require(62);
module.exports = function compareByInspect(a, b) {
return inspect(a) < inspect(b) ? -1 : 1;
};
return module.exports;
},
75: function (require, module, exports) {
module.exports = function getOwnEnumerablePropertySymbols(obj) {
if (typeof Object.getOwnPropertySymbols !== 'function') return [];
return Object.getOwnPropertySymbols(obj).filter(function (sym) {
return Object.getOwnPropertyDescriptor(obj, sym).enumerable;
});
};
return module.exports;
},
76: function (require, module, exports) {
var getOwnEnumerablePropertySymbols = require(75);
module.exports = function getOwnEnumerableProperties(obj) {
return Object.keys(obj).concat(getOwnEnumerablePropertySymbols(obj));
};
return module.exports;
},
77: function (require, module, exports) {
'use strict';
function compatibleInstance(thrown, errorLike) {
return errorLike instanceof Error && thrown === errorLike;
}
function compatibleConstructor(thrown, errorLike) {
if (errorLike instanceof Error) {
return thrown.constructor === errorLike.constructor || thrown instanceof errorLike.constructor;
} else if (errorLike.prototype instanceof Error || errorLike === Error) {
return thrown.constructor === errorLike || thrown instanceof errorLike;
}
return false;
}
function compatibleMessage(thrown, errMatcher) {
var comparisonString = typeof thrown === 'string' ? thrown : thrown.message;
if (errMatcher instanceof RegExp) {
return errMatcher.test(comparisonString);
} else if (typeof errMatcher === 'string') {
return comparisonString.indexOf(errMatcher) !== -1;
}
return false;
}
var functionNameMatch = /\s*function(?:\s|\s*\/\*[^(?:*\/)]+\*\/\s*)*([^\(\/]+)/;
function getFunctionName(constructorFn) {
var name = '';
if (typeof constructorFn.name === 'undefined') {
var match = String(constructorFn).match(functionNameMatch);
if (match) {
name = match[1];
}
} else {
name = constructorFn.name;
}
return name;
}
function getConstructorName(errorLike) {
var constructorName = errorLike;
if (errorLike instanceof Error) {
constructorName = getFunctionName(errorLike.constructor);
} else if (typeof errorLike === 'function') {
constructorName = getFunctionName(errorLike).trim() || getFunctionName(new errorLike());
}
return constructorName;
}
function getMessage(errorLike) {
var msg = '';
if (errorLike && errorLike.message) {
msg = errorLike.message;
} else if (typeof errorLike === 'string') {
msg = errorLike;
}
return msg;
}
module.exports = {
compatibleInstance: compatibleInstance,
compatibleConstructor: compatibleConstructor,
compatibleMessage: compatibleMessage,
getMessage: getMessage,
getConstructorName: getConstructorName
};
return module.exports;
},
78: function (require, module, exports) {
var config = require(47);
var flag = require(64);
var getProperties = require(82);
var isProxyEnabled = require(80);
var builtins = ['__flags', '__methods', '_obj', 'assert'];
module.exports = function proxify(obj, nonChainableMethodName) {
if (!isProxyEnabled()) return obj;
return new Proxy(obj, {
get: function proxyGetter(target, property) {
if (typeof property === 'string' && config.proxyExcludedKeys.indexOf(property) === -1 && !Reflect.has(target, property)) {
if (nonChainableMethodName) {
throw Error('Invalid Chai property: ' + nonChainableMethodName + '.' + property + '. See docs for proper usage of "' + nonChainableMethodName + '".');
}
var orderedProperties = getProperties(target).filter(function (property) {
return !Object.prototype.hasOwnProperty(property) && builtins.indexOf(property) === -1;
}).sort(function (a, b) {
return stringDistance(property, a) - stringDistance(property, b);
});
if (orderedProperties.length && stringDistance(orderedProperties[0], property) < 4) {
throw Error('Invalid Chai property: ' + property + '. Did you mean "' + orderedProperties[0] + '"?');
} else {
throw Error('Invalid Chai property: ' + property);
}
}
if (builtins.indexOf(property) === -1 && !flag(target, 'lockSsfi')) {
flag(target, 'ssfi', proxyGetter);
}
return Reflect.get(target, property);
}
});
};
function stringDistance(strA, strB, memo) {
if (!memo) {
memo = [];
for (var i = 0; i <= strA.length; i++) {
memo[i] = [];
}
}
if (!memo[strA.length] || !memo[strA.length][strB.length]) {
if (strA.length === 0 || strB.length === 0) {
memo[strA.length][strB.length] = Math.max(strA.length, strB.length);
} else {
memo[strA.length][strB.length] = Math.min(stringDistance(strA.slice(0, -1), strB, memo) + 1, stringDistance(strA, strB.slice(0, -1), memo) + 1, stringDistance(strA.slice(0, -1), strB.slice(0, -1), memo) + (strA.slice(-1) === strB.slice(-1) ? 0 : 1));
}
}
return memo[strA.length][strB.length];
}
return module.exports;
},
79: function (require, module, exports) {
var config = require(47);
var fnLengthDesc = Object.getOwnPropertyDescriptor(function () {}, 'length');
module.exports = function addLengthGuard(fn, assertionName, isChainable) {
if (!fnLengthDesc.configurable) return fn;
Object.defineProperty(fn, 'length', {
get: function () {
if (isChainable) {
throw Error('Invalid Chai property: ' + assertionName + '.length. Due' + ' to a compatibility issue, "length" cannot directly follow "' + assertionName + '". Use "' + assertionName + '.lengthOf" instead.');
}
throw Error('Invalid Chai property: ' + assertionName + '.length. See' + ' docs for proper usage of "' + assertionName + '".');
}
});
return fn;
};
return module.exports;
},
80: function (require, module, exports) {
var config = require(47);
module.exports = function isProxyEnabled() {
return config.useProxy && typeof Proxy !== 'undefined' && typeof Reflect !== 'undefined';
};
return module.exports;
},
81: function (require, module, exports) {
function isNaN(value) {
return value !== value;
}
module.exports = Number.isNaN || isNaN;
return module.exports;
},
82: function (require, module, exports) {
module.exports = function getProperties(object) {
var result = Object.getOwnPropertyNames(object);
function addProperty(property) {
if (result.indexOf(property) === -1) {
result.push(property);
}
}
var proto = Object.getPrototypeOf(object);
while (proto !== null) {
Object.getOwnPropertyNames(proto).forEach(addProperty);
proto = Object.getPrototypeOf(proto);
}
return result;
};
return module.exports;
},
83: function (require, module, exports) {
module.exports = function getEnumerableProperties(object) {
var result = [];
for (var name in object) {
result.push(name);
}
return result;
};
return module.exports;
}
}, this);
return require(0);
}).call(this, null, typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : this);
