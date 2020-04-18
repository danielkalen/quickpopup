(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f(require('quickdom'),require('smart-extend'),require('p-event'),require('promise-break'),require('@danielkalen/is'),require('detect-animation-end-helper'),require('event-lite')):typeof define==='function'&&define.amd?define(['quickdom','smart-extend','p-event','promise-break','@danielkalen/is','detect-animation-end-helper','event-lite'],f):(g=g||self,g.quickpopup=f(g.DOM,g.extend,g.promiseEvent,g.promiseBreak,g.IS_,g.detectAnimation,g.EventEmitter));}(this,(function(DOM, extend, promiseEvent, promiseBreak, IS_, detectAnimation, EventEmitter){'use strict';DOM=DOM&&Object.prototype.hasOwnProperty.call(DOM,'default')?DOM['default']:DOM;extend=extend&&Object.prototype.hasOwnProperty.call(extend,'default')?extend['default']:extend;promiseEvent=promiseEvent&&Object.prototype.hasOwnProperty.call(promiseEvent,'default')?promiseEvent['default']:promiseEvent;promiseBreak=promiseBreak&&Object.prototype.hasOwnProperty.call(promiseBreak,'default')?promiseBreak['default']:promiseBreak;IS_=IS_&&Object.prototype.hasOwnProperty.call(IS_,'default')?IS_['default']:IS_;detectAnimation=detectAnimation&&Object.prototype.hasOwnProperty.call(detectAnimation,'default')?detectAnimation['default']:detectAnimation;EventEmitter=EventEmitter&&Object.prototype.hasOwnProperty.call(EventEmitter,'default')?EventEmitter['default']:EventEmitter;var IS;
IS = IS_.create('natives');
IS.load({
  'domEl': DOM.isEl,
  'quickEl': DOM.isQuickEl,
  'template': DOM.isTemplate
});
var IS$1 = IS;var popup = DOM.template(['div', {
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
    transition: function (popup) {
      return `all 0.001s linear ${popup.settings.animation + 1}ms`;
    },
    $open: {
      transition: function () {
        return 'all 0.001s linear 0s';
      },
      visibility: 'visible',
      overflow: 'visible',
      height: 'auto'
    }
  }
}]);
var overlay = DOM.template(['div', {
  ref: 'overlay',
  style: {
    position: 'fixed',
    zIndex: 1,
    left: 0,
    top: 0,
    width: '100vw',
    minHeight: '100vh',
    opacity: 0,
    backgroundColor: function (popup) {
      return popup.settings.overlayColor;
    },
    transition: function (popup) {
      return `opacity ${popup.settings.animation}ms`;
    },
    $open: {
      opacity: 1
    }
  }
}]);
var content = DOM.template(['div', {
  ref: 'content',
  style: {
    position: 'absolute',
    zIndex: 2,
    boxSizing: 'border-box',
    maxWidth: '100%',
    margin: '0 auto',
    padding: function (popup) {
      return popup.settings.contentPadding;
    },
    opacity: 0,
    transition: function (popup) {
      var duration;
      duration = popup.settings.animation;
      return `transform ${duration}ms, -webkit-transform ${duration}ms, opacity ${duration}ms`;
    },
    $open: {
      opacity: 1,
      _: 0
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
        transform: 'translateX(-50%) translateY(0)',
        _: 1
      }
    },
    $bottomPlacement: {
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%) translateY(100%)',
      $open: {
        transform: 'translateX(-50%) translateY(0)',
        _: 2
      }
    }
  },
  computers: {
    placement: function (placement) {
      return this.state(`${placement}Placement`, true);
    },
    content: function (content) {
      if (content) {
        return this.append(content);
      }
    }
  },
  events: {
    'stateChange:visible': function (visible) {
      if (visible && DOM(this).related.settings.placement === 'center') {
        return DOM(this).related.alignToCenter();
      }
    }
  }
}]);
var close = DOM.template(['div', {
  ref: 'close',
  style: {
    position: 'absolute',
    display: function (popup) {
      if (popup.settings.close.show) {
        return 'block';
      } else {
        return 'none';
      }
    },
    top: function (popup) {
      if (popup.settings.close.inside) {
        return popup.settings.close.padding;
      } else {
        return popup.settings.close.size * 2.5 * -1;
      }
    },
    right: function (popup) {
      if (popup.settings.close.inside) {
        return popup.settings.close.padding;
      } else {
        return 0;
      }
    },
    width: function (popup) {
      return popup.settings.close.size;
    },
    height: function (popup) {
      return popup.settings.close.size;
    },
    color: function (popup) {
      return popup.settings.close.color;
    }
  }
}, ['*svg', {
  attrs: {
    viewBox: "0 0 492 492"
  },
  style: {
    width: '100%',
    height: '100%'
  }
}, ['*path', {
  attrs: {
    d: 'M300.2 246L484.1 62c5.1-5.1 7.9-11.8 7.9-19 0-7.2-2.8-14-7.9-19L468 7.9c-5.1-5.1-11.8-7.9-19-7.9 -7.2 0-14 2.8-19 7.9L246 191.8 62 7.9c-5.1-5.1-11.8-7.9-19-7.9 -7.2 0-14 2.8-19 7.9L7.9 24c-10.5 10.5-10.5 27.6 0 38.1L191.8 246 7.9 430c-5.1 5.1-7.9 11.8-7.9 19 0 7.2 2.8 14 7.9 19l16.1 16.1c5.1 5.1 11.8 7.9 19 7.9 7.2 0 14-2.8 19-7.9l184-184 184 184c5.1 5.1 11.8 7.9 19 7.9h0c7.2 0 14-2.8 19-7.9l16.1-16.1c5.1-5.1 7.9-11.8 7.9-19 0-7.2-2.8-14-7.9-19L300.2 246z'
  },
  style: {
    fill: function (popup) {
      return popup.settings.close.color;
    }
  }
}]]]);
var bodyWrapper = DOM.template(['div', {
  id: 'bodyWrapper',
  passStateToChildren: false,
  style: {
    $open: {
      position: 'fixed',
      width: '100%',
      top: '0'
    }
  }
}]);
var html = DOM.template(['div', {
  computers: {
    html: function (html) {
      return this.html = html;
    }
  }
}]);var templates=/*#__PURE__*/Object.freeze({__proto__:null,popup: popup,overlay: overlay,content: content,close: close,bodyWrapper: bodyWrapper,html: html});var extendSettings = function (defaults, settings) {
  return extend.filter({
    placement: IS$1.string,
    template: IS$1.objectPlain,
    condition: IS$1.function,
    animation: IS$1.number,
    overlayColor: IS$1.string,
    open: IS$1.objectPlain,
    close: IS$1.objectPlain,
    triggers: IS$1.objectPlain
  }).clone.deep.notDeep('content')(defaults, settings);
};
var scheduleScrollReset = function (scheduleNext) {
  return setTimeout(function () {
    window.scroll(0, 0);

    if (scheduleNext) {
      return setTimeout(function () {
        return scheduleScrollReset();
      }, scheduleNext);
    }
  });
};
var transitionEnd = function () {
  return detectAnimation('transition');
};
var scrollOffset = function () {
  return window.scrollY - documentOffset();
};
var documentOffset = function () {
  var ref;
  return (((ref = document.body.getBoundingClientRect()) != null ? ref.top : void 0) || 0) + window.scrollY;
};
var visibilityApiKeys = function () {
  switch (false) {
    case !IS$1.defined(document.hidden):
      return {
        hidden: 'hidden',
        visibilitychange: 'visibilitychange'
      };

    case !IS$1.defined(document.msHidden):
      return {
        hidden: 'msHidden',
        visibilitychange: 'msvisibilitychange'
      };

    case !IS$1.defined(document.webkitHidden):
      return {
        hidden: 'webkitHidden',
        visibilitychange: 'webkitvisibilitychange'
      };

    default:
      return {};
  }
};var ref;
var isIE = document.all && !window.atob;
var isIE11 = window.navigator.msPointerEnabled;
var isEdge = /Edge/.test(((ref = window.navigator) != null ? ref.userAgent : void 0) || '');var Popup, body;
body = DOM(document.body);

Popup = function () {
  class Popup extends EventEmitter {
    static wrapBody() {
      var bodyChildren, child, i, len, ref1;

      if (!((ref1 = this.bodyWrapper) != null ? ref1.parent : void 0)) {
        this.bodyWrapper = bodyWrapper.spawn();
        bodyChildren = body.children.slice();
        this.bodyWrapper.prependTo(body);

        for (i = 0, len = bodyChildren.length; i < len; i++) {
          child = bodyChildren[i];
          this.bodyWrapper.append(child);
        }
      }
    }

    static unwrapBody() {
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
    }

    static destroyAll() {
      var i, instance, instances, len;
      instances = this.instances.slice();

      for (i = 0, len = instances.length; i < len; i++) {
        instance = instances[i];
        instance.destroy();
      }

      return this.unwrapBody();
    }

    constructor(settings, defaults, template1) {
      super();
      this.template = template1;
      this.settings = extendSettings(defaults, settings);
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

    _createElements() {
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
    }

    _applyTemplate() {
      var custom, ref;
      custom = this.settings.template;

      for (ref in this.el.child) {
        if (custom[ref]) {
          this.el.child[ref].updateOptions(custom[ref]);
        }
      }
    }

    _attachBindings() {
      var close, hidden, ref1, ref2, visibilitychange;
      close = this.close.bind(this);
      this.el.child.overlay.on('mouseup touchend', close);

      if ((ref1 = this.el.child.close) != null) {
        ref1.on('mouseup touchend', close);
      }

      if (this.settings.placement === 'center') {
        DOM(window).on(`resize.${this.id}`, () => {
          if (this.state.open) {
            return this.alignToCenter();
          }
        });
      }

      if (this.settings.triggers.close.esc) {
        DOM(document).on(`keyup.${this.id}`, event => {
          if (event.keyCode === 27 && this.state.open) {
            event.stopPropagation();
            event.preventDefault();
            return this.close();
          }
        });
      }

      if (this.settings.triggers.open.visibility) {
        ({
          visibilitychange,
          hidden
        } = visibilityApiKeys());
        DOM(document).on(`${visibilitychange}.${this.id}`, () => {
          if (document[hidden]) {
            return this.open('visibility');
          }
        });
      }

      if (this.settings.triggers.open.exitIntent) {
        DOM(document).on(`mouseout.${this.id}`, event => {
          var base, threshold;
          base = isIE || isIE11 || isEdge ? 110 : 0;
          threshold = this.settings.yThreshold + base;

          if (event.clientY <= threshold) {
            return this.open('exitIntent');
          }
        });
      }

      if (this.settings.triggers.open.navigation && ((ref2 = window.history) != null ? ref2.pushState : void 0)) {
        window.history.replaceState({
          id: 'quickpopup-origin'
        }, '', '');
        window.history.pushState({
          id: 'quickpopup'
        }, '', '');
        return DOM(window).on(`popstate.${this.id}`, event => {
          if (event.state.state.id === 'quickpopup-origin' && this.open('navigation')) ; else {
            return window.history.back();
          }
        });
      }
    }

    _detachBindings() {
      var hidden, ref1, visibilitychange;
      this.el.child.overlay.off();

      if ((ref1 = this.el.child.close) != null) {
        ref1.off();
      }

      ({
        visibilitychange,
        hidden
      } = visibilityApiKeys());

      if (this.settings.placement === 'center') {
        DOM(window).off(`resize.${this.id}`);
      }

      if (this.settings.triggers.open.navigation) {
        DOM(window).off(`popstate.${this.id}`);
      }

      if (this.settings.triggers.open.exitIntent) {
        DOM(document).off(`mouseout.${this.id}`);
      }

      if (this.settings.triggers.open.visibility) {
        DOM(document).off(`${visibilitychange}.${this.id}`);
      }

      if (this.settings.triggers.close.esc) {
        return DOM(document).off(`keyup.${this.id}`);
      }
    }

    _throwDestroyed() {
      throw new Error("invalid attempt to operate a destroyed popup instance");
    }

    setContent(target) {
      this.content = function () {
        switch (false) {
          case !IS$1.quickEl(target):
            return target;

          case !IS$1.domEl(target):
            return DOM(target);

          case !IS$1.template(target):
            return target.spawn();

          case !IS$1.string(target):
            return html.spawn({
              data: {
                html: target
              }
            });

          default:
            throw new Error('invalid target provided to Popup::setContent()');
        }
      }();

      if (this.el.child.content.children.length) {
        return this.el.child.content.children[1].replaceWith(this.content);
      } else {
        return this.el.child.content.append(this.content);
      }
    }

    alignToCenter() {
      var contentHeight, offset, windowHeight;
      contentHeight = this.el.child.content.raw.clientHeight;
      windowHeight = window.innerHeight;

      if (contentHeight >= windowHeight - 80) {
        offset = window.innerWidth > 736 ? 100 : 60;
      } else {
        offset = (windowHeight - contentHeight) / 2;
      }

      return this.el.child.content.style('margin', `${offset}px auto`);
    }

    open(triggerName) {
      return Promise.resolve().then(() => {
        if (this.state.destroyed) {
          this._throwDestroyed();
        }

        if ( this.state.open || Popup.hasOpen && !this.settings.forceOpen || ++this.state.count >= this.settings.openLimit || window.innerWidth < this.settings.triggers.open.minWidth || this.settings.condition && !this.settings.condition()) {
          return promiseBreak();
        }
      }).then(() => {
        var openPopups;
        this.emit('beforeopen', triggerName);

        if (!Popup.hasOpen) {
          return this.state.offset = scrollOffset();
        } else {
          openPopups = Popup.instances.filter(popup => {
            return popup !== this && popup.state.open;
          });
          return Promise.all(openPopups.map(popup => {
            this.state.offset = popup.state.offset;
            return popup.close(true);
          }));
        }
      }).then(() => {
        var promise;
        scheduleScrollReset(5);
        Popup.bodyWrapper.state('open', true);
        Popup.bodyWrapper.style('top', this.state.offset * -1);
        this.el.state('open', true);
        this.state.open = Popup.hasOpen = true;

        if (this.settings.placement === 'center') {
          this.alignToCenter();
        }

        this.emit('open', triggerName);

        if (!this.settings.animation || !Popup.transitionEnd) {
          return this.emit('finishopen');
        } else {
          promise = promiseEvent(this, 'finishopen');
          this.el.child.content.on(Popup.transitionEnd, event => {
            if (event.target === this.el.child.content.raw) {
              this.emit('finishopen');
              return this.el.child.content.off(Popup.transitionEnd);
            }
          });
          return promise;
        }
      }).catch(promiseBreak.end).then(() => {
        return this;
      });
    }

    close(preventReset) {
      return Promise.resolve().then(() => {
        if (!this.state.open) {
          return promiseBreak();
        }
      }).then(() => {
        var promise;
        this.emit('beforeclose');

        if (preventReset !== true) {
          setTimeout(() => {
            var ref1, ref2;

            if (!Popup.hasOpen) {
              if ((ref1 = Popup.bodyWrapper) != null) {
                ref1.state('open', false);
              }

              if ((ref2 = Popup.bodyWrapper) != null) {
                ref2.style('top', null);
              }

              return window.scroll(0, this.state.offset + documentOffset());
            }
          });
          Popup.hasOpen = false;
        }

        this.el.state('open', false);
        this.state.open = false;
        this.emit('close');

        if (!this.settings.animation || !Popup.transitionEnd) {
          return this.emit('finishclose');
        } else {
          promise = promiseEvent(this, 'finishclose');
          this.el.child.content.on(Popup.transitionEnd, event => {
            if (event.target === this.el.child.content.raw) {
              this.emit('finishclose');
              return this.el.child.content.off(Popup.transitionEnd);
            }
          });
          return promise;
        }
      }).catch(promiseBreak.end).then(() => {
        return this;
      });
    }

    destroy() {
      if (this.settings.destroyed) {
        this._throwDestroyed();
      }

      this.close();

      this._detachBindings();

      this.el.remove();
      Popup.instances.splice(Popup.instances.indexOf(this), 1);
      return true;
    }

  }
  Popup.instances = [];
  Popup.hasOpen = false;
  Popup.bodyWrapper = null;
  Popup.transitionEnd = transitionEnd();
  return Popup;
}.call(undefined);

var Popup$1 = Popup;var defaults = {
  placement: 'center',
  open: false,
  forceOpen: false,
  template: null,
  condition: null,
  animation: 300,
  contentPadding: 0,
  yThreshold: 15,
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
};var version = "1.0.0";var newBuilder, quickpopup;

newBuilder = function (defaults, templates) {
  var builder;

  builder = function (arg) {

    switch (false) {
      case arguments.length !== 0:
        return new Popup$1(null, defaults, templates);

      case typeof arg !== 'string':
        return new Popup$1({
          content: html.spawn({
            data: {
              html: arg
            }
          })
        }, defaults, templates);

      case !DOM.isEl(arg):
      case !DOM.isQuickEl(arg):
        return new Popup$1({
          content: arg
        }, defaults, templates);

      case !DOM.isTemplate(arg):
        return new Popup$1({
          content: arg.spawn()
        }, defaults, templates);

      case !(arg && typeof arg === 'object'):
        return new Popup$1(arg, defaults, templates);

      default:
        throw new Error('invalid argument provided to QuickPopup');
    }
  };

  builder.config = function (newSettings, newTemplates) {
    var name, outputSettings, outputTemplates, template;

    if (!IS$1.object(newSettings)) {
      throw new Error(`QuickPopup Config: invalid config object provided ${String(newSettings)}`);
    }

    outputSettings = extend.clone.deep(defaults, newSettings);

    if (!IS$1.object(newTemplates)) {
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

  builder.wrapBody = function () {
    return Popup$1.wrapBody();
  };

  builder.unwrapBody = function () {
    return Popup$1.unwrapBody();
  };

  builder.destroyAll = function () {
    return Popup$1.destroyAll();
  };

  builder.version = version;
  builder.defaults = defaults;
  builder.templates = templates;
  return builder;
};

quickpopup = newBuilder(defaults, templates);
var quickpopup$1 = quickpopup;return quickpopup$1;})));//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpY2twb3B1cC5kZWJ1Zy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2NoZWNrcy5jb2ZmZWUiLCIuLi9zcmMvdGVtcGxhdGUuY29mZmVlIiwiLi4vc3JjL2hlbHBlcnMuY29mZmVlIiwiLi4vc3JjL2Jyb3dzZXItaW5mby5jb2ZmZWUiLCIuLi9zcmMvcG9wdXAuY29mZmVlIiwiLi4vc3JjL2RlZmF1bHRzLmNvZmZlZSIsIi4uL3NyYy9pbmRleC5jb2ZmZWUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERPTSBmcm9tICdxdWlja2RvbSdcbmltcG9ydCBJU18gZnJvbSAnQGRhbmllbGthbGVuL2lzJ1xuSVMgPSBJU18uY3JlYXRlKCduYXRpdmVzJylcblxuSVMubG9hZFxuXHQnZG9tRWwnOiBET00uaXNFbFxuXHQncXVpY2tFbCc6IERPTS5pc1F1aWNrRWxcblx0J3RlbXBsYXRlJzogRE9NLmlzVGVtcGxhdGVcblxuZXhwb3J0IGRlZmF1bHQgSVMiLCJpbXBvcnQgRE9NIGZyb20gJ3F1aWNrZG9tJ1xuXG5leHBvcnQgcG9wdXAgPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ3BvcHVwJ1xuXHRcdHN0eWxlOlxuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdHpJbmRleDogMWU0XG5cdFx0XHR0b3A6IDBcblx0XHRcdGxlZnQ6IDBcblx0XHRcdHdpZHRoOiAnMTAwdncnXG5cdFx0XHRoZWlnaHQ6IDBcblx0XHRcdG1pbkhlaWdodDogJzEwMCUnXG5cdFx0XHR2aXNpYmlsaXR5OiAnaGlkZGVuJ1xuXHRcdFx0b3ZlcmZsb3c6ICdoaWRkZW4nXG5cdFx0XHR0cmFuc2l0aW9uOiAocG9wdXApLT4gXCJhbGwgMC4wMDFzIGxpbmVhciAje3BvcHVwLnNldHRpbmdzLmFuaW1hdGlvbisxfW1zXCJcblx0XHRcdFxuXHRcdFx0JG9wZW46XG5cdFx0XHRcdHRyYW5zaXRpb246ICgpLT4gJ2FsbCAwLjAwMXMgbGluZWFyIDBzJ1xuXHRcdFx0XHR2aXNpYmlsaXR5OiAndmlzaWJsZSdcblx0XHRcdFx0b3ZlcmZsb3c6ICd2aXNpYmxlJ1xuXHRcdFx0XHRoZWlnaHQ6ICdhdXRvJ1xuXG5cdF1cbilcblxuXG5leHBvcnQgb3ZlcmxheSA9IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0cmVmOiAnb3ZlcmxheSdcblx0XHRzdHlsZTpcblx0XHRcdHBvc2l0aW9uOiAnZml4ZWQnXG5cdFx0XHR6SW5kZXg6IDFcblx0XHRcdGxlZnQ6IDBcblx0XHRcdHRvcDogMFxuXHRcdFx0d2lkdGg6ICcxMDB2dydcblx0XHRcdG1pbkhlaWdodDogJzEwMHZoJ1xuXHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiAocG9wdXApLT4gcG9wdXAuc2V0dGluZ3Mub3ZlcmxheUNvbG9yXG5cdFx0XHR0cmFuc2l0aW9uOiAocG9wdXApLT4gXCJvcGFjaXR5ICN7cG9wdXAuc2V0dGluZ3MuYW5pbWF0aW9ufW1zXCJcblx0XHRcdCRvcGVuOlxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdF1cbilcblxuXG5leHBvcnQgY29udGVudCA9IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0cmVmOiAnY29udGVudCdcblx0XHRzdHlsZTpcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHR6SW5kZXg6IDJcblx0XHRcdGJveFNpemluZzogJ2JvcmRlci1ib3gnXG5cdFx0XHRtYXhXaWR0aDogJzEwMCUnXG5cdFx0XHRtYXJnaW46ICcwIGF1dG8nXG5cdFx0XHRwYWRkaW5nOiAocG9wdXApLT4gcG9wdXAuc2V0dGluZ3MuY29udGVudFBhZGRpbmdcblx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdHRyYW5zaXRpb246IChwb3B1cCktPlxuXHRcdFx0XHRkdXJhdGlvbiA9IHBvcHVwLnNldHRpbmdzLmFuaW1hdGlvblxuXHRcdFx0XHRcInRyYW5zZm9ybSAje2R1cmF0aW9ufW1zLFxuXHRcdFx0XHQtd2Via2l0LXRyYW5zZm9ybSAje2R1cmF0aW9ufW1zLFxuXHRcdFx0XHRvcGFjaXR5ICN7ZHVyYXRpb259bXNcIlxuXHRcdFx0XG5cdFx0XHQkb3Blbjpcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRfOjBcblxuXHRcdFx0JGNlbnRlclBsYWNlbWVudDpcblx0XHRcdFx0bGVmdDogJzUwJSdcblx0XHRcdFx0dHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtNTAlKSdcblx0XHRcdFxuXHRcdFx0JHRvcFBsYWNlbWVudDpcblx0XHRcdFx0dG9wOiAwXG5cdFx0XHRcdGxlZnQ6ICc1MCUnXG5cdFx0XHRcdHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSkgdHJhbnNsYXRlWSgtMTAwJSknXG5cdFx0XHRcdCRvcGVuOlxuXHRcdFx0XHRcdHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSkgdHJhbnNsYXRlWSgwKSdcblx0XHRcdFx0XHRfOjFcblx0XHRcdFxuXHRcdFx0JGJvdHRvbVBsYWNlbWVudDpcblx0XHRcdFx0Ym90dG9tOiAwXG5cdFx0XHRcdGxlZnQ6ICc1MCUnXG5cdFx0XHRcdHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSkgdHJhbnNsYXRlWSgxMDAlKSdcblx0XHRcdFx0JG9wZW46XG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtNTAlKSB0cmFuc2xhdGVZKDApJ1xuXHRcdFx0XHRcdF86MlxuXG5cdFx0Y29tcHV0ZXJzOlxuXHRcdFx0cGxhY2VtZW50OiAocGxhY2VtZW50KS0+IEBzdGF0ZSBcIiN7cGxhY2VtZW50fVBsYWNlbWVudFwiLCBvblxuXHRcdFx0Y29udGVudDogKGNvbnRlbnQpLT4gQGFwcGVuZChjb250ZW50KSBpZiBjb250ZW50XG5cblx0XHRldmVudHM6ICdzdGF0ZUNoYW5nZTp2aXNpYmxlJzogKHZpc2libGUpLT5cblx0XHRcdGlmIHZpc2libGUgYW5kIERPTShAKS5yZWxhdGVkLnNldHRpbmdzLnBsYWNlbWVudCBpcyAnY2VudGVyJ1xuXHRcdFx0XHRET00oQCkucmVsYXRlZC5hbGlnblRvQ2VudGVyKClcblx0XVxuKVxuXG5cbmV4cG9ydCBjbG9zZSA9IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0cmVmOiAnY2xvc2UnXG5cdFx0c3R5bGU6XG5cdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0ZGlzcGxheTogKHBvcHVwKS0+IGlmIHBvcHVwLnNldHRpbmdzLmNsb3NlLnNob3cgdGhlbiAnYmxvY2snIGVsc2UgJ25vbmUnXG5cdFx0XHR0b3A6IChwb3B1cCktPiBpZiBwb3B1cC5zZXR0aW5ncy5jbG9zZS5pbnNpZGUgdGhlbiBwb3B1cC5zZXR0aW5ncy5jbG9zZS5wYWRkaW5nIGVsc2UgcG9wdXAuc2V0dGluZ3MuY2xvc2Uuc2l6ZSoyLjUgKiAtMVxuXHRcdFx0cmlnaHQ6IChwb3B1cCktPiBpZiBwb3B1cC5zZXR0aW5ncy5jbG9zZS5pbnNpZGUgdGhlbiBwb3B1cC5zZXR0aW5ncy5jbG9zZS5wYWRkaW5nIGVsc2UgMFxuXHRcdFx0d2lkdGg6IChwb3B1cCktPiBwb3B1cC5zZXR0aW5ncy5jbG9zZS5zaXplXG5cdFx0XHRoZWlnaHQ6IChwb3B1cCktPiBwb3B1cC5zZXR0aW5ncy5jbG9zZS5zaXplXG5cdFx0XHRjb2xvcjogKHBvcHVwKS0+IHBvcHVwLnNldHRpbmdzLmNsb3NlLmNvbG9yXG5cblx0XHRbJypzdmcnXG5cdFx0XHRhdHRyczogdmlld0JveDpcIjAgMCA0OTIgNDkyXCJcblx0XHRcdHN0eWxlOiB3aWR0aDonMTAwJScsIGhlaWdodDonMTAwJSdcblxuXHRcdFx0WycqcGF0aCdcblx0XHRcdFx0YXR0cnM6IGQ6J00zMDAuMiAyNDZMNDg0LjEgNjJjNS4xLTUuMSA3LjktMTEuOCA3LjktMTkgMC03LjItMi44LTE0LTcuOS0xOUw0NjggNy45Yy01LjEtNS4xLTExLjgtNy45LTE5LTcuOSAtNy4yIDAtMTQgMi44LTE5IDcuOUwyNDYgMTkxLjggNjIgNy45Yy01LjEtNS4xLTExLjgtNy45LTE5LTcuOSAtNy4yIDAtMTQgMi44LTE5IDcuOUw3LjkgMjRjLTEwLjUgMTAuNS0xMC41IDI3LjYgMCAzOC4xTDE5MS44IDI0NiA3LjkgNDMwYy01LjEgNS4xLTcuOSAxMS44LTcuOSAxOSAwIDcuMiAyLjggMTQgNy45IDE5bDE2LjEgMTYuMWM1LjEgNS4xIDExLjggNy45IDE5IDcuOSA3LjIgMCAxNC0yLjggMTktNy45bDE4NC0xODQgMTg0IDE4NGM1LjEgNS4xIDExLjggNy45IDE5IDcuOWgwYzcuMiAwIDE0LTIuOCAxOS03LjlsMTYuMS0xNi4xYzUuMS01LjEgNy45LTExLjggNy45LTE5IDAtNy4yLTIuOC0xNC03LjktMTlMMzAwLjIgMjQ2eidcblx0XHRcdFx0c3R5bGU6IGZpbGw6IChwb3B1cCktPiBwb3B1cC5zZXR0aW5ncy5jbG9zZS5jb2xvclxuXHRcdFx0XVxuXHRcdF1cblx0XVxuKVxuXG5cbmV4cG9ydCBib2R5V3JhcHBlciA9IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0aWQ6ICdib2R5V3JhcHBlcidcblx0XHRwYXNzU3RhdGVUb0NoaWxkcmVuOiBmYWxzZVxuXHRcdHN0eWxlOlxuXHRcdFx0JG9wZW46XG5cdFx0XHRcdHBvc2l0aW9uOiAnZml4ZWQnXG5cdFx0XHRcdHdpZHRoOiAnMTAwJSdcblx0XHRcdFx0dG9wOiAnMCdcblx0XVxuKVxuXG5cbmV4cG9ydCBodG1sID0gRE9NLnRlbXBsYXRlKFxuXHRbJ2Rpdidcblx0XHRjb21wdXRlcnM6IGh0bWw6IChodG1sKS0+IEBodG1sID0gaHRtbFxuXHRdXG4pXG4iLCJpbXBvcnQgSVMgZnJvbSAnLi9jaGVja3MnXG5pbXBvcnQgZXh0ZW5kIGZyb20gJ3NtYXJ0LWV4dGVuZCdcbmltcG9ydCBkZXRlY3RBbmltYXRpb24gZnJvbSAnZGV0ZWN0LWFuaW1hdGlvbi1lbmQtaGVscGVyJ1xuXG5leHBvcnQgZXh0ZW5kU2V0dGluZ3MgPSAoZGVmYXVsdHMsIHNldHRpbmdzKS0+XG5cdGV4dGVuZFxuXHRcdC5maWx0ZXJcblx0XHRcdHBsYWNlbWVudDogSVMuc3RyaW5nXG5cdFx0XHR0ZW1wbGF0ZTogSVMub2JqZWN0UGxhaW5cblx0XHRcdGNvbmRpdGlvbjogSVMuZnVuY3Rpb25cblx0XHRcdGFuaW1hdGlvbjogSVMubnVtYmVyXG5cdFx0XHRvdmVybGF5Q29sb3I6IElTLnN0cmluZ1xuXHRcdFx0b3BlbjogSVMub2JqZWN0UGxhaW5cblx0XHRcdGNsb3NlOiBJUy5vYmplY3RQbGFpblxuXHRcdFx0dHJpZ2dlcnM6IElTLm9iamVjdFBsYWluXG5cblx0XHQuY2xvbmUuZGVlcC5ub3REZWVwKCdjb250ZW50JykoZGVmYXVsdHMsIHNldHRpbmdzKVxuXG5cbmV4cG9ydCBzY2hlZHVsZVNjcm9sbFJlc2V0ID0gKHNjaGVkdWxlTmV4dCktPiBzZXRUaW1lb3V0ICgpLT5cblx0d2luZG93LnNjcm9sbCgwLDApXG5cdFxuXHRpZiBzY2hlZHVsZU5leHRcblx0XHRzZXRUaW1lb3V0ICgpLT5cblx0XHRcdHNjaGVkdWxlU2Nyb2xsUmVzZXQoKVxuXHRcdCwgc2NoZWR1bGVOZXh0XG5cbmV4cG9ydCB0cmFuc2l0aW9uRW5kID0gKCktPlxuXHRkZXRlY3RBbmltYXRpb24oJ3RyYW5zaXRpb24nKVxuXG5leHBvcnQgc2Nyb2xsT2Zmc2V0ID0gKCktPlxuXHR3aW5kb3cuc2Nyb2xsWSAtIGRvY3VtZW50T2Zmc2V0KClcblxuZXhwb3J0IGRvY3VtZW50T2Zmc2V0ID0gKCktPlxuXHQoZG9jdW1lbnQuYm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKT8udG9wIG9yIDApICsgd2luZG93LnNjcm9sbFlcblxuXG5leHBvcnQgdmlzaWJpbGl0eUFwaUtleXMgPSAoKS0+IHN3aXRjaFxuXHR3aGVuIElTLmRlZmluZWQoZG9jdW1lbnQuaGlkZGVuKVxuXHRcdGhpZGRlbjonaGlkZGVuJywgdmlzaWJpbGl0eWNoYW5nZTondmlzaWJpbGl0eWNoYW5nZSdcblx0XG5cdHdoZW4gSVMuZGVmaW5lZChkb2N1bWVudC5tc0hpZGRlbilcblx0XHRoaWRkZW46J21zSGlkZGVuJywgdmlzaWJpbGl0eWNoYW5nZTonbXN2aXNpYmlsaXR5Y2hhbmdlJ1xuXHRcblx0d2hlbiBJUy5kZWZpbmVkKGRvY3VtZW50LndlYmtpdEhpZGRlbilcblx0XHRoaWRkZW46J3dlYmtpdEhpZGRlbicsIHZpc2liaWxpdHljaGFuZ2U6J3dlYmtpdHZpc2liaWxpdHljaGFuZ2UnXG5cblx0ZWxzZSB7fVxuXG4iLCJleHBvcnQgaXNJRSA9IGRvY3VtZW50LmFsbCBhbmQgIXdpbmRvdy5hdG9iXG5leHBvcnQgaXNJRTExID0gd2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkXG5leHBvcnQgaXNFZGdlID0gL0VkZ2UvLnRlc3Qgd2luZG93Lm5hdmlnYXRvcj8udXNlckFnZW50IG9yICcnIiwiaW1wb3J0IHByb21pc2VFdmVudCBmcm9tICdwLWV2ZW50J1xuaW1wb3J0IHByb21pc2VCcmVhayBmcm9tICdwcm9taXNlLWJyZWFrJ1xuaW1wb3J0IERPTSBmcm9tICdxdWlja2RvbSdcbmltcG9ydCBJUyBmcm9tICcuL2NoZWNrcydcbmltcG9ydCAqIGFzIHRlbXBsYXRlIGZyb20gJy4vdGVtcGxhdGUnXG5pbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4vaGVscGVycydcbmltcG9ydCAqIGFzIEJST1dTRVIgZnJvbSAnLi9icm93c2VyLWluZm8nXG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50LWxpdGUnXG5ib2R5ID0gRE9NKGRvY3VtZW50LmJvZHkpXG5cbmNsYXNzIFBvcHVwIGV4dGVuZHMgRXZlbnRFbWl0dGVyXG5cdEBpbnN0YW5jZXM6IFtdXG5cdEBoYXNPcGVuOiBmYWxzZVxuXHRAYm9keVdyYXBwZXI6IG51bGxcblx0QHRyYW5zaXRpb25FbmQ6IGhlbHBlcnMudHJhbnNpdGlvbkVuZCgpXG5cblx0QHdyYXBCb2R5OiAoKS0+IHVubGVzcyBAYm9keVdyYXBwZXI/LnBhcmVudFxuXHRcdEBib2R5V3JhcHBlciA9IHRlbXBsYXRlLmJvZHlXcmFwcGVyLnNwYXduKClcblx0XHRib2R5Q2hpbGRyZW4gPSBib2R5LmNoaWxkcmVuLnNsaWNlKClcblx0XHRAYm9keVdyYXBwZXIucHJlcGVuZFRvKGJvZHkpXG5cdFx0QGJvZHlXcmFwcGVyLmFwcGVuZChjaGlsZCkgZm9yIGNoaWxkIGluIGJvZHlDaGlsZHJlblxuXHRcdHJldHVyblxuXG5cdEB1bndyYXBCb2R5OiAoKS0+IGlmIEBib2R5V3JhcHBlclxuXHRcdGJvZHlDaGlsZHJlbiA9IEBib2R5V3JhcHBlci5jaGlsZHJlbi5zbGljZSgpXG5cdFx0Ym9keS5hcHBlbmQoY2hpbGQpIGZvciBjaGlsZCBpbiBib2R5Q2hpbGRyZW5cblx0XHRAYm9keVdyYXBwZXIucmVtb3ZlKClcblx0XHRAYm9keVdyYXBwZXIgPSBudWxsXG5cblx0QGRlc3Ryb3lBbGw6ICgpLT5cblx0XHRpbnN0YW5jZXMgPSBAaW5zdGFuY2VzLnNsaWNlKClcblx0XHRpbnN0YW5jZS5kZXN0cm95KCkgZm9yIGluc3RhbmNlIGluIGluc3RhbmNlc1xuXHRcdEB1bndyYXBCb2R5KClcblxuXG5cblxuXG5cdGNvbnN0cnVjdG9yOiAoc2V0dGluZ3MsIGRlZmF1bHRzLCBAdGVtcGxhdGUpLT5cblx0XHRzdXBlcigpXG5cdFx0QHNldHRpbmdzID0gaGVscGVycy5leHRlbmRTZXR0aW5ncyhkZWZhdWx0cywgc2V0dGluZ3MpXG5cdFx0QGlkID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKjFlNSkudG9TdHJpbmcoMTYpXG5cdFx0QHN0YXRlID0gb3BlbjpmYWxzZSwgZGVzdHJveWVkOmZhbHNlLCBvZmZzZXQ6MCwgY291bnQ6MFxuXHRcdEBjb250ZW50ID0gRE9NKEBzZXR0aW5ncy5jb250ZW50KSBpZiBAc2V0dGluZ3MuY29udGVudFxuXG5cdFx0UG9wdXAuaW5zdGFuY2VzLnB1c2goQClcblx0XHRQb3B1cC53cmFwQm9keSgpXG5cdFx0QF9jcmVhdGVFbGVtZW50cygpXG5cdFx0QF9hdHRhY2hCaW5kaW5ncygpXG5cdFx0QF9hcHBseVRlbXBsYXRlKCkgaWYgQHNldHRpbmdzLnRlbXBsYXRlIGFuZCB0eXBlb2YgQHNldHRpbmdzLnRlbXBsYXRlIGlzICdvYmplY3QnXG5cblx0XHRAZWwucHJlcGVuZFRvKGJvZHkpXG5cdFx0QG9wZW4oKSBpZiBAc2V0dGluZ3Mub3BlblxuXG5cblx0X2NyZWF0ZUVsZW1lbnRzOiAoKS0+XG5cdFx0ZGF0YSA9IGRhdGE6e0Bjb250ZW50LCBwbGFjZW1lbnQ6QHNldHRpbmdzLnBsYWNlbWVudH1cblx0XHRjb25maWcgPSByZWxhdGVkSW5zdGFuY2U6IEBcblx0XHRcblx0XHRAZWwgPSBAdGVtcGxhdGUucG9wdXAuc3Bhd24oZGF0YSwgY29uZmlnKVxuXHRcdG92ZXJsYXkgPSBAdGVtcGxhdGUub3ZlcmxheS5zcGF3bihkYXRhLCBjb25maWcpLmFwcGVuZFRvKEBlbClcblx0XHRjb250ZW50ID0gQHRlbXBsYXRlLmNvbnRlbnQuc3Bhd24oZGF0YSwgY29uZmlnKS5hcHBlbmRUbyhAZWwpXG5cdFx0Y2xvc2UgPSBAdGVtcGxhdGUuY2xvc2Uuc3Bhd24oZGF0YSwgY29uZmlnKS5hcHBlbmRUbyhjb250ZW50KSBpZiBAc2V0dGluZ3MuY2xvc2Uuc2hvd1xuXG5cblx0X2FwcGx5VGVtcGxhdGU6ICgpLT5cblx0XHRjdXN0b20gPSBAc2V0dGluZ3MudGVtcGxhdGVcblx0XHRmb3IgcmVmIG9mIEBlbC5jaGlsZFxuXHRcdFx0QGVsLmNoaWxkW3JlZl0udXBkYXRlT3B0aW9ucyhjdXN0b21bcmVmXSkgaWYgY3VzdG9tW3JlZl1cblxuXHRcdHJldHVyblxuXG5cdF9hdHRhY2hCaW5kaW5nczogKCktPlxuXHRcdGNsb3NlID0gQGNsb3NlLmJpbmQoQClcblx0XHRAZWwuY2hpbGQub3ZlcmxheS5vbiAnbW91c2V1cCB0b3VjaGVuZCcsIGNsb3NlXG5cdFx0QGVsLmNoaWxkLmNsb3NlPy5vbiAnbW91c2V1cCB0b3VjaGVuZCcsIGNsb3NlXG5cblx0XHRpZiBAc2V0dGluZ3MucGxhY2VtZW50IGlzICdjZW50ZXInXG5cdFx0XHRET00od2luZG93KS5vbiBcInJlc2l6ZS4je0BpZH1cIiwgKCk9PiBpZiBAc3RhdGUub3BlblxuXHRcdFx0XHRAYWxpZ25Ub0NlbnRlcigpXG5cblx0XHRpZiBAc2V0dGluZ3MudHJpZ2dlcnMuY2xvc2UuZXNjXG5cdFx0XHRET00oZG9jdW1lbnQpLm9uIFwia2V5dXAuI3tAaWR9XCIsIChldmVudCk9PiBpZiBldmVudC5rZXlDb2RlIGlzIDI3IGFuZCBAc3RhdGUub3BlblxuXHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdEBjbG9zZSgpXG5cblx0XHRpZiBAc2V0dGluZ3MudHJpZ2dlcnMub3Blbi52aXNpYmlsaXR5XG5cdFx0XHR7dmlzaWJpbGl0eWNoYW5nZSxoaWRkZW59ID0gaGVscGVycy52aXNpYmlsaXR5QXBpS2V5cygpXG5cdFx0XHRET00oZG9jdW1lbnQpLm9uIFwiI3t2aXNpYmlsaXR5Y2hhbmdlfS4je0BpZH1cIiwgKCk9PlxuXHRcdFx0XHRAb3BlbigndmlzaWJpbGl0eScpIGlmIGRvY3VtZW50W2hpZGRlbl1cblxuXHRcdGlmIEBzZXR0aW5ncy50cmlnZ2Vycy5vcGVuLmV4aXRJbnRlbnRcblx0XHRcdERPTShkb2N1bWVudCkub24gXCJtb3VzZW91dC4je0BpZH1cIiwgKGV2ZW50KT0+XG5cdFx0XHRcdGJhc2UgPSBpZiBCUk9XU0VSLmlzSUUgb3IgQlJPV1NFUi5pc0lFMTEgb3IgQlJPV1NFUi5pc0VkZ2UgdGhlbiAxMTAgZWxzZSAwXG5cdFx0XHRcdHRocmVzaG9sZCA9IEBzZXR0aW5ncy55VGhyZXNob2xkICsgYmFzZVxuXHRcdFx0XHRAb3BlbignZXhpdEludGVudCcpIGlmIGV2ZW50LmNsaWVudFkgPD0gdGhyZXNob2xkXG5cblx0XHRpZiBAc2V0dGluZ3MudHJpZ2dlcnMub3Blbi5uYXZpZ2F0aW9uIGFuZCB3aW5kb3cuaGlzdG9yeT8ucHVzaFN0YXRlXG5cdFx0XHR3aW5kb3cuaGlzdG9yeS5yZXBsYWNlU3RhdGUge2lkOidxdWlja3BvcHVwLW9yaWdpbid9LCAnJywgJydcblx0XHRcdHdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSB7aWQ6J3F1aWNrcG9wdXAnfSwgJycsICcnXG5cdFx0XHRcblx0XHRcdERPTSh3aW5kb3cpLm9uIFwicG9wc3RhdGUuI3tAaWR9XCIsIChldmVudCk9PlxuXHRcdFx0XHRpZiBldmVudC5zdGF0ZS5zdGF0ZS5pZCBpcyAncXVpY2twb3B1cC1vcmlnaW4nIGFuZCBAb3BlbignbmF2aWdhdGlvbicpXG5cdFx0XHRcdFx0O1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0d2luZG93Lmhpc3RvcnkuYmFjaygpXG5cblxuXHRfZGV0YWNoQmluZGluZ3M6ICgpLT5cblx0XHRAZWwuY2hpbGQub3ZlcmxheS5vZmYoKVxuXHRcdEBlbC5jaGlsZC5jbG9zZT8ub2ZmKClcblx0XHR7dmlzaWJpbGl0eWNoYW5nZSxoaWRkZW59ID0gaGVscGVycy52aXNpYmlsaXR5QXBpS2V5cygpXG5cdFx0XG5cdFx0RE9NKHdpbmRvdykub2ZmIFwicmVzaXplLiN7QGlkfVwiIGlmIEBzZXR0aW5ncy5wbGFjZW1lbnQgaXMgJ2NlbnRlcidcblx0XHRET00od2luZG93KS5vZmYgXCJwb3BzdGF0ZS4je0BpZH1cIiBpZiBAc2V0dGluZ3MudHJpZ2dlcnMub3Blbi5uYXZpZ2F0aW9uXG5cdFx0RE9NKGRvY3VtZW50KS5vZmYgXCJtb3VzZW91dC4je0BpZH1cIiBpZiBAc2V0dGluZ3MudHJpZ2dlcnMub3Blbi5leGl0SW50ZW50XG5cdFx0RE9NKGRvY3VtZW50KS5vZmYgXCIje3Zpc2liaWxpdHljaGFuZ2V9LiN7QGlkfVwiIGlmIEBzZXR0aW5ncy50cmlnZ2Vycy5vcGVuLnZpc2liaWxpdHlcblx0XHRET00oZG9jdW1lbnQpLm9mZiBcImtleXVwLiN7QGlkfVwiIGlmIEBzZXR0aW5ncy50cmlnZ2Vycy5jbG9zZS5lc2NcblxuXG5cdF90aHJvd0Rlc3Ryb3llZDogKCktPlxuXHRcdHRocm93IG5ldyBFcnJvcihcImludmFsaWQgYXR0ZW1wdCB0byBvcGVyYXRlIGEgZGVzdHJveWVkIHBvcHVwIGluc3RhbmNlXCIpXG5cblxuXG5cblxuXG5cblxuXG5cblxuXG5cdHNldENvbnRlbnQ6ICh0YXJnZXQpLT5cblx0XHRAY29udGVudCA9IHN3aXRjaFxuXHRcdFx0d2hlbiBJUy5xdWlja0VsKHRhcmdldCkgdGhlbiB0YXJnZXRcblx0XHRcdHdoZW4gSVMuZG9tRWwodGFyZ2V0KSB0aGVuIERPTSh0YXJnZXQpXG5cdFx0XHR3aGVuIElTLnRlbXBsYXRlKHRhcmdldCkgdGhlbiB0YXJnZXQuc3Bhd24oKVxuXHRcdFx0d2hlbiBJUy5zdHJpbmcodGFyZ2V0KSB0aGVuIHRlbXBsYXRlLmh0bWwuc3Bhd24oZGF0YTpodG1sOnRhcmdldClcblx0XHRcdGVsc2UgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIHRhcmdldCBwcm92aWRlZCB0byBQb3B1cDo6c2V0Q29udGVudCgpJylcblx0XHRcblx0XHRpZiBAZWwuY2hpbGQuY29udGVudC5jaGlsZHJlbi5sZW5ndGhcblx0XHRcdEBlbC5jaGlsZC5jb250ZW50LmNoaWxkcmVuWzFdLnJlcGxhY2VXaXRoIEBjb250ZW50XG5cdFx0ZWxzZVxuXHRcdFx0QGVsLmNoaWxkLmNvbnRlbnQuYXBwZW5kIEBjb250ZW50XG5cblxuXHRhbGlnblRvQ2VudGVyOiAoKS0+XG5cdFx0Y29udGVudEhlaWdodCA9IEBlbC5jaGlsZC5jb250ZW50LnJhdy5jbGllbnRIZWlnaHRcblx0XHR3aW5kb3dIZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHRcblx0XHRcblx0XHRpZiBjb250ZW50SGVpZ2h0ID49IHdpbmRvd0hlaWdodC04MFxuXHRcdFx0b2Zmc2V0ID0gaWYgd2luZG93LmlubmVyV2lkdGggPiA3MzYgdGhlbiAxMDAgZWxzZSA2MFxuXHRcdGVsc2Vcblx0XHRcdG9mZnNldCA9ICh3aW5kb3dIZWlnaHQgLSBjb250ZW50SGVpZ2h0KS8yXG5cdFx0XG5cdFx0QGVsLmNoaWxkLmNvbnRlbnQuc3R5bGUgJ21hcmdpbicsIFwiI3tvZmZzZXR9cHggYXV0b1wiXG5cblxuXHRvcGVuOiAodHJpZ2dlck5hbWUpLT5cblx0XHRQcm9taXNlLnJlc29sdmUoKVxuXHRcdFx0LnRoZW4gKCk9PlxuXHRcdFx0XHRAX3Rocm93RGVzdHJveWVkKCkgaWYgQHN0YXRlLmRlc3Ryb3llZFxuXHRcdFx0XHRwcm9taXNlQnJlYWsoKSBpZiBmYWxzZSBvclxuXHRcdFx0XHRcdEBzdGF0ZS5vcGVuIG9yIChQb3B1cC5oYXNPcGVuIGFuZCBub3QgQHNldHRpbmdzLmZvcmNlT3Blbikgb3Jcblx0XHRcdFx0XHQrK0BzdGF0ZS5jb3VudCA+PSBAc2V0dGluZ3Mub3BlbkxpbWl0IG9yXG5cdFx0XHRcdFx0d2luZG93LmlubmVyV2lkdGggPCBAc2V0dGluZ3MudHJpZ2dlcnMub3Blbi5taW5XaWR0aCBvclxuXHRcdFx0XHRcdEBzZXR0aW5ncy5jb25kaXRpb24gYW5kIG5vdCBAc2V0dGluZ3MuY29uZGl0aW9uKClcblx0XHRcdFxuXHRcdFx0LnRoZW4gKCk9PlxuXHRcdFx0XHRAZW1pdCAnYmVmb3Jlb3BlbicsIHRyaWdnZXJOYW1lXG5cdFx0XHRcdFxuXHRcdFx0XHRpZiBub3QgUG9wdXAuaGFzT3BlblxuXHRcdFx0XHRcdEBzdGF0ZS5vZmZzZXQgPSBoZWxwZXJzLnNjcm9sbE9mZnNldCgpXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRvcGVuUG9wdXBzID0gUG9wdXAuaW5zdGFuY2VzLmZpbHRlciAocG9wdXApPT4gcG9wdXAgaXNudCBAIGFuZCBwb3B1cC5zdGF0ZS5vcGVuXG5cdFx0XHRcdFx0UHJvbWlzZS5hbGwgb3BlblBvcHVwcy5tYXAgKHBvcHVwKT0+XG5cdFx0XHRcdFx0XHRAc3RhdGUub2Zmc2V0ID0gcG9wdXAuc3RhdGUub2Zmc2V0XG5cdFx0XHRcdFx0XHRwb3B1cC5jbG9zZSh0cnVlKVxuXHRcdFx0XHRcblx0XHRcdC50aGVuICgpPT5cblx0XHRcdFx0aGVscGVycy5zY2hlZHVsZVNjcm9sbFJlc2V0KDUpXG5cdFx0XHRcdFBvcHVwLmJvZHlXcmFwcGVyLnN0YXRlICdvcGVuJywgb25cblx0XHRcdFx0UG9wdXAuYm9keVdyYXBwZXIuc3R5bGUgJ3RvcCcsIEBzdGF0ZS5vZmZzZXQqLTFcblx0XHRcdFx0QGVsLnN0YXRlICdvcGVuJywgb25cblx0XHRcdFx0QHN0YXRlLm9wZW4gPSBQb3B1cC5oYXNPcGVuID0gdHJ1ZVxuXHRcdFx0XHRAYWxpZ25Ub0NlbnRlcigpIGlmIEBzZXR0aW5ncy5wbGFjZW1lbnQgaXMgJ2NlbnRlcidcblx0XHRcdFx0QGVtaXQgJ29wZW4nLCB0cmlnZ2VyTmFtZVxuXHRcdFx0XHRcblx0XHRcdFx0aWYgbm90IEBzZXR0aW5ncy5hbmltYXRpb24gb3Igbm90IFBvcHVwLnRyYW5zaXRpb25FbmRcblx0XHRcdFx0XHRAZW1pdCAnZmluaXNob3Blbidcblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHRcdHByb21pc2UgPSBwcm9taXNlRXZlbnQoQCwgJ2ZpbmlzaG9wZW4nKVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdEBlbC5jaGlsZC5jb250ZW50Lm9uIFBvcHVwLnRyYW5zaXRpb25FbmQsIChldmVudCk9PiBpZiBldmVudC50YXJnZXQgaXMgQGVsLmNoaWxkLmNvbnRlbnQucmF3XG5cdFx0XHRcdFx0XHRAZW1pdCAnZmluaXNob3Blbidcblx0XHRcdFx0XHRcdEBlbC5jaGlsZC5jb250ZW50Lm9mZiBQb3B1cC50cmFuc2l0aW9uRW5kXG5cdFx0XHRcdFxuXHRcdFx0XHRcdHJldHVybiBwcm9taXNlXG5cblx0XHRcdC5jYXRjaCBwcm9taXNlQnJlYWsuZW5kXG5cdFx0XHQudGhlbiAoKT0+IEBcblxuXG5cdGNsb3NlOiAocHJldmVudFJlc2V0KS0+XG5cdFx0UHJvbWlzZS5yZXNvbHZlKClcblx0XHRcdC50aGVuICgpPT4gcHJvbWlzZUJyZWFrKCkgaWYgbm90IEBzdGF0ZS5vcGVuXG5cdFx0XHQudGhlbiAoKT0+XG5cdFx0XHRcdEBlbWl0ICdiZWZvcmVjbG9zZSdcblxuXHRcdFx0XHR1bmxlc3MgcHJldmVudFJlc2V0IGlzIHRydWVcblx0XHRcdFx0XHRzZXRUaW1lb3V0ICgpPT4gdW5sZXNzIFBvcHVwLmhhc09wZW5cblx0XHRcdFx0XHRcdFBvcHVwLmJvZHlXcmFwcGVyPy5zdGF0ZSAnb3BlbicsIG9mZlxuXHRcdFx0XHRcdFx0UG9wdXAuYm9keVdyYXBwZXI/LnN0eWxlICd0b3AnLCBudWxsXG5cdFx0XHRcdFx0XHR3aW5kb3cuc2Nyb2xsIDAsIEBzdGF0ZS5vZmZzZXQgKyBoZWxwZXJzLmRvY3VtZW50T2Zmc2V0KClcblxuXHRcdFx0XHRcdFBvcHVwLmhhc09wZW4gPSBmYWxzZVxuXG5cdFx0XHRcdEBlbC5zdGF0ZSAnb3BlbicsIG9mZlxuXHRcdFx0XHRAc3RhdGUub3BlbiA9IGZhbHNlXG5cdFx0XHRcdEBlbWl0ICdjbG9zZSdcblx0XHRcdFx0aWYgbm90IEBzZXR0aW5ncy5hbmltYXRpb24gb3Igbm90IFBvcHVwLnRyYW5zaXRpb25FbmRcblx0XHRcdFx0XHRAZW1pdCAnZmluaXNoY2xvc2UnXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRwcm9taXNlID0gcHJvbWlzZUV2ZW50KEAsICdmaW5pc2hjbG9zZScpXG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0QGVsLmNoaWxkLmNvbnRlbnQub24gUG9wdXAudHJhbnNpdGlvbkVuZCwgKGV2ZW50KT0+IGlmIGV2ZW50LnRhcmdldCBpcyBAZWwuY2hpbGQuY29udGVudC5yYXdcblx0XHRcdFx0XHRcdEBlbWl0ICdmaW5pc2hjbG9zZSdcblx0XHRcdFx0XHRcdEBlbC5jaGlsZC5jb250ZW50Lm9mZiBQb3B1cC50cmFuc2l0aW9uRW5kXG5cblx0XHRcdFx0XHRyZXR1cm4gcHJvbWlzZVxuXHRcdFx0XG5cdFx0XHQuY2F0Y2ggcHJvbWlzZUJyZWFrLmVuZFxuXHRcdFx0LnRoZW4gKCk9PiBAXG5cblxuXHRkZXN0cm95OiAoKS0+XG5cdFx0QF90aHJvd0Rlc3Ryb3llZCgpIGlmIEBzZXR0aW5ncy5kZXN0cm95ZWRcblx0XHRAY2xvc2UoKVxuXHRcdEBfZGV0YWNoQmluZGluZ3MoKVxuXHRcdEBlbC5yZW1vdmUoKVxuXHRcdFBvcHVwLmluc3RhbmNlcy5zcGxpY2UgUG9wdXAuaW5zdGFuY2VzLmluZGV4T2YoQCksIDFcblx0XHRyZXR1cm4gdHJ1ZVxuXG5cblxuXG5leHBvcnQgZGVmYXVsdCBQb3B1cCIsImV4cG9ydCBkZWZhdWx0XG5cdHBsYWNlbWVudDogJ2NlbnRlcidcblx0b3BlbjogZmFsc2Vcblx0Zm9yY2VPcGVuOiBmYWxzZVxuXHR0ZW1wbGF0ZTogbnVsbFxuXHRjb25kaXRpb246IG51bGxcblx0YW5pbWF0aW9uOiAzMDBcblx0Y29udGVudFBhZGRpbmc6IDBcblx0eVRocmVzaG9sZDogMTVcblx0b3BlbkxpbWl0OiBJbmZpbml0eVxuXHRvdmVybGF5Q29sb3I6ICdyZ2JhKDAsMCwwLDAuODgpJ1xuXHRjbG9zZTpcblx0XHRzaG93OiBmYWxzZVxuXHRcdHBhZGRpbmc6IDIwXG5cdFx0aW5zaWRlOiBmYWxzZVxuXHRcdHNpemU6IDIyXG5cblx0dHJpZ2dlcnM6XG5cdFx0b3Blbjpcblx0XHRcdG5hdmlnYXRpb246IGZhbHNlXG5cdFx0XHR2aXNpYmlsaXR5OiBmYWxzZVxuXHRcdFx0ZXhpdEludGVudDogZmFsc2Vcblx0XHRjbG9zZTpcblx0XHRcdGVzYzogdHJ1ZSIsImltcG9ydCBET00gZnJvbSAncXVpY2tkb20nXG5pbXBvcnQgZXh0ZW5kIGZyb20gJ3NtYXJ0LWV4dGVuZCdcbmltcG9ydCBQb3B1cCBmcm9tICcuL3BvcHVwJ1xuaW1wb3J0IElTIGZyb20gJy4vY2hlY2tzJ1xuaW1wb3J0IGRlZmF1bHRzIGZyb20gJy4vZGVmYXVsdHMnXG5pbXBvcnQgKiBhcyB0ZW1wbGF0ZXMgZnJvbSAnLi90ZW1wbGF0ZSdcbmltcG9ydCB7aHRtbCBhcyBodG1sVGVtcGxhdGV9IGZyb20gJy4vdGVtcGxhdGUnXG5pbXBvcnQge3ZlcnNpb259IGZyb20gJy4uL3BhY2thZ2UuanNvbidcblxuXG5uZXdCdWlsZGVyID0gKGRlZmF1bHRzLCB0ZW1wbGF0ZXMpLT5cblx0YnVpbGRlciA9IChhcmcpLT5cblx0XHRhcmdzID0gYXJndW1lbnRzXG5cdFx0c3dpdGNoXG5cdFx0XHR3aGVuIGFyZ3VtZW50cy5sZW5ndGggaXMgMFxuXHRcdFx0XHRuZXcgUG9wdXAobnVsbCwgZGVmYXVsdHMsIHRlbXBsYXRlcylcblxuXHRcdFx0d2hlbiB0eXBlb2YgYXJnIGlzICdzdHJpbmcnXG5cdFx0XHRcdG5ldyBQb3B1cChjb250ZW50Omh0bWxUZW1wbGF0ZS5zcGF3bihkYXRhOmh0bWw6YXJnKSwgZGVmYXVsdHMsIHRlbXBsYXRlcylcblx0XHRcdFxuXHRcdFx0d2hlbiBET00uaXNFbChhcmcpLCBET00uaXNRdWlja0VsKGFyZylcblx0XHRcdFx0bmV3IFBvcHVwKGNvbnRlbnQ6YXJnLCBkZWZhdWx0cywgdGVtcGxhdGVzKVxuXHRcdFx0XG5cdFx0XHR3aGVuIERPTS5pc1RlbXBsYXRlKGFyZylcblx0XHRcdFx0bmV3IFBvcHVwKGNvbnRlbnQ6YXJnLnNwYXduKCksIGRlZmF1bHRzLCB0ZW1wbGF0ZXMpXG5cblx0XHRcdHdoZW4gYXJnIGFuZCB0eXBlb2YgYXJnIGlzICdvYmplY3QnXG5cdFx0XHRcdG5ldyBQb3B1cChhcmcsIGRlZmF1bHRzLCB0ZW1wbGF0ZXMpXG5cblx0XHRcdGVsc2UgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGFyZ3VtZW50IHByb3ZpZGVkIHRvIFF1aWNrUG9wdXAnKVxuXG5cblx0YnVpbGRlci5jb25maWcgPSAobmV3U2V0dGluZ3MsIG5ld1RlbXBsYXRlcyktPlxuXHRcdHRocm93IG5ldyBFcnJvciBcIlF1aWNrUG9wdXAgQ29uZmlnOiBpbnZhbGlkIGNvbmZpZyBvYmplY3QgcHJvdmlkZWQgI3tTdHJpbmcgbmV3U2V0dGluZ3N9XCIgaWYgbm90IElTLm9iamVjdChuZXdTZXR0aW5ncylcblx0XHRvdXRwdXRTZXR0aW5ncyA9IGV4dGVuZC5jbG9uZS5kZWVwKGRlZmF1bHRzLCBuZXdTZXR0aW5ncylcblxuXHRcdGlmIG5vdCBJUy5vYmplY3QobmV3VGVtcGxhdGVzKVxuXHRcdFx0b3V0cHV0VGVtcGxhdGVzID0gdGVtcGxhdGVzXG5cdFx0ZWxzZVxuXHRcdFx0b3V0cHV0VGVtcGxhdGVzID0gT2JqZWN0LmNyZWF0ZShudWxsKVxuXHRcdFx0Zm9yIG5hbWUsdGVtcGxhdGUgb2YgdGVtcGxhdGVzXG5cdFx0XHRcdGlmIG5ld1RlbXBsYXRlc1tuYW1lXVxuXHRcdFx0XHRcdG91dHB1dFRlbXBsYXRlc1tuYW1lXSA9IHRlbXBsYXRlLmV4dGVuZChuZXdUZW1wbGF0ZXNbbmFtZV0pXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRvdXRwdXRUZW1wbGF0ZXNbbmFtZV0gPSB0ZW1wbGF0ZVxuXHRcdFxuXHRcdHJldHVybiBuZXdCdWlsZGVyKG91dHB1dFNldHRpbmdzLCBvdXRwdXRUZW1wbGF0ZXMpXG5cdFxuXG5cdGJ1aWxkZXIud3JhcEJvZHkgPSAoKS0+IFBvcHVwLndyYXBCb2R5KClcblx0YnVpbGRlci51bndyYXBCb2R5ID0gKCktPiBQb3B1cC51bndyYXBCb2R5KClcblx0YnVpbGRlci5kZXN0cm95QWxsID0gKCktPiBQb3B1cC5kZXN0cm95QWxsKClcblx0YnVpbGRlci52ZXJzaW9uID0gdmVyc2lvblxuXHRidWlsZGVyLmRlZmF1bHRzID0gZGVmYXVsdHNcblx0YnVpbGRlci50ZW1wbGF0ZXMgPSB0ZW1wbGF0ZXNcblx0cmV0dXJuIGJ1aWxkZXJcblxuXG5cblxuXG5xdWlja3BvcHVwID0gbmV3QnVpbGRlcihkZWZhdWx0cywgdGVtcGxhdGVzKVxuZXhwb3J0IGRlZmF1bHQgcXVpY2twb3B1cFxuXG5cblxuIl0sIm5hbWVzIjpbIklTIiwiSVNfIiwiY3JlYXRlIiwibG9hZCIsIkRPTSIsImlzRWwiLCJpc1F1aWNrRWwiLCJpc1RlbXBsYXRlIiwicG9wdXAiLCJ0ZW1wbGF0ZSIsInJlZiIsInN0eWxlIiwicG9zaXRpb24iLCJ6SW5kZXgiLCJ0b3AiLCJsZWZ0Iiwid2lkdGgiLCJoZWlnaHQiLCJtaW5IZWlnaHQiLCJ2aXNpYmlsaXR5Iiwib3ZlcmZsb3ciLCJ0cmFuc2l0aW9uIiwic2V0dGluZ3MiLCJhbmltYXRpb24iLCIkb3BlbiIsIm92ZXJsYXkiLCJvcGFjaXR5IiwiYmFja2dyb3VuZENvbG9yIiwib3ZlcmxheUNvbG9yIiwiY29udGVudCIsImJveFNpemluZyIsIm1heFdpZHRoIiwibWFyZ2luIiwicGFkZGluZyIsImNvbnRlbnRQYWRkaW5nIiwiZHVyYXRpb24iLCJfIiwiJGNlbnRlclBsYWNlbWVudCIsInRyYW5zZm9ybSIsIiR0b3BQbGFjZW1lbnQiLCIkYm90dG9tUGxhY2VtZW50IiwiYm90dG9tIiwiY29tcHV0ZXJzIiwicGxhY2VtZW50Iiwic3RhdGUiLCJhcHBlbmQiLCJldmVudHMiLCJ2aXNpYmxlIiwicmVsYXRlZCIsImFsaWduVG9DZW50ZXIiLCJjbG9zZSIsImRpc3BsYXkiLCJzaG93IiwiaW5zaWRlIiwic2l6ZSIsInJpZ2h0IiwiY29sb3IiLCJhdHRycyIsInZpZXdCb3giLCJkIiwiZmlsbCIsImJvZHlXcmFwcGVyIiwiaWQiLCJwYXNzU3RhdGVUb0NoaWxkcmVuIiwiaHRtbCIsImV4dGVuZFNldHRpbmdzIiwiZGVmYXVsdHMiLCJleHRlbmQiLCJmaWx0ZXIiLCJzdHJpbmciLCJvYmplY3RQbGFpbiIsImNvbmRpdGlvbiIsImZ1bmN0aW9uIiwibnVtYmVyIiwib3BlbiIsInRyaWdnZXJzIiwiY2xvbmUiLCJkZWVwIiwibm90RGVlcCIsInNjaGVkdWxlU2Nyb2xsUmVzZXQiLCJzY2hlZHVsZU5leHQiLCJzZXRUaW1lb3V0Iiwid2luZG93Iiwic2Nyb2xsIiwidHJhbnNpdGlvbkVuZCIsImRldGVjdEFuaW1hdGlvbiIsInNjcm9sbE9mZnNldCIsInNjcm9sbFkiLCJkb2N1bWVudE9mZnNldCIsInZpc2liaWxpdHlBcGlLZXlzIiwiZGVmaW5lZCIsImRvY3VtZW50IiwiaGlkZGVuIiwidmlzaWJpbGl0eWNoYW5nZSIsIm1zSGlkZGVuIiwid2Via2l0SGlkZGVuIiwiaXNJRSIsImFsbCIsImF0b2IiLCJpc0lFMTEiLCJuYXZpZ2F0b3IiLCJtc1BvaW50ZXJFbmFibGVkIiwiaXNFZGdlIiwidGVzdCIsInVzZXJBZ2VudCIsIlBvcHVwIiwiYm9keSIsIkV2ZW50RW1pdHRlciIsIndyYXBCb2R5IiwiYm9keUNoaWxkcmVuIiwiY2hpbGQiLCJpIiwibGVuIiwicmVmMSIsInBhcmVudCIsInNwYXduIiwiY2hpbGRyZW4iLCJzbGljZSIsInByZXBlbmRUbyIsInVud3JhcEJvZHkiLCJyZW1vdmUiLCJkZXN0cm95QWxsIiwiaW5zdGFuY2UiLCJpbnN0YW5jZXMiLCJkZXN0cm95IiwiY29uc3RydWN0b3IiLCJoZWxwZXJzIiwiTWF0aCIsInJvdW5kIiwicmFuZG9tIiwidG9TdHJpbmciLCJkZXN0cm95ZWQiLCJvZmZzZXQiLCJjb3VudCIsInB1c2giLCJfY3JlYXRlRWxlbWVudHMiLCJfYXR0YWNoQmluZGluZ3MiLCJfYXBwbHlUZW1wbGF0ZSIsImVsIiwiY29uZmlnIiwiZGF0YSIsInJlbGF0ZWRJbnN0YW5jZSIsImFwcGVuZFRvIiwiY3VzdG9tIiwidXBkYXRlT3B0aW9ucyIsInJlZjIiLCJiaW5kIiwib24iLCJlc2MiLCJldmVudCIsImtleUNvZGUiLCJzdG9wUHJvcGFnYXRpb24iLCJwcmV2ZW50RGVmYXVsdCIsImV4aXRJbnRlbnQiLCJiYXNlIiwidGhyZXNob2xkIiwiQlJPV1NFUiIsInlUaHJlc2hvbGQiLCJjbGllbnRZIiwibmF2aWdhdGlvbiIsInB1c2hTdGF0ZSIsImhpc3RvcnkiLCJyZXBsYWNlU3RhdGUiLCJiYWNrIiwiX2RldGFjaEJpbmRpbmdzIiwib2ZmIiwiX3Rocm93RGVzdHJveWVkIiwiRXJyb3IiLCJzZXRDb250ZW50IiwidGFyZ2V0IiwicXVpY2tFbCIsImRvbUVsIiwibGVuZ3RoIiwicmVwbGFjZVdpdGgiLCJjb250ZW50SGVpZ2h0Iiwid2luZG93SGVpZ2h0IiwicmF3IiwiY2xpZW50SGVpZ2h0IiwiaW5uZXJIZWlnaHQiLCJpbm5lcldpZHRoIiwidHJpZ2dlck5hbWUiLCJQcm9taXNlIiwicmVzb2x2ZSIsInRoZW4iLCJoYXNPcGVuIiwiZm9yY2VPcGVuIiwib3BlbkxpbWl0IiwibWluV2lkdGgiLCJwcm9taXNlQnJlYWsiLCJvcGVuUG9wdXBzIiwiZW1pdCIsIm1hcCIsInByb21pc2UiLCJwcm9taXNlRXZlbnQiLCJjYXRjaCIsImVuZCIsInByZXZlbnRSZXNldCIsInNwbGljZSIsImluZGV4T2YiLCJuZXdCdWlsZGVyIiwicXVpY2twb3B1cCIsInRlbXBsYXRlcyIsImJ1aWxkZXIiLCJhcmciLCJhcmd1bWVudHMiLCJodG1sVGVtcGxhdGUiLCJuZXdTZXR0aW5ncyIsIm5ld1RlbXBsYXRlcyIsIm5hbWUiLCJvdXRwdXRTZXR0aW5ncyIsIm91dHB1dFRlbXBsYXRlcyIsIm9iamVjdCIsIlN0cmluZyIsIk9iamVjdCIsInZlcnNpb24iXSwibWFwcGluZ3MiOiJ5NENBQUEsSUFBQUEsRUFBQTtBQUVBQSxFQUFBLEdBQUtDLEdBQUcsQ0FBQ0MsTUFBSixDQUFXLFNBQVgsQ0FBTDtBQUVBRixFQUFFLENBQUNHLElBQUgsQ0FDQztBQUFBLFdBQVNDLEdBQUcsQ0FBQ0MsSUFBYjtBQUNBLGFBQVdELEdBQUcsQ0FBQ0UsU0FEZjtBQUVBLGNBQVlGLEdBQUcsQ0FBQ0c7QUFGaEIsQ0FERDtBQUtBLFdBQWVQLEVBQWYsQ0NQQSxJQUFPUSxLQUFBLEdBQVFKLEdBQUcsQ0FBQ0ssUUFBSixDQUNkLENBQUMsS0FBRCxFQUNDO0FBQUFDLEVBQUFBLEdBQUEsRUFBSyxPQUFMO0FBQ0FDLEVBQUFBLEtBQUEsRUFDQztBQUFBQyxJQUFBQSxRQUFBLEVBQVUsVUFBVjtBQUNBQyxJQUFBQSxNQUFBLEVBQVEsR0FEUjtBQUVBQyxJQUFBQSxHQUFBLEVBQUssQ0FGTDtBQUdBQyxJQUFBQSxJQUFBLEVBQU0sQ0FITjtBQUlBQyxJQUFBQSxLQUFBLEVBQU8sT0FKUDtBQUtBQyxJQUFBQSxNQUFBLEVBQVEsQ0FMUjtBQU1BQyxJQUFBQSxTQUFBLEVBQVcsTUFOWDtBQU9BQyxJQUFBQSxVQUFBLEVBQVksUUFQWjtBQVFBQyxJQUFBQSxRQUFBLEVBQVUsUUFSVjtBQVNBQyxJQUFBQSxVQUFBLEVBQVksVUFBQ2IsS0FBRDthQUFVLHFCQUFx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
