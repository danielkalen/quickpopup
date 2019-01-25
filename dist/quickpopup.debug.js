(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?module.exports=f(require('quickdom'),require('smart-extend'),require('p-event'),require('promise-break'),require('@danielkalen/is'),require('detect-animation-end-helper'),require('event-lite')):typeof define==='function'&&define.amd?define(['quickdom','smart-extend','p-event','promise-break','@danielkalen/is','detect-animation-end-helper','event-lite'],f):(g=g||self,g.quickpopup=f(g.DOM,g.extend,g.promiseEvent,g.promiseBreak,g.IS_,g.detectAnimation,g.EventEmitter));}(this,function(DOM, extend, promiseEvent, promiseBreak, IS_, detectAnimation, EventEmitter){'use strict';DOM=DOM&&DOM.hasOwnProperty('default')?DOM['default']:DOM;extend=extend&&extend.hasOwnProperty('default')?extend['default']:extend;promiseEvent=promiseEvent&&promiseEvent.hasOwnProperty('default')?promiseEvent['default']:promiseEvent;promiseBreak=promiseBreak&&promiseBreak.hasOwnProperty('default')?promiseBreak['default']:promiseBreak;IS_=IS_&&IS_.hasOwnProperty('default')?IS_['default']:IS_;detectAnimation=detectAnimation&&detectAnimation.hasOwnProperty('default')?detectAnimation['default']:detectAnimation;EventEmitter=EventEmitter&&EventEmitter.hasOwnProperty('default')?EventEmitter['default']:EventEmitter;var IS;
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
}]);var templates = /*#__PURE__*/Object.freeze({popup: popup,overlay: overlay,content: content,close: close,bodyWrapper: bodyWrapper,html: html});var extendSettings = function (defaults, settings) {
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
      var close$$1, config, content$$1, data, overlay$$1;
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
      overlay$$1 = this.template.overlay.spawn(data, config).appendTo(this.el);
      content$$1 = this.template.content.spawn(data, config).appendTo(this.el);

      if (this.settings.close.show) {
        return close$$1 = this.template.close.spawn(data, config).appendTo(content$$1);
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
      var close$$1, hidden, ref1, ref2, visibilitychange;
      close$$1 = this.close.bind(this);
      this.el.child.overlay.on('mouseup touchend', close$$1);

      if ((ref1 = this.el.child.close) != null) {
        ref1.on('mouseup touchend', close$$1);
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
        DOM(document).on(`mouseleave.${this.id}`, event => {
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
        DOM(document).off(`mouseleave.${this.id}`);
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

        if (this.state.open || Popup.hasOpen && !this.settings.forceOpen || ++this.state.count >= this.settings.openLimit || window.innerWidth < this.settings.triggers.open.minWidth || this.settings.condition && !this.settings.condition()) {
          return promiseBreak();
        }
      }).then(() => {
        var openPopups;
        this.emit('beforeopen', triggerName);

        if (!Popup.hasOpen) {
          return this.state.offset = scrollOffset();
        } else {
          openPopups = Popup.instances.filter(popup$$1 => {
            return popup$$1 !== this && popup$$1.state.open;
          });
          return Promise.all(openPopups.map(popup$$1 => {
            this.state.offset = popup$$1.state.offset;
            return popup$$1.close(true);
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

newBuilder = function (defaults$$1, templates) {
  var builder;

  builder = function (arg) {

    switch (false) {
      case arguments.length !== 0:
        return new Popup$1(null, defaults$$1, templates);

      case typeof arg !== 'string':
        return new Popup$1({
          content: html.spawn({
            data: {
              html: arg
            }
          })
        }, defaults$$1, templates);

      case !DOM.isEl(arg):
      case !DOM.isQuickEl(arg):
        return new Popup$1({
          content: arg
        }, defaults$$1, templates);

      case !DOM.isTemplate(arg):
        return new Popup$1({
          content: arg.spawn()
        }, defaults$$1, templates);

      case !(arg && typeof arg === 'object'):
        return new Popup$1(arg, defaults$$1, templates);

      default:
        throw new Error('invalid argument provided to QuickPopup');
    }
  };

  builder.config = function (newSettings, newTemplates) {
    var name$$1, outputSettings, outputTemplates, template;

    if (!IS$1.object(newSettings)) {
      throw new Error(`QuickPopup Config: invalid config object provided ${String(newSettings)}`);
    }

    outputSettings = extend.clone.deep(defaults$$1, newSettings);

    if (!IS$1.object(newTemplates)) {
      outputTemplates = templates;
    } else {
      outputTemplates = Object.create(null);

      for (name$$1 in templates) {
        template = templates[name$$1];

        if (newTemplates[name$$1]) {
          outputTemplates[name$$1] = template.extend(newTemplates[name$$1]);
        } else {
          outputTemplates[name$$1] = template;
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
  builder.defaults = defaults$$1;
  builder.templates = templates;
  return builder;
};

quickpopup = newBuilder(defaults, templates);
var quickpopup$1 = quickpopup;return quickpopup$1;}));//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVpY2twb3B1cC5kZWJ1Zy5qcyIsInNvdXJjZXMiOlsiLi4vc3JjL2NoZWNrcy5jb2ZmZWUiLCIuLi9zcmMvdGVtcGxhdGUuY29mZmVlIiwiLi4vc3JjL2hlbHBlcnMuY29mZmVlIiwiLi4vc3JjL2Jyb3dzZXItaW5mby5jb2ZmZWUiLCIuLi9zcmMvcG9wdXAuY29mZmVlIiwiLi4vc3JjL2RlZmF1bHRzLmNvZmZlZSIsIi4uL3NyYy9pbmRleC5jb2ZmZWUiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IERPTSBmcm9tICdxdWlja2RvbSdcbmltcG9ydCBJU18gZnJvbSAnQGRhbmllbGthbGVuL2lzJ1xuSVMgPSBJU18uY3JlYXRlKCduYXRpdmVzJylcblxuSVMubG9hZFxuXHQnZG9tRWwnOiBET00uaXNFbFxuXHQncXVpY2tFbCc6IERPTS5pc1F1aWNrRWxcblx0J3RlbXBsYXRlJzogRE9NLmlzVGVtcGxhdGVcblxuZXhwb3J0IGRlZmF1bHQgSVMiLCJpbXBvcnQgRE9NIGZyb20gJ3F1aWNrZG9tJ1xuXG5leHBvcnQgcG9wdXAgPSBET00udGVtcGxhdGUoXG5cdFsnZGl2J1xuXHRcdHJlZjogJ3BvcHVwJ1xuXHRcdHN0eWxlOlxuXHRcdFx0cG9zaXRpb246ICdhYnNvbHV0ZSdcblx0XHRcdHpJbmRleDogMWU0XG5cdFx0XHR0b3A6IDBcblx0XHRcdGxlZnQ6IDBcblx0XHRcdHdpZHRoOiAnMTAwdncnXG5cdFx0XHRoZWlnaHQ6IDBcblx0XHRcdG1pbkhlaWdodDogJzEwMCUnXG5cdFx0XHR2aXNpYmlsaXR5OiAnaGlkZGVuJ1xuXHRcdFx0b3ZlcmZsb3c6ICdoaWRkZW4nXG5cdFx0XHR0cmFuc2l0aW9uOiAocG9wdXApLT4gXCJhbGwgMC4wMDFzIGxpbmVhciAje3BvcHVwLnNldHRpbmdzLmFuaW1hdGlvbisxfW1zXCJcblx0XHRcdFxuXHRcdFx0JG9wZW46XG5cdFx0XHRcdHRyYW5zaXRpb246ICgpLT4gJ2FsbCAwLjAwMXMgbGluZWFyIDBzJ1xuXHRcdFx0XHR2aXNpYmlsaXR5OiAndmlzaWJsZSdcblx0XHRcdFx0b3ZlcmZsb3c6ICd2aXNpYmxlJ1xuXHRcdFx0XHRoZWlnaHQ6ICdhdXRvJ1xuXG5cdF1cbilcblxuXG5leHBvcnQgb3ZlcmxheSA9IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0cmVmOiAnb3ZlcmxheSdcblx0XHRzdHlsZTpcblx0XHRcdHBvc2l0aW9uOiAnZml4ZWQnXG5cdFx0XHR6SW5kZXg6IDFcblx0XHRcdGxlZnQ6IDBcblx0XHRcdHRvcDogMFxuXHRcdFx0d2lkdGg6ICcxMDB2dydcblx0XHRcdG1pbkhlaWdodDogJzEwMHZoJ1xuXHRcdFx0b3BhY2l0eTogMFxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiAocG9wdXApLT4gcG9wdXAuc2V0dGluZ3Mub3ZlcmxheUNvbG9yXG5cdFx0XHR0cmFuc2l0aW9uOiAocG9wdXApLT4gXCJvcGFjaXR5ICN7cG9wdXAuc2V0dGluZ3MuYW5pbWF0aW9ufW1zXCJcblx0XHRcdCRvcGVuOlxuXHRcdFx0XHRvcGFjaXR5OiAxXG5cdF1cbilcblxuXG5leHBvcnQgY29udGVudCA9IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0cmVmOiAnY29udGVudCdcblx0XHRzdHlsZTpcblx0XHRcdHBvc2l0aW9uOiAnYWJzb2x1dGUnXG5cdFx0XHR6SW5kZXg6IDJcblx0XHRcdGJveFNpemluZzogJ2JvcmRlci1ib3gnXG5cdFx0XHRtYXhXaWR0aDogJzEwMCUnXG5cdFx0XHRtYXJnaW46ICcwIGF1dG8nXG5cdFx0XHRwYWRkaW5nOiAocG9wdXApLT4gcG9wdXAuc2V0dGluZ3MuY29udGVudFBhZGRpbmdcblx0XHRcdG9wYWNpdHk6IDBcblx0XHRcdHRyYW5zaXRpb246IChwb3B1cCktPlxuXHRcdFx0XHRkdXJhdGlvbiA9IHBvcHVwLnNldHRpbmdzLmFuaW1hdGlvblxuXHRcdFx0XHRcInRyYW5zZm9ybSAje2R1cmF0aW9ufW1zLFxuXHRcdFx0XHQtd2Via2l0LXRyYW5zZm9ybSAje2R1cmF0aW9ufW1zLFxuXHRcdFx0XHRvcGFjaXR5ICN7ZHVyYXRpb259bXNcIlxuXHRcdFx0XG5cdFx0XHQkb3Blbjpcblx0XHRcdFx0b3BhY2l0eTogMVxuXHRcdFx0XHRfOjBcblxuXHRcdFx0JGNlbnRlclBsYWNlbWVudDpcblx0XHRcdFx0bGVmdDogJzUwJSdcblx0XHRcdFx0dHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtNTAlKSdcblx0XHRcdFxuXHRcdFx0JHRvcFBsYWNlbWVudDpcblx0XHRcdFx0dG9wOiAwXG5cdFx0XHRcdGxlZnQ6ICc1MCUnXG5cdFx0XHRcdHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSkgdHJhbnNsYXRlWSgtMTAwJSknXG5cdFx0XHRcdCRvcGVuOlxuXHRcdFx0XHRcdHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSkgdHJhbnNsYXRlWSgwKSdcblx0XHRcdFx0XHRfOjFcblx0XHRcdFxuXHRcdFx0JGJvdHRvbVBsYWNlbWVudDpcblx0XHRcdFx0Ym90dG9tOiAwXG5cdFx0XHRcdGxlZnQ6ICc1MCUnXG5cdFx0XHRcdHRyYW5zZm9ybTogJ3RyYW5zbGF0ZVgoLTUwJSkgdHJhbnNsYXRlWSgxMDAlKSdcblx0XHRcdFx0JG9wZW46XG5cdFx0XHRcdFx0dHJhbnNmb3JtOiAndHJhbnNsYXRlWCgtNTAlKSB0cmFuc2xhdGVZKDApJ1xuXHRcdFx0XHRcdF86MlxuXG5cdFx0Y29tcHV0ZXJzOlxuXHRcdFx0cGxhY2VtZW50OiAocGxhY2VtZW50KS0+IEBzdGF0ZSBcIiN7cGxhY2VtZW50fVBsYWNlbWVudFwiLCBvblxuXHRcdFx0Y29udGVudDogKGNvbnRlbnQpLT4gQGFwcGVuZChjb250ZW50KSBpZiBjb250ZW50XG5cblx0XHRldmVudHM6ICdzdGF0ZUNoYW5nZTp2aXNpYmxlJzogKHZpc2libGUpLT5cblx0XHRcdGlmIHZpc2libGUgYW5kIERPTShAKS5yZWxhdGVkLnNldHRpbmdzLnBsYWNlbWVudCBpcyAnY2VudGVyJ1xuXHRcdFx0XHRET00oQCkucmVsYXRlZC5hbGlnblRvQ2VudGVyKClcblx0XVxuKVxuXG5cbmV4cG9ydCBjbG9zZSA9IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0cmVmOiAnY2xvc2UnXG5cdFx0c3R5bGU6XG5cdFx0XHRwb3NpdGlvbjogJ2Fic29sdXRlJ1xuXHRcdFx0ZGlzcGxheTogKHBvcHVwKS0+IGlmIHBvcHVwLnNldHRpbmdzLmNsb3NlLnNob3cgdGhlbiAnYmxvY2snIGVsc2UgJ25vbmUnXG5cdFx0XHR0b3A6IChwb3B1cCktPiBpZiBwb3B1cC5zZXR0aW5ncy5jbG9zZS5pbnNpZGUgdGhlbiBwb3B1cC5zZXR0aW5ncy5jbG9zZS5wYWRkaW5nIGVsc2UgcG9wdXAuc2V0dGluZ3MuY2xvc2Uuc2l6ZSoyLjUgKiAtMVxuXHRcdFx0cmlnaHQ6IChwb3B1cCktPiBpZiBwb3B1cC5zZXR0aW5ncy5jbG9zZS5pbnNpZGUgdGhlbiBwb3B1cC5zZXR0aW5ncy5jbG9zZS5wYWRkaW5nIGVsc2UgMFxuXHRcdFx0d2lkdGg6IChwb3B1cCktPiBwb3B1cC5zZXR0aW5ncy5jbG9zZS5zaXplXG5cdFx0XHRoZWlnaHQ6IChwb3B1cCktPiBwb3B1cC5zZXR0aW5ncy5jbG9zZS5zaXplXG5cdFx0XHRjb2xvcjogKHBvcHVwKS0+IHBvcHVwLnNldHRpbmdzLmNsb3NlLmNvbG9yXG5cblx0XHRbJypzdmcnXG5cdFx0XHRhdHRyczogdmlld0JveDpcIjAgMCA0OTIgNDkyXCJcblx0XHRcdHN0eWxlOiB3aWR0aDonMTAwJScsIGhlaWdodDonMTAwJSdcblxuXHRcdFx0WycqcGF0aCdcblx0XHRcdFx0YXR0cnM6IGQ6J00zMDAuMiAyNDZMNDg0LjEgNjJjNS4xLTUuMSA3LjktMTEuOCA3LjktMTkgMC03LjItMi44LTE0LTcuOS0xOUw0NjggNy45Yy01LjEtNS4xLTExLjgtNy45LTE5LTcuOSAtNy4yIDAtMTQgMi44LTE5IDcuOUwyNDYgMTkxLjggNjIgNy45Yy01LjEtNS4xLTExLjgtNy45LTE5LTcuOSAtNy4yIDAtMTQgMi44LTE5IDcuOUw3LjkgMjRjLTEwLjUgMTAuNS0xMC41IDI3LjYgMCAzOC4xTDE5MS44IDI0NiA3LjkgNDMwYy01LjEgNS4xLTcuOSAxMS44LTcuOSAxOSAwIDcuMiAyLjggMTQgNy45IDE5bDE2LjEgMTYuMWM1LjEgNS4xIDExLjggNy45IDE5IDcuOSA3LjIgMCAxNC0yLjggMTktNy45bDE4NC0xODQgMTg0IDE4NGM1LjEgNS4xIDExLjggNy45IDE5IDcuOWgwYzcuMiAwIDE0LTIuOCAxOS03LjlsMTYuMS0xNi4xYzUuMS01LjEgNy45LTExLjggNy45LTE5IDAtNy4yLTIuOC0xNC03LjktMTlMMzAwLjIgMjQ2eidcblx0XHRcdFx0c3R5bGU6IGZpbGw6IChwb3B1cCktPiBwb3B1cC5zZXR0aW5ncy5jbG9zZS5jb2xvclxuXHRcdFx0XVxuXHRcdF1cblx0XVxuKVxuXG5cbmV4cG9ydCBib2R5V3JhcHBlciA9IERPTS50ZW1wbGF0ZShcblx0WydkaXYnXG5cdFx0aWQ6ICdib2R5V3JhcHBlcidcblx0XHRwYXNzU3RhdGVUb0NoaWxkcmVuOiBmYWxzZVxuXHRcdHN0eWxlOlxuXHRcdFx0JG9wZW46XG5cdFx0XHRcdHBvc2l0aW9uOiAnZml4ZWQnXG5cdFx0XHRcdHdpZHRoOiAnMTAwJSdcblx0XHRcdFx0dG9wOiAnMCdcblx0XVxuKVxuXG5cbmV4cG9ydCBodG1sID0gRE9NLnRlbXBsYXRlKFxuXHRbJ2Rpdidcblx0XHRjb21wdXRlcnM6IGh0bWw6IChodG1sKS0+IEBodG1sID0gaHRtbFxuXHRdXG4pXG4iLCJpbXBvcnQgSVMgZnJvbSAnLi9jaGVja3MnXG5pbXBvcnQgZXh0ZW5kIGZyb20gJ3NtYXJ0LWV4dGVuZCdcbmltcG9ydCBkZXRlY3RBbmltYXRpb24gZnJvbSAnZGV0ZWN0LWFuaW1hdGlvbi1lbmQtaGVscGVyJ1xuXG5leHBvcnQgZXh0ZW5kU2V0dGluZ3MgPSAoZGVmYXVsdHMsIHNldHRpbmdzKS0+XG5cdGV4dGVuZFxuXHRcdC5maWx0ZXJcblx0XHRcdHBsYWNlbWVudDogSVMuc3RyaW5nXG5cdFx0XHR0ZW1wbGF0ZTogSVMub2JqZWN0UGxhaW5cblx0XHRcdGNvbmRpdGlvbjogSVMuZnVuY3Rpb25cblx0XHRcdGFuaW1hdGlvbjogSVMubnVtYmVyXG5cdFx0XHRvdmVybGF5Q29sb3I6IElTLnN0cmluZ1xuXHRcdFx0b3BlbjogSVMub2JqZWN0UGxhaW5cblx0XHRcdGNsb3NlOiBJUy5vYmplY3RQbGFpblxuXHRcdFx0dHJpZ2dlcnM6IElTLm9iamVjdFBsYWluXG5cblx0XHQuY2xvbmUuZGVlcC5ub3REZWVwKCdjb250ZW50JykoZGVmYXVsdHMsIHNldHRpbmdzKVxuXG5cbmV4cG9ydCBzY2hlZHVsZVNjcm9sbFJlc2V0ID0gKHNjaGVkdWxlTmV4dCktPiBzZXRUaW1lb3V0ICgpLT5cblx0d2luZG93LnNjcm9sbCgwLDApXG5cdFxuXHRpZiBzY2hlZHVsZU5leHRcblx0XHRzZXRUaW1lb3V0ICgpLT5cblx0XHRcdHNjaGVkdWxlU2Nyb2xsUmVzZXQoKVxuXHRcdCwgc2NoZWR1bGVOZXh0XG5cbmV4cG9ydCB0cmFuc2l0aW9uRW5kID0gKCktPlxuXHRkZXRlY3RBbmltYXRpb24oJ3RyYW5zaXRpb24nKVxuXG5leHBvcnQgc2Nyb2xsT2Zmc2V0ID0gKCktPlxuXHR3aW5kb3cuc2Nyb2xsWSAtIGRvY3VtZW50T2Zmc2V0KClcblxuZXhwb3J0IGRvY3VtZW50T2Zmc2V0ID0gKCktPlxuXHQoZG9jdW1lbnQuYm9keS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKT8udG9wIG9yIDApICsgd2luZG93LnNjcm9sbFlcblxuXG5leHBvcnQgdmlzaWJpbGl0eUFwaUtleXMgPSAoKS0+IHN3aXRjaFxuXHR3aGVuIElTLmRlZmluZWQoZG9jdW1lbnQuaGlkZGVuKVxuXHRcdGhpZGRlbjonaGlkZGVuJywgdmlzaWJpbGl0eWNoYW5nZTondmlzaWJpbGl0eWNoYW5nZSdcblx0XG5cdHdoZW4gSVMuZGVmaW5lZChkb2N1bWVudC5tc0hpZGRlbilcblx0XHRoaWRkZW46J21zSGlkZGVuJywgdmlzaWJpbGl0eWNoYW5nZTonbXN2aXNpYmlsaXR5Y2hhbmdlJ1xuXHRcblx0d2hlbiBJUy5kZWZpbmVkKGRvY3VtZW50LndlYmtpdEhpZGRlbilcblx0XHRoaWRkZW46J3dlYmtpdEhpZGRlbicsIHZpc2liaWxpdHljaGFuZ2U6J3dlYmtpdHZpc2liaWxpdHljaGFuZ2UnXG5cblx0ZWxzZSB7fVxuXG4iLCJleHBvcnQgaXNJRSA9IGRvY3VtZW50LmFsbCBhbmQgIXdpbmRvdy5hdG9iXG5leHBvcnQgaXNJRTExID0gd2luZG93Lm5hdmlnYXRvci5tc1BvaW50ZXJFbmFibGVkXG5leHBvcnQgaXNFZGdlID0gL0VkZ2UvLnRlc3Qgd2luZG93Lm5hdmlnYXRvcj8udXNlckFnZW50IG9yICcnIiwiaW1wb3J0IHByb21pc2VFdmVudCBmcm9tICdwLWV2ZW50J1xuaW1wb3J0IHByb21pc2VCcmVhayBmcm9tICdwcm9taXNlLWJyZWFrJ1xuaW1wb3J0IERPTSBmcm9tICdxdWlja2RvbSdcbmltcG9ydCBJUyBmcm9tICcuL2NoZWNrcydcbmltcG9ydCAqIGFzIHRlbXBsYXRlIGZyb20gJy4vdGVtcGxhdGUnXG5pbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJy4vaGVscGVycydcbmltcG9ydCAqIGFzIEJST1dTRVIgZnJvbSAnLi9icm93c2VyLWluZm8nXG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gJ2V2ZW50LWxpdGUnXG5ib2R5ID0gRE9NKGRvY3VtZW50LmJvZHkpXG5cbmNsYXNzIFBvcHVwIGV4dGVuZHMgRXZlbnRFbWl0dGVyXG5cdEBpbnN0YW5jZXM6IFtdXG5cdEBoYXNPcGVuOiBmYWxzZVxuXHRAYm9keVdyYXBwZXI6IG51bGxcblx0QHRyYW5zaXRpb25FbmQ6IGhlbHBlcnMudHJhbnNpdGlvbkVuZCgpXG5cblx0QHdyYXBCb2R5OiAoKS0+IHVubGVzcyBAYm9keVdyYXBwZXI/LnBhcmVudFxuXHRcdEBib2R5V3JhcHBlciA9IHRlbXBsYXRlLmJvZHlXcmFwcGVyLnNwYXduKClcblx0XHRib2R5Q2hpbGRyZW4gPSBib2R5LmNoaWxkcmVuLnNsaWNlKClcblx0XHRAYm9keVdyYXBwZXIucHJlcGVuZFRvKGJvZHkpXG5cdFx0QGJvZHlXcmFwcGVyLmFwcGVuZChjaGlsZCkgZm9yIGNoaWxkIGluIGJvZHlDaGlsZHJlblxuXHRcdHJldHVyblxuXG5cdEB1bndyYXBCb2R5OiAoKS0+IGlmIEBib2R5V3JhcHBlclxuXHRcdGJvZHlDaGlsZHJlbiA9IEBib2R5V3JhcHBlci5jaGlsZHJlbi5zbGljZSgpXG5cdFx0Ym9keS5hcHBlbmQoY2hpbGQpIGZvciBjaGlsZCBpbiBib2R5Q2hpbGRyZW5cblx0XHRAYm9keVdyYXBwZXIucmVtb3ZlKClcblx0XHRAYm9keVdyYXBwZXIgPSBudWxsXG5cblx0QGRlc3Ryb3lBbGw6ICgpLT5cblx0XHRpbnN0YW5jZXMgPSBAaW5zdGFuY2VzLnNsaWNlKClcblx0XHRpbnN0YW5jZS5kZXN0cm95KCkgZm9yIGluc3RhbmNlIGluIGluc3RhbmNlc1xuXHRcdEB1bndyYXBCb2R5KClcblxuXG5cblxuXG5cdGNvbnN0cnVjdG9yOiAoc2V0dGluZ3MsIGRlZmF1bHRzLCBAdGVtcGxhdGUpLT5cblx0XHRzdXBlcigpXG5cdFx0QHNldHRpbmdzID0gaGVscGVycy5leHRlbmRTZXR0aW5ncyhkZWZhdWx0cywgc2V0dGluZ3MpXG5cdFx0QGlkID0gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpKjFlNSkudG9TdHJpbmcoMTYpXG5cdFx0QHN0YXRlID0gb3BlbjpmYWxzZSwgZGVzdHJveWVkOmZhbHNlLCBvZmZzZXQ6MCwgY291bnQ6MFxuXHRcdEBjb250ZW50ID0gRE9NKEBzZXR0aW5ncy5jb250ZW50KSBpZiBAc2V0dGluZ3MuY29udGVudFxuXG5cdFx0UG9wdXAuaW5zdGFuY2VzLnB1c2goQClcblx0XHRQb3B1cC53cmFwQm9keSgpXG5cdFx0QF9jcmVhdGVFbGVtZW50cygpXG5cdFx0QF9hdHRhY2hCaW5kaW5ncygpXG5cdFx0QF9hcHBseVRlbXBsYXRlKCkgaWYgQHNldHRpbmdzLnRlbXBsYXRlIGFuZCB0eXBlb2YgQHNldHRpbmdzLnRlbXBsYXRlIGlzICdvYmplY3QnXG5cblx0XHRAZWwucHJlcGVuZFRvKGJvZHkpXG5cdFx0QG9wZW4oKSBpZiBAc2V0dGluZ3Mub3BlblxuXG5cblx0X2NyZWF0ZUVsZW1lbnRzOiAoKS0+XG5cdFx0ZGF0YSA9IGRhdGE6e0Bjb250ZW50LCBwbGFjZW1lbnQ6QHNldHRpbmdzLnBsYWNlbWVudH1cblx0XHRjb25maWcgPSByZWxhdGVkSW5zdGFuY2U6IEBcblx0XHRcblx0XHRAZWwgPSBAdGVtcGxhdGUucG9wdXAuc3Bhd24oZGF0YSwgY29uZmlnKVxuXHRcdG92ZXJsYXkgPSBAdGVtcGxhdGUub3ZlcmxheS5zcGF3bihkYXRhLCBjb25maWcpLmFwcGVuZFRvKEBlbClcblx0XHRjb250ZW50ID0gQHRlbXBsYXRlLmNvbnRlbnQuc3Bhd24oZGF0YSwgY29uZmlnKS5hcHBlbmRUbyhAZWwpXG5cdFx0Y2xvc2UgPSBAdGVtcGxhdGUuY2xvc2Uuc3Bhd24oZGF0YSwgY29uZmlnKS5hcHBlbmRUbyhjb250ZW50KSBpZiBAc2V0dGluZ3MuY2xvc2Uuc2hvd1xuXG5cblx0X2FwcGx5VGVtcGxhdGU6ICgpLT5cblx0XHRjdXN0b20gPSBAc2V0dGluZ3MudGVtcGxhdGVcblx0XHRmb3IgcmVmIG9mIEBlbC5jaGlsZFxuXHRcdFx0QGVsLmNoaWxkW3JlZl0udXBkYXRlT3B0aW9ucyhjdXN0b21bcmVmXSkgaWYgY3VzdG9tW3JlZl1cblxuXHRcdHJldHVyblxuXG5cdF9hdHRhY2hCaW5kaW5nczogKCktPlxuXHRcdGNsb3NlID0gQGNsb3NlLmJpbmQoQClcblx0XHRAZWwuY2hpbGQub3ZlcmxheS5vbiAnbW91c2V1cCB0b3VjaGVuZCcsIGNsb3NlXG5cdFx0QGVsLmNoaWxkLmNsb3NlPy5vbiAnbW91c2V1cCB0b3VjaGVuZCcsIGNsb3NlXG5cblx0XHRpZiBAc2V0dGluZ3MucGxhY2VtZW50IGlzICdjZW50ZXInXG5cdFx0XHRET00od2luZG93KS5vbiBcInJlc2l6ZS4je0BpZH1cIiwgKCk9PiBpZiBAc3RhdGUub3BlblxuXHRcdFx0XHRAYWxpZ25Ub0NlbnRlcigpXG5cblx0XHRpZiBAc2V0dGluZ3MudHJpZ2dlcnMuY2xvc2UuZXNjXG5cdFx0XHRET00oZG9jdW1lbnQpLm9uIFwia2V5dXAuI3tAaWR9XCIsIChldmVudCk9PiBpZiBldmVudC5rZXlDb2RlIGlzIDI3IGFuZCBAc3RhdGUub3BlblxuXHRcdFx0XHRldmVudC5zdG9wUHJvcGFnYXRpb24oKVxuXHRcdFx0XHRldmVudC5wcmV2ZW50RGVmYXVsdCgpXG5cdFx0XHRcdEBjbG9zZSgpXG5cblx0XHRpZiBAc2V0dGluZ3MudHJpZ2dlcnMub3Blbi52aXNpYmlsaXR5XG5cdFx0XHR7dmlzaWJpbGl0eWNoYW5nZSxoaWRkZW59ID0gaGVscGVycy52aXNpYmlsaXR5QXBpS2V5cygpXG5cdFx0XHRET00oZG9jdW1lbnQpLm9uIFwiI3t2aXNpYmlsaXR5Y2hhbmdlfS4je0BpZH1cIiwgKCk9PlxuXHRcdFx0XHRAb3BlbigndmlzaWJpbGl0eScpIGlmIGRvY3VtZW50W2hpZGRlbl1cblxuXHRcdGlmIEBzZXR0aW5ncy50cmlnZ2Vycy5vcGVuLmV4aXRJbnRlbnRcblx0XHRcdERPTShkb2N1bWVudCkub24gXCJtb3VzZWxlYXZlLiN7QGlkfVwiLCAoZXZlbnQpPT5cblx0XHRcdFx0YmFzZSA9IGlmIEJST1dTRVIuaXNJRSBvciBCUk9XU0VSLmlzSUUxMSBvciBCUk9XU0VSLmlzRWRnZSB0aGVuIDExMCBlbHNlIDBcblx0XHRcdFx0dGhyZXNob2xkID0gQHNldHRpbmdzLnlUaHJlc2hvbGQgKyBiYXNlXG5cdFx0XHRcdEBvcGVuKCdleGl0SW50ZW50JykgaWYgZXZlbnQuY2xpZW50WSA8PSB0aHJlc2hvbGRcblxuXHRcdGlmIEBzZXR0aW5ncy50cmlnZ2Vycy5vcGVuLm5hdmlnYXRpb24gYW5kIHdpbmRvdy5oaXN0b3J5Py5wdXNoU3RhdGVcblx0XHRcdHdpbmRvdy5oaXN0b3J5LnJlcGxhY2VTdGF0ZSB7aWQ6J3F1aWNrcG9wdXAtb3JpZ2luJ30sICcnLCAnJ1xuXHRcdFx0d2luZG93Lmhpc3RvcnkucHVzaFN0YXRlIHtpZDoncXVpY2twb3B1cCd9LCAnJywgJydcblx0XHRcdFxuXHRcdFx0RE9NKHdpbmRvdykub24gXCJwb3BzdGF0ZS4je0BpZH1cIiwgKGV2ZW50KT0+XG5cdFx0XHRcdGlmIGV2ZW50LnN0YXRlLnN0YXRlLmlkIGlzICdxdWlja3BvcHVwLW9yaWdpbicgYW5kIEBvcGVuKCduYXZpZ2F0aW9uJylcblx0XHRcdFx0XHQ7XG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHR3aW5kb3cuaGlzdG9yeS5iYWNrKClcblxuXG5cdF9kZXRhY2hCaW5kaW5nczogKCktPlxuXHRcdEBlbC5jaGlsZC5vdmVybGF5Lm9mZigpXG5cdFx0QGVsLmNoaWxkLmNsb3NlPy5vZmYoKVxuXHRcdHt2aXNpYmlsaXR5Y2hhbmdlLGhpZGRlbn0gPSBoZWxwZXJzLnZpc2liaWxpdHlBcGlLZXlzKClcblx0XHRcblx0XHRET00od2luZG93KS5vZmYgXCJyZXNpemUuI3tAaWR9XCIgaWYgQHNldHRpbmdzLnBsYWNlbWVudCBpcyAnY2VudGVyJ1xuXHRcdERPTSh3aW5kb3cpLm9mZiBcInBvcHN0YXRlLiN7QGlkfVwiIGlmIEBzZXR0aW5ncy50cmlnZ2Vycy5vcGVuLm5hdmlnYXRpb25cblx0XHRET00oZG9jdW1lbnQpLm9mZiBcIm1vdXNlbGVhdmUuI3tAaWR9XCIgaWYgQHNldHRpbmdzLnRyaWdnZXJzLm9wZW4uZXhpdEludGVudFxuXHRcdERPTShkb2N1bWVudCkub2ZmIFwiI3t2aXNpYmlsaXR5Y2hhbmdlfS4je0BpZH1cIiBpZiBAc2V0dGluZ3MudHJpZ2dlcnMub3Blbi52aXNpYmlsaXR5XG5cdFx0RE9NKGRvY3VtZW50KS5vZmYgXCJrZXl1cC4je0BpZH1cIiBpZiBAc2V0dGluZ3MudHJpZ2dlcnMuY2xvc2UuZXNjXG5cblxuXHRfdGhyb3dEZXN0cm95ZWQ6ICgpLT5cblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkIGF0dGVtcHQgdG8gb3BlcmF0ZSBhIGRlc3Ryb3llZCBwb3B1cCBpbnN0YW5jZVwiKVxuXG5cblxuXG5cblxuXG5cblxuXG5cblxuXHRzZXRDb250ZW50OiAodGFyZ2V0KS0+XG5cdFx0QGNvbnRlbnQgPSBzd2l0Y2hcblx0XHRcdHdoZW4gSVMucXVpY2tFbCh0YXJnZXQpIHRoZW4gdGFyZ2V0XG5cdFx0XHR3aGVuIElTLmRvbUVsKHRhcmdldCkgdGhlbiBET00odGFyZ2V0KVxuXHRcdFx0d2hlbiBJUy50ZW1wbGF0ZSh0YXJnZXQpIHRoZW4gdGFyZ2V0LnNwYXduKClcblx0XHRcdHdoZW4gSVMuc3RyaW5nKHRhcmdldCkgdGhlbiB0ZW1wbGF0ZS5odG1sLnNwYXduKGRhdGE6aHRtbDp0YXJnZXQpXG5cdFx0XHRlbHNlIHRocm93IG5ldyBFcnJvcignaW52YWxpZCB0YXJnZXQgcHJvdmlkZWQgdG8gUG9wdXA6OnNldENvbnRlbnQoKScpXG5cdFx0XG5cdFx0aWYgQGVsLmNoaWxkLmNvbnRlbnQuY2hpbGRyZW4ubGVuZ3RoXG5cdFx0XHRAZWwuY2hpbGQuY29udGVudC5jaGlsZHJlblsxXS5yZXBsYWNlV2l0aCBAY29udGVudFxuXHRcdGVsc2Vcblx0XHRcdEBlbC5jaGlsZC5jb250ZW50LmFwcGVuZCBAY29udGVudFxuXG5cblx0YWxpZ25Ub0NlbnRlcjogKCktPlxuXHRcdGNvbnRlbnRIZWlnaHQgPSBAZWwuY2hpbGQuY29udGVudC5yYXcuY2xpZW50SGVpZ2h0XG5cdFx0d2luZG93SGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0XG5cdFx0XG5cdFx0aWYgY29udGVudEhlaWdodCA+PSB3aW5kb3dIZWlnaHQtODBcblx0XHRcdG9mZnNldCA9IGlmIHdpbmRvdy5pbm5lcldpZHRoID4gNzM2IHRoZW4gMTAwIGVsc2UgNjBcblx0XHRlbHNlXG5cdFx0XHRvZmZzZXQgPSAod2luZG93SGVpZ2h0IC0gY29udGVudEhlaWdodCkvMlxuXHRcdFxuXHRcdEBlbC5jaGlsZC5jb250ZW50LnN0eWxlICdtYXJnaW4nLCBcIiN7b2Zmc2V0fXB4IGF1dG9cIlxuXG5cblx0b3BlbjogKHRyaWdnZXJOYW1lKS0+XG5cdFx0UHJvbWlzZS5yZXNvbHZlKClcblx0XHRcdC50aGVuICgpPT5cblx0XHRcdFx0QF90aHJvd0Rlc3Ryb3llZCgpIGlmIEBzdGF0ZS5kZXN0cm95ZWRcblx0XHRcdFx0cHJvbWlzZUJyZWFrKCkgaWYgZmFsc2Ugb3Jcblx0XHRcdFx0XHRAc3RhdGUub3BlbiBvciAoUG9wdXAuaGFzT3BlbiBhbmQgbm90IEBzZXR0aW5ncy5mb3JjZU9wZW4pIG9yXG5cdFx0XHRcdFx0KytAc3RhdGUuY291bnQgPj0gQHNldHRpbmdzLm9wZW5MaW1pdCBvclxuXHRcdFx0XHRcdHdpbmRvdy5pbm5lcldpZHRoIDwgQHNldHRpbmdzLnRyaWdnZXJzLm9wZW4ubWluV2lkdGggb3Jcblx0XHRcdFx0XHRAc2V0dGluZ3MuY29uZGl0aW9uIGFuZCBub3QgQHNldHRpbmdzLmNvbmRpdGlvbigpXG5cdFx0XHRcblx0XHRcdC50aGVuICgpPT5cblx0XHRcdFx0QGVtaXQgJ2JlZm9yZW9wZW4nLCB0cmlnZ2VyTmFtZVxuXHRcdFx0XHRcblx0XHRcdFx0aWYgbm90IFBvcHVwLmhhc09wZW5cblx0XHRcdFx0XHRAc3RhdGUub2Zmc2V0ID0gaGVscGVycy5zY3JvbGxPZmZzZXQoKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0b3BlblBvcHVwcyA9IFBvcHVwLmluc3RhbmNlcy5maWx0ZXIgKHBvcHVwKT0+IHBvcHVwIGlzbnQgQCBhbmQgcG9wdXAuc3RhdGUub3BlblxuXHRcdFx0XHRcdFByb21pc2UuYWxsIG9wZW5Qb3B1cHMubWFwIChwb3B1cCk9PlxuXHRcdFx0XHRcdFx0QHN0YXRlLm9mZnNldCA9IHBvcHVwLnN0YXRlLm9mZnNldFxuXHRcdFx0XHRcdFx0cG9wdXAuY2xvc2UodHJ1ZSlcblx0XHRcdFx0XG5cdFx0XHQudGhlbiAoKT0+XG5cdFx0XHRcdGhlbHBlcnMuc2NoZWR1bGVTY3JvbGxSZXNldCg1KVxuXHRcdFx0XHRQb3B1cC5ib2R5V3JhcHBlci5zdGF0ZSAnb3BlbicsIG9uXG5cdFx0XHRcdFBvcHVwLmJvZHlXcmFwcGVyLnN0eWxlICd0b3AnLCBAc3RhdGUub2Zmc2V0Ki0xXG5cdFx0XHRcdEBlbC5zdGF0ZSAnb3BlbicsIG9uXG5cdFx0XHRcdEBzdGF0ZS5vcGVuID0gUG9wdXAuaGFzT3BlbiA9IHRydWVcblx0XHRcdFx0QGFsaWduVG9DZW50ZXIoKSBpZiBAc2V0dGluZ3MucGxhY2VtZW50IGlzICdjZW50ZXInXG5cdFx0XHRcdEBlbWl0ICdvcGVuJywgdHJpZ2dlck5hbWVcblx0XHRcdFx0XG5cdFx0XHRcdGlmIG5vdCBAc2V0dGluZ3MuYW5pbWF0aW9uIG9yIG5vdCBQb3B1cC50cmFuc2l0aW9uRW5kXG5cdFx0XHRcdFx0QGVtaXQgJ2ZpbmlzaG9wZW4nXG5cdFx0XHRcdGVsc2Vcblx0XHRcdFx0XHRwcm9taXNlID0gcHJvbWlzZUV2ZW50KEAsICdmaW5pc2hvcGVuJylcblx0XHRcdFx0XHRcblx0XHRcdFx0XHRAZWwuY2hpbGQuY29udGVudC5vbiBQb3B1cC50cmFuc2l0aW9uRW5kLCAoZXZlbnQpPT4gaWYgZXZlbnQudGFyZ2V0IGlzIEBlbC5jaGlsZC5jb250ZW50LnJhd1xuXHRcdFx0XHRcdFx0QGVtaXQgJ2ZpbmlzaG9wZW4nXG5cdFx0XHRcdFx0XHRAZWwuY2hpbGQuY29udGVudC5vZmYgUG9wdXAudHJhbnNpdGlvbkVuZFxuXHRcdFx0XHRcblx0XHRcdFx0XHRyZXR1cm4gcHJvbWlzZVxuXG5cdFx0XHQuY2F0Y2ggcHJvbWlzZUJyZWFrLmVuZFxuXHRcdFx0LnRoZW4gKCk9PiBAXG5cblxuXHRjbG9zZTogKHByZXZlbnRSZXNldCktPlxuXHRcdFByb21pc2UucmVzb2x2ZSgpXG5cdFx0XHQudGhlbiAoKT0+IHByb21pc2VCcmVhaygpIGlmIG5vdCBAc3RhdGUub3BlblxuXHRcdFx0LnRoZW4gKCk9PlxuXHRcdFx0XHRAZW1pdCAnYmVmb3JlY2xvc2UnXG5cblx0XHRcdFx0dW5sZXNzIHByZXZlbnRSZXNldCBpcyB0cnVlXG5cdFx0XHRcdFx0c2V0VGltZW91dCAoKT0+IHVubGVzcyBQb3B1cC5oYXNPcGVuXG5cdFx0XHRcdFx0XHRQb3B1cC5ib2R5V3JhcHBlcj8uc3RhdGUgJ29wZW4nLCBvZmZcblx0XHRcdFx0XHRcdFBvcHVwLmJvZHlXcmFwcGVyPy5zdHlsZSAndG9wJywgbnVsbFxuXHRcdFx0XHRcdFx0d2luZG93LnNjcm9sbCAwLCBAc3RhdGUub2Zmc2V0ICsgaGVscGVycy5kb2N1bWVudE9mZnNldCgpXG5cblx0XHRcdFx0XHRQb3B1cC5oYXNPcGVuID0gZmFsc2VcblxuXHRcdFx0XHRAZWwuc3RhdGUgJ29wZW4nLCBvZmZcblx0XHRcdFx0QHN0YXRlLm9wZW4gPSBmYWxzZVxuXHRcdFx0XHRAZW1pdCAnY2xvc2UnXG5cdFx0XHRcdGlmIG5vdCBAc2V0dGluZ3MuYW5pbWF0aW9uIG9yIG5vdCBQb3B1cC50cmFuc2l0aW9uRW5kXG5cdFx0XHRcdFx0QGVtaXQgJ2ZpbmlzaGNsb3NlJ1xuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0cHJvbWlzZSA9IHByb21pc2VFdmVudChALCAnZmluaXNoY2xvc2UnKVxuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdEBlbC5jaGlsZC5jb250ZW50Lm9uIFBvcHVwLnRyYW5zaXRpb25FbmQsIChldmVudCk9PiBpZiBldmVudC50YXJnZXQgaXMgQGVsLmNoaWxkLmNvbnRlbnQucmF3XG5cdFx0XHRcdFx0XHRAZW1pdCAnZmluaXNoY2xvc2UnXG5cdFx0XHRcdFx0XHRAZWwuY2hpbGQuY29udGVudC5vZmYgUG9wdXAudHJhbnNpdGlvbkVuZFxuXG5cdFx0XHRcdFx0cmV0dXJuIHByb21pc2Vcblx0XHRcdFxuXHRcdFx0LmNhdGNoIHByb21pc2VCcmVhay5lbmRcblx0XHRcdC50aGVuICgpPT4gQFxuXG5cblx0ZGVzdHJveTogKCktPlxuXHRcdEBfdGhyb3dEZXN0cm95ZWQoKSBpZiBAc2V0dGluZ3MuZGVzdHJveWVkXG5cdFx0QGNsb3NlKClcblx0XHRAX2RldGFjaEJpbmRpbmdzKClcblx0XHRAZWwucmVtb3ZlKClcblx0XHRQb3B1cC5pbnN0YW5jZXMuc3BsaWNlIFBvcHVwLmluc3RhbmNlcy5pbmRleE9mKEApLCAxXG5cdFx0cmV0dXJuIHRydWVcblxuXG5cblxuZXhwb3J0IGRlZmF1bHQgUG9wdXAiLCJleHBvcnQgZGVmYXVsdFxuXHRwbGFjZW1lbnQ6ICdjZW50ZXInXG5cdG9wZW46IGZhbHNlXG5cdGZvcmNlT3BlbjogZmFsc2Vcblx0dGVtcGxhdGU6IG51bGxcblx0Y29uZGl0aW9uOiBudWxsXG5cdGFuaW1hdGlvbjogMzAwXG5cdGNvbnRlbnRQYWRkaW5nOiAwXG5cdHlUaHJlc2hvbGQ6IDE1XG5cdG9wZW5MaW1pdDogSW5maW5pdHlcblx0b3ZlcmxheUNvbG9yOiAncmdiYSgwLDAsMCwwLjg4KSdcblx0Y2xvc2U6XG5cdFx0c2hvdzogZmFsc2Vcblx0XHRwYWRkaW5nOiAyMFxuXHRcdGluc2lkZTogZmFsc2Vcblx0XHRzaXplOiAyMlxuXG5cdHRyaWdnZXJzOlxuXHRcdG9wZW46XG5cdFx0XHRuYXZpZ2F0aW9uOiBmYWxzZVxuXHRcdFx0dmlzaWJpbGl0eTogZmFsc2Vcblx0XHRcdGV4aXRJbnRlbnQ6IGZhbHNlXG5cdFx0Y2xvc2U6XG5cdFx0XHRlc2M6IHRydWUiLCJpbXBvcnQgRE9NIGZyb20gJ3F1aWNrZG9tJ1xuaW1wb3J0IGV4dGVuZCBmcm9tICdzbWFydC1leHRlbmQnXG5pbXBvcnQgUG9wdXAgZnJvbSAnLi9wb3B1cCdcbmltcG9ydCBJUyBmcm9tICcuL2NoZWNrcydcbmltcG9ydCBkZWZhdWx0cyBmcm9tICcuL2RlZmF1bHRzJ1xuaW1wb3J0ICogYXMgdGVtcGxhdGVzIGZyb20gJy4vdGVtcGxhdGUnXG5pbXBvcnQge2h0bWwgYXMgaHRtbFRlbXBsYXRlfSBmcm9tICcuL3RlbXBsYXRlJ1xuaW1wb3J0IHt2ZXJzaW9ufSBmcm9tICcuLi9wYWNrYWdlLmpzb24nXG5cblxubmV3QnVpbGRlciA9IChkZWZhdWx0cywgdGVtcGxhdGVzKS0+XG5cdGJ1aWxkZXIgPSAoYXJnKS0+XG5cdFx0YXJncyA9IGFyZ3VtZW50c1xuXHRcdHN3aXRjaFxuXHRcdFx0d2hlbiBhcmd1bWVudHMubGVuZ3RoIGlzIDBcblx0XHRcdFx0bmV3IFBvcHVwKG51bGwsIGRlZmF1bHRzLCB0ZW1wbGF0ZXMpXG5cblx0XHRcdHdoZW4gdHlwZW9mIGFyZyBpcyAnc3RyaW5nJ1xuXHRcdFx0XHRuZXcgUG9wdXAoY29udGVudDpodG1sVGVtcGxhdGUuc3Bhd24oZGF0YTpodG1sOmFyZyksIGRlZmF1bHRzLCB0ZW1wbGF0ZXMpXG5cdFx0XHRcblx0XHRcdHdoZW4gRE9NLmlzRWwoYXJnKSwgRE9NLmlzUXVpY2tFbChhcmcpXG5cdFx0XHRcdG5ldyBQb3B1cChjb250ZW50OmFyZywgZGVmYXVsdHMsIHRlbXBsYXRlcylcblx0XHRcdFxuXHRcdFx0d2hlbiBET00uaXNUZW1wbGF0ZShhcmcpXG5cdFx0XHRcdG5ldyBQb3B1cChjb250ZW50OmFyZy5zcGF3bigpLCBkZWZhdWx0cywgdGVtcGxhdGVzKVxuXG5cdFx0XHR3aGVuIGFyZyBhbmQgdHlwZW9mIGFyZyBpcyAnb2JqZWN0J1xuXHRcdFx0XHRuZXcgUG9wdXAoYXJnLCBkZWZhdWx0cywgdGVtcGxhdGVzKVxuXG5cdFx0XHRlbHNlIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBhcmd1bWVudCBwcm92aWRlZCB0byBRdWlja1BvcHVwJylcblxuXG5cdGJ1aWxkZXIuY29uZmlnID0gKG5ld1NldHRpbmdzLCBuZXdUZW1wbGF0ZXMpLT5cblx0XHR0aHJvdyBuZXcgRXJyb3IgXCJRdWlja1BvcHVwIENvbmZpZzogaW52YWxpZCBjb25maWcgb2JqZWN0IHByb3ZpZGVkICN7U3RyaW5nIG5ld1NldHRpbmdzfVwiIGlmIG5vdCBJUy5vYmplY3QobmV3U2V0dGluZ3MpXG5cdFx0b3V0cHV0U2V0dGluZ3MgPSBleHRlbmQuY2xvbmUuZGVlcChkZWZhdWx0cywgbmV3U2V0dGluZ3MpXG5cblx0XHRpZiBub3QgSVMub2JqZWN0KG5ld1RlbXBsYXRlcylcblx0XHRcdG91dHB1dFRlbXBsYXRlcyA9IHRlbXBsYXRlc1xuXHRcdGVsc2Vcblx0XHRcdG91dHB1dFRlbXBsYXRlcyA9IE9iamVjdC5jcmVhdGUobnVsbClcblx0XHRcdGZvciBuYW1lLHRlbXBsYXRlIG9mIHRlbXBsYXRlc1xuXHRcdFx0XHRpZiBuZXdUZW1wbGF0ZXNbbmFtZV1cblx0XHRcdFx0XHRvdXRwdXRUZW1wbGF0ZXNbbmFtZV0gPSB0ZW1wbGF0ZS5leHRlbmQobmV3VGVtcGxhdGVzW25hbWVdKVxuXHRcdFx0XHRlbHNlXG5cdFx0XHRcdFx0b3V0cHV0VGVtcGxhdGVzW25hbWVdID0gdGVtcGxhdGVcblx0XHRcblx0XHRyZXR1cm4gbmV3QnVpbGRlcihvdXRwdXRTZXR0aW5ncywgb3V0cHV0VGVtcGxhdGVzKVxuXHRcblxuXHRidWlsZGVyLndyYXBCb2R5ID0gKCktPiBQb3B1cC53cmFwQm9keSgpXG5cdGJ1aWxkZXIudW53cmFwQm9keSA9ICgpLT4gUG9wdXAudW53cmFwQm9keSgpXG5cdGJ1aWxkZXIuZGVzdHJveUFsbCA9ICgpLT4gUG9wdXAuZGVzdHJveUFsbCgpXG5cdGJ1aWxkZXIudmVyc2lvbiA9IHZlcnNpb25cblx0YnVpbGRlci5kZWZhdWx0cyA9IGRlZmF1bHRzXG5cdGJ1aWxkZXIudGVtcGxhdGVzID0gdGVtcGxhdGVzXG5cdHJldHVybiBidWlsZGVyXG5cblxuXG5cblxucXVpY2twb3B1cCA9IG5ld0J1aWxkZXIoZGVmYXVsdHMsIHRlbXBsYXRlcylcbmV4cG9ydCBkZWZhdWx0IHF1aWNrcG9wdXBcblxuXG5cbiJdLCJuYW1lcyI6WyJJUyIsIklTXyIsImNyZWF0ZSIsImxvYWQiLCJET00iLCJpc0VsIiwiaXNRdWlja0VsIiwiaXNUZW1wbGF0ZSIsInBvcHVwIiwidGVtcGxhdGUiLCJyZWYiLCJzdHlsZSIsInBvc2l0aW9uIiwiekluZGV4IiwidG9wIiwibGVmdCIsIndpZHRoIiwiaGVpZ2h0IiwibWluSGVpZ2h0IiwidmlzaWJpbGl0eSIsIm92ZXJmbG93IiwidHJhbnNpdGlvbiIsInNldHRpbmdzIiwiYW5pbWF0aW9uIiwiJG9wZW4iLCJvdmVybGF5Iiwib3BhY2l0eSIsImJhY2tncm91bmRDb2xvciIsIm92ZXJsYXlDb2xvciIsImNvbnRlbnQiLCJib3hTaXppbmciLCJtYXhXaWR0aCIsIm1hcmdpbiIsInBhZGRpbmciLCJjb250ZW50UGFkZGluZyIsImR1cmF0aW9uIiwiXyIsIiRjZW50ZXJQbGFjZW1lbnQiLCJ0cmFuc2Zvcm0iLCIkdG9wUGxhY2VtZW50IiwiJGJvdHRvbVBsYWNlbWVudCIsImJvdHRvbSIsImNvbXB1dGVycyIsInBsYWNlbWVudCIsInN0YXRlIiwiYXBwZW5kIiwiZXZlbnRzIiwidmlzaWJsZSIsInJlbGF0ZWQiLCJhbGlnblRvQ2VudGVyIiwiY2xvc2UiLCJkaXNwbGF5Iiwic2hvdyIsImluc2lkZSIsInNpemUiLCJyaWdodCIsImNvbG9yIiwiYXR0cnMiLCJ2aWV3Qm94IiwiZCIsImZpbGwiLCJib2R5V3JhcHBlciIsImlkIiwicGFzc1N0YXRlVG9DaGlsZHJlbiIsImh0bWwiLCJleHRlbmRTZXR0aW5ncyIsImRlZmF1bHRzIiwiZXh0ZW5kIiwiZmlsdGVyIiwic3RyaW5nIiwib2JqZWN0UGxhaW4iLCJjb25kaXRpb24iLCJmdW5jdGlvbiIsIm51bWJlciIsIm9wZW4iLCJ0cmlnZ2VycyIsImNsb25lIiwiZGVlcCIsIm5vdERlZXAiLCJzY2hlZHVsZVNjcm9sbFJlc2V0Iiwic2NoZWR1bGVOZXh0Iiwic2V0VGltZW91dCIsIndpbmRvdyIsInNjcm9sbCIsInRyYW5zaXRpb25FbmQiLCJkZXRlY3RBbmltYXRpb24iLCJzY3JvbGxPZmZzZXQiLCJzY3JvbGxZIiwiZG9jdW1lbnRPZmZzZXQiLCJ2aXNpYmlsaXR5QXBpS2V5cyIsImRlZmluZWQiLCJkb2N1bWVudCIsImhpZGRlbiIsInZpc2liaWxpdHljaGFuZ2UiLCJtc0hpZGRlbiIsIndlYmtpdEhpZGRlbiIsImlzSUUiLCJhbGwiLCJhdG9iIiwiaXNJRTExIiwibmF2aWdhdG9yIiwibXNQb2ludGVyRW5hYmxlZCIsImlzRWRnZSIsInRlc3QiLCJ1c2VyQWdlbnQiLCJQb3B1cCIsImJvZHkiLCJFdmVudEVtaXR0ZXIiLCJ3cmFwQm9keSIsImJvZHlDaGlsZHJlbiIsImNoaWxkIiwiaSIsImxlbiIsInJlZjEiLCJwYXJlbnQiLCJzcGF3biIsImNoaWxkcmVuIiwic2xpY2UiLCJwcmVwZW5kVG8iLCJ1bndyYXBCb2R5IiwicmVtb3ZlIiwiZGVzdHJveUFsbCIsImluc3RhbmNlIiwiaW5zdGFuY2VzIiwiZGVzdHJveSIsImNvbnN0cnVjdG9yIiwiaGVscGVycyIsIk1hdGgiLCJyb3VuZCIsInJhbmRvbSIsInRvU3RyaW5nIiwiZGVzdHJveWVkIiwib2Zmc2V0IiwiY291bnQiLCJwdXNoIiwiX2NyZWF0ZUVsZW1lbnRzIiwiX2F0dGFjaEJpbmRpbmdzIiwiX2FwcGx5VGVtcGxhdGUiLCJlbCIsImNvbmZpZyIsImRhdGEiLCJyZWxhdGVkSW5zdGFuY2UiLCJhcHBlbmRUbyIsImN1c3RvbSIsInVwZGF0ZU9wdGlvbnMiLCJyZWYyIiwiYmluZCIsIm9uIiwiZXNjIiwiZXZlbnQiLCJrZXlDb2RlIiwic3RvcFByb3BhZ2F0aW9uIiwicHJldmVudERlZmF1bHQiLCJleGl0SW50ZW50IiwiYmFzZSIsInRocmVzaG9sZCIsIkJST1dTRVIiLCJ5VGhyZXNob2xkIiwiY2xpZW50WSIsIm5hdmlnYXRpb24iLCJwdXNoU3RhdGUiLCJoaXN0b3J5IiwicmVwbGFjZVN0YXRlIiwiYmFjayIsIl9kZXRhY2hCaW5kaW5ncyIsIm9mZiIsIl90aHJvd0Rlc3Ryb3llZCIsIkVycm9yIiwic2V0Q29udGVudCIsInRhcmdldCIsInF1aWNrRWwiLCJkb21FbCIsImxlbmd0aCIsInJlcGxhY2VXaXRoIiwiY29udGVudEhlaWdodCIsIndpbmRvd0hlaWdodCIsInJhdyIsImNsaWVudEhlaWdodCIsImlubmVySGVpZ2h0IiwiaW5uZXJXaWR0aCIsInRyaWdnZXJOYW1lIiwiUHJvbWlzZSIsInJlc29sdmUiLCJ0aGVuIiwiaGFzT3BlbiIsImZvcmNlT3BlbiIsIm9wZW5MaW1pdCIsIm1pbldpZHRoIiwicHJvbWlzZUJyZWFrIiwib3BlblBvcHVwcyIsImVtaXQiLCJtYXAiLCJwcm9taXNlIiwicHJvbWlzZUV2ZW50IiwiY2F0Y2giLCJlbmQiLCJwcmV2ZW50UmVzZXQiLCJzcGxpY2UiLCJpbmRleE9mIiwibmV3QnVpbGRlciIsInF1aWNrcG9wdXAiLCJ0ZW1wbGF0ZXMiLCJidWlsZGVyIiwiYXJnIiwiYXJndW1lbnRzIiwiaHRtbFRlbXBsYXRlIiwibmV3U2V0dGluZ3MiLCJuZXdUZW1wbGF0ZXMiLCJuYW1lIiwib3V0cHV0U2V0dGluZ3MiLCJvdXRwdXRUZW1wbGF0ZXMiLCJvYmplY3QiLCJTdHJpbmciLCJPYmplY3QiLCJ2ZXJzaW9uIl0sIm1hcHBpbmdzIjoiOHVDQUFBLElBQUFBLEVBQUE7QUFBQSxBQUVBQSxFQUFBLEdBQUtDLEdBQUcsQ0FBQ0MsTUFBSixDQUFXLFNBQVgsQ0FBTDtBQUVBRixFQUFFLENBQUNHLElBQUgsQ0FDQztXQUFTQyxHQUFHLENBQUNDLElBQWI7YUFDV0QsR0FBRyxDQUFDRSxTQURmO2NBRVlGLEdBQUcsQ0FBQ0c7Q0FIakI7QUFLQSxXQUFlUCxFQUFmLENDUEEsSUFBT1EsS0FBUCxHQUFlSixHQUFHLENBQUNLLFFBQUosQ0FDZCxDQUFDLEtBQUQsRUFDQztFQUFBQyxHQUFBLEVBQUssT0FBTDtFQUNBQyxLQUFBLEVBQ0M7SUFBQUMsUUFBQSxFQUFVLFVBQVY7SUFDQUMsTUFBQSxFQUFRLEdBRFI7SUFFQUMsR0FBQSxFQUFLLENBRkw7SUFHQUMsSUFBQSxFQUFNLENBSE47SUFJQUMsS0FBQSxFQUFPLE9BSlA7SUFLQUMsTUFBQSxFQUFRLENBTFI7SUFNQUMsU0FBQSxFQUFXLE1BTlg7SUFPQUMsVUFBQSxFQUFZLFFBUFo7SUFRQUMsUUFBQSxFQUFVLFFBUlY7SUFTQUMsVUFBQSxFQUFZLFVBQUNiLEtBQUQ7YUFBVSxxQkFBcUJBLEtBQUssQ0FBQ2MsUUFBTixDQUFlQyxTQUFmLEdBQXlCLENBQUU7S0FUdEU7SUFXQUMsS0FBQSxFQUNDO01BQUFILFVBQUEsRUFBWTtlQUFLO09BQWpCO01BQ0FGLFVBQUEsRUFBWSxTQURaO01BRUFDLFFBQUEsRUFBVSxTQUZWO01BR0FILE1BQUEsRUFBUTs7O0NBbEJYLENBRGMsQ0FBZjtBQXlCQSxBQUFBLElBQU9RLE9BQVAsR0FBaUJyQixHQUFHLENBQUNLLFFBQUosQ0FDaEIsQ0FBQyxLQUFELEVBQ0M7RUFBQUMsR0FBQSxFQUFLLFNBQUw7RUFDQUMsS0FBQSxFQUNDO0lBQUFDLFFBQUEsRUFBVSxPQUFWO0lBQ0FDLE1BQUEsRUFBUSxDQURSO0lBRUFFLElBQUEsRUFBTSxDQUZOO0lBR0FELEdBQUEsRUFBSyxDQUhMO0lBSUFFLEtBQUEsRUFBTyxPQUpQO0lBS0FFLFNBQUEsRUFBVyxPQUxYO0lBTUFRLE9BQUEsRUFBUyxDQU5UO0lBT0FDLGVBQUEsRUFBaUIsVUFBQ25CLEtBQUQ7YUFBVUEsS0FBSyxDQUFDYyxRQUFOLENBQWVNO0tBUDFDO0lBUUFQLFVBQUEsRUFBWSxVQUFDYixLQUFEO2FBQVUsV0FBV0EsS0FBSyxDQUFDYyxRQUFOLENBQWVDLFNBQVU7S0FSMUQ7SUFTQUMsS0FBQSxFQUNDO01BQUFFLE9BQUEsRUFBUzs7O0NBYlosQ0FEZ0IsQ0FBakI7QUFtQkEsQUFBQSxJQUFPRyxPQUFQLEdBQWlCekIsR0FBRyxDQUFDSyxRQUFKLENBQ2hCLENBQUMsS0FBRCxFQUNDO0VBQUFDLEdBQUEsRUFBSyxTQUFMO0VBQ0FDLEtBQUEsRUFDQztJQUFBQyxRQUFBLEVBQVUsVUFBVjtJQUNBQyxNQUFBLEVBQVEsQ0FEUjtJQUVBaUIsU0FBQSxFQUFXLFlBRlg7SUFHQUMsUUFBQSxFQUFVLE1BSFY7SUFJQUMsTUFBQSxFQUFRLFFBSlI7SUFLQUMsT0FBQSxFQUFTLFVBQUN6QixLQUFEO2FBQVVBLEtBQUssQ0FBQ2MsUUFBTixDQUFlWTtLQUxsQztJQU1BUixPQUFBLEVBQVMsQ0FOVDtJQU9BTCxVQUFBLEVBQVksVUFBQ2IsS0FBRDtVQUNYMkI7TUFBQUEsUUFBQSxHQUFXM0IsS0FBSyxDQUFDYyxRQUFOLENBQWVDLFNBQTFCO2FBQ0EsYUFBYVksUUFBUyx5QkFDRkEsUUFBUyxlQUNuQkEsUUFBUztLQVhwQjtJQWFBWCxLQUFBLEVBQ0M7TUFBQUUsT0FBQSxFQUFTLENBQVQ7TUFDQVUsQ0FBQSxFQUFFO0tBZkg7SUFpQkFDLGdCQUFBLEVBQ0M7TUFBQXRCLElBQUEsRUFBTSxLQUFOO01BQ0F1QixTQUFBLEVBQVc7S0FuQlo7SUFxQkFDLGFBQUEsRUFDQztNQUFBekIsR0FBQSxFQUFLLENBQUw7TUFDQUMsSUFBQSxFQUFNLEtBRE47TUFFQXVCLFNBQUEsRUFBVyxvQ0FGWDtNQUdBZCxLQUFBLEVBQ0M7UUFBQWMsU0FBQSxFQUFXLGdDQUFYO1FBQ0FGLENBQUEsRUFBRTs7S0EzQko7SUE2QkFJLGdCQUFBLEVBQ0M7TUFBQUMsTUFBQSxFQUFRLENBQVI7TUFDQTFCLElBQUEsRUFBTSxLQUROO01BRUF1QixTQUFBLEVBQVcsbUNBRlg7TUFHQWQsS0FBQSxFQUNDO1FBQUFjLFNBQUEsRUFBVyxnQ0FBWDtRQUNBRixDQUFBLEVBQUU7OztHQXJDTDtFQXVDQU0sU0FBQSxFQUNDO0lBQUFDLFNBQUEsRUFBVyxVQUFDQSxTQUFEO2FBQWMsS0FBQ0MsS0FBRCxDQUFPLEdBQUdELFNBQVUsV0FBcEIsRUFBZ0MsSUFBaEM7S0FBekI7SUFDQWQsT0FBQSxFQUFTLFVBQUNBLE9BQUQ7VUFBZ0NBLE9BQXBCO2VBQUEsS0FBQ2dCLE1BQUQsQ0FBUWhCLE9BQVI7OztHQXpDdEI7RUEyQ0FpQixNQUFBLEVBQVE7MkJBQXVCLFVBQUNDLE9BQUQ7VUFDM0JBLE9BQUEsSUFBWTNDLEdBQUEsQ0FBSSxJQUFKLENBQUEsQ0FBTzRDLE9BQVAsQ0FBZTFCLFFBQWYsQ0FBd0JxQixTQUF4QixLQUFxQyxRQUFwRDtlQUNDdkMsR0FBQSxDQUFJLElBQUosQ0FBQSxDQUFPNEMsT0FBUCxDQUFlQyxhQUFmOzs7O0NBOUNILENBRGdCLENBQWpCO0FBb0RBLEFBQUEsSUFBT0MsS0FBUCxHQUFlOUMsR0FBRyxDQUFDSyxRQUFKLENBQ2QsQ0FBQyxLQUFELEVBQ0M7RUFBQUMsR0FBQSxFQUFLLE9BQUw7RUFDQUMsS0FBQSxFQUNDO0lBQUFDLFFBQUEsRUFBVSxVQUFWO0lBQ0F1QyxPQUFBLEVBQVMsVUFBQzNDLEtBQUQ7VUFBYUEsS0FBSyxDQUFDYyxRQUFOLENBQWU0QixLQUFmLENBQXFCRSxJQUF4QjtlQUFrQztPQUFsQyxNQUFBO2VBQStDOztLQURsRTtJQUVBdEMsR0FBQSxFQUFLLFVBQUNOLEtBQUQ7VUFBYUEsS0FBSyxDQUFDYyxRQUFOLENBQWU0QixLQUFmLENBQXFCRyxNQUF4QjtlQUFvQzdDLEtBQUssQ0FBQ2MsUUFBTixDQUFlNEIsS0FBZixDQUFxQmpCO09BQXpELE1BQUE7ZUFBc0V6QixLQUFLLENBQUNjLFFBQU4sQ0FBZTRCLEtBQWYsQ0FBcUJJLElBQXJCLEdBQTBCLEdBQTFCLEdBQWdDLENBQUM7O0tBRnRIO0lBR0FDLEtBQUEsRUFBTyxVQUFDL0MsS0FBRDtVQUFhQSxLQUFLLENBQUNjLFFBQU4sQ0FBZTRCLEtBQWYsQ0FBcUJHLE1BQXhCO2VBQW9DN0MsS0FBSyxDQUFDYyxRQUFOLENBQWU0QixLQUFmLENBQXFCakI7T0FBekQsTUFBQTtlQUFzRTs7S0FIdkY7SUFJQWpCLEtBQUEsRUFBTyxVQUFDUixLQUFEO2FBQVVBLEtBQUssQ0FBQ2MsUUFBTixDQUFlNEIsS0FBZixDQUFxQkk7S0FKdEM7SUFLQXJDLE1BQUEsRUFBUSxVQUFDVCxLQUFEO2FBQVVBLEtBQUssQ0FBQ2MsUUFBTixDQUFlNEIsS0FBZixDQUFxQkk7S0FMdkM7SUFNQUUsS0FBQSxFQUFPLFVBQUNoRCxLQUFEO2FBQVVBLEtBQUssQ0FBQ2MsUUFBTixDQUFlNEIsS0FBZixDQUFxQk07OztDQVR4QyxFQVdDLENBQUMsTUFBRCxFQUNDO0VBQUFDLEtBQUEsRUFBTztJQUFBQyxPQUFBLEVBQVE7R0FBZjtFQUNBL0MsS0FBQSxFQUFPO0lBQUFLLEtBQUEsRUFBTSxNQUFOO0lBQWNDLE1BQUEsRUFBTzs7Q0FGN0IsRUFJQyxDQUFDLE9BQUQsRUFDQztFQUFBd0MsS0FBQSxFQUFPO0lBQUFFLENBQUEsRUFBRTtHQUFUO0VBQ0FoRCxLQUFBLEVBQU87SUFBQWlELElBQUEsRUFBTSxVQUFDcEQsS0FBRDthQUFVQSxLQUFLLENBQUNjLFFBQU4sQ0FBZTRCLEtBQWYsQ0FBcUJNOzs7Q0FGN0MsQ0FKRCxDQVhELENBRGMsQ0FBZjtBQXlCQSxBQUFBLElBQU9LLFdBQVAsR0FBcUJ6RCxHQUFHLENBQUNLLFFBQUosQ0FDcEIsQ0FBQyxLQUFELEVBQ0M7RUFBQXFELEVBQUEsRUFBSSxhQUFKO0VBQ0FDLG1CQUFBLEVBQXFCLEtBRHJCO0VBRUFwRCxLQUFBLEVBQ0M7SUFBQWEsS0FBQSxFQUNDO01BQUFaLFFBQUEsRUFBVSxPQUFWO01BQ0FJLEtBQUEsRUFBTyxNQURQO01BRUFGLEdBQUEsRUFBSzs7O0NBUFIsQ0FEb0IsQ0FBckI7QUFhQSxBQUFBLElBQU9rRCxJQUFQLEdBQWM1RCxHQUFHLENBQUNLLFFBQUosQ0FDYixDQUFDLEtBQUQsRUFDQztFQUFBaUMsU0FBQSxFQUFXO0lBQUFzQixJQUFBLEVBQU0sVUFBQ0EsSUFBRDthQUFTLEtBQUNBLElBQUQsR0FBUUE7OztDQURuQyxDQURhLENBQWQsK0lDcElBLElBQU9DLGNBQVAsR0FBd0IsVUFBQ0MsUUFBRCxFQUFXNUMsUUFBWDtTQUN2QjZDLE1BQ0MsQ0FBQ0MsTUFERixDQUVFO0lBQUF6QixTQUFBLEVBQVczQyxJQUFFLENBQUNxRSxNQUFkO0lBQ0E1RCxRQUFBLEVBQVVULElBQUUsQ0FBQ3NFLFdBRGI7SUFFQUMsU0FBQSxFQUFXdkUsSUFBRSxDQUFDd0UsUUFGZDtJQUdBakQsU0FBQSxFQUFXdkIsSUFBRSxDQUFDeUUsTUFIZDtJQUlBN0MsWUFBQSxFQUFjNUIsSUFBRSxDQUFDcUUsTUFKakI7SUFLQUssSUFBQSxFQUFNMUUsSUFBRSxDQUFDc0UsV0FMVDtJQU1BcEIsS0FBQSxFQUFPbEQsSUFBRSxDQUFDc0UsV0FOVjtJQU9BSyxRQUFBLEVBQVUzRSxJQUFFLENBQUNzRTtHQVRmLEVBV0VNLEtBWEYsQ0FXUUMsSUFYUixDQVdhQyxPQVhiLENBV3FCLFNBWHJCLEVBV2dDWixRQVhoQyxFQVcwQzVDLFFBWDFDO0NBREQ7QUFlQSxBQUFBLElBQU95RCxtQkFBUCxHQUE2QixVQUFDQyxZQUFEO1NBQWlCQyxVQUFBLENBQVc7SUFDeERDLE1BQU0sQ0FBQ0MsTUFBUCxDQUFjLENBQWQsRUFBZ0IsQ0FBaEI7O1FBRUdILFlBQUg7YUFDQ0MsVUFBQSxDQUFXO2VBQ1ZGLG1CQUFBO09BREQsRUFFRUMsWUFGRjs7R0FKNEM7Q0FBOUM7QUFRQSxBQUFBLElBQU9JLGFBQVAsR0FBdUI7U0FDdEJDLGVBQUEsQ0FBZ0IsWUFBaEI7Q0FERDtBQUdBLEFBQUEsSUFBT0MsWUFBUCxHQUFzQjtTQUNyQkosTUFBTSxDQUFDSyxPQUFQLEdBQWlCQyxjQUFBO0NBRGxCO0FBR0EsQUFBQSxJQUFPQSxjQUFQLEdBQXdCO01BQ3ZCOUU7U0FBQSw2REFBc0MsQ0FBRUksaUJBQU8sQ0FBL0MsSUFBb0RvRSxNQUFNLENBQUNLO0NBRDVEO0FBSUEsQUFBQSxJQUFPRSxpQkFBUCxHQUEyQjtVQUFLO1VBQzFCekYsSUFBRSxDQUFDMEYsT0FBSCxDQUFXQyxRQUFRLENBQUNDLE1BQXBCO2FBQ0o7UUFBQUEsTUFBQSxFQUFPLFFBQVA7UUFBaUJDLGdCQUFBLEVBQWlCOzs7VUFFOUI3RixJQUFFLENBQUMwRixPQUFILENBQVdDLFFBQVEsQ0FBQ0csUUFBcEI7YUFDSjtRQUFBRixNQUFBLEVBQU8sVUFBUDtRQUFtQkMsZ0JBQUEsRUFBaUI7OztVQUVoQzdGLElBQUUsQ0FBQzBGLE9BQUgsQ0FBV0MsUUFBUSxDQUFDSSxZQUFwQjthQUNKO1FBQUFILE1BQUEsRUFBTyxjQUFQO1FBQXVCQyxnQkFBQSxFQUFpQjs7OzthQUVwQzs7Q0FWTixDQ3JDQSxJQUFBbkYsR0FBQTtBQUFBLEFBQUEsSUFBT3NGLElBQVAsR0FBY0wsUUFBUSxDQUFDTSxHQUFULElBQWlCLENBQUNmLE1BQU0sQ0FBQ2dCLElBQXZDO0FBQ0EsQUFBQSxJQUFPQyxNQUFQLEdBQWdCakIsTUFBTSxDQUFDa0IsU0FBUCxDQUFpQkMsZ0JBQWpDO0FBQ0EsQUFBQSxJQUFPQyxNQUFQLEdBQWdCLE9BQU9DLElBQVAsd0NBQTRCLENBQUVDLHVCQUFhLEVBQTNDLENBQWhCLENDRkEsSUFBQUMsS0FBQSxFQUFBQyxJQUFBO0FBQUEsQUFRQUEsSUFBQSxHQUFPdEcsR0FBQSxDQUFJdUYsUUFBUSxDQUFDZSxJQUFiLENBQVA7O0FBRU1EO1FBQU5BLEtBQUEsU0FBb0JFLFlBQXBCLENBQUE7V0FNRUMsUUFBVTtVQUFLQyxjQUFBQyxPQUFBQyxHQUFBQyxLQUFBQzs7VUFBQSwwQ0FBbUIsQ0FBRUMsZUFBckIsQ0FBQTthQUNkckQsV0FBRCxHQUFlcEQsV0FBQSxDQUFxQjBHLEtBQXJCLEVBQWY7UUFDQU4sWUFBQSxHQUFlSCxJQUFJLENBQUNVLFFBQUwsQ0FBY0MsS0FBZCxFQUFmO2FBQ0N4RCxXQUFELENBQWF5RCxTQUFiLENBQXVCWixJQUF2Qjs7YUFDMkJLLEtBQUEsMkJBQUEsU0FBQSxLQUFBOztlQUExQmxELFdBQUQsQ0FBYWhCLE1BQWIsQ0FBb0JpRSxLQUFwQjs7Ozs7V0FHQVMsVUFBWTtVQUFLVixjQUFBQyxPQUFBQyxHQUFBQzs7VUFBRyxLQUFDbkQsV0FBSjtRQUNqQmdELFlBQUEsR0FBZSxLQUFDaEQsV0FBRCxDQUFhdUQsUUFBYixDQUFzQkMsS0FBdEIsRUFBZjs7YUFDbUJOLEtBQUEsMkJBQUEsU0FBQSxLQUFBOztVQUFuQkwsSUFBSSxDQUFDN0QsTUFBTCxDQUFZaUUsS0FBWjs7O2FBQ0NqRCxXQUFELENBQWEyRCxNQUFiO2VBQ0EsS0FBQzNELFdBQUQsR0FBZTs7OztXQUVmNEQsVUFBWTtVQUNaVixHQUFBVyxVQUFBQyxXQUFBWDtNQUFBVyxTQUFBLEdBQVksS0FBQ0EsU0FBRCxDQUFXTixLQUFYLEVBQVo7O1dBQ21CTixLQUFBLHdCQUFBLFNBQUEsS0FBQTs7UUFBbkJXLFFBQVEsQ0FBQ0UsT0FBVDs7O2FBQ0EsS0FBQ0wsVUFBRDs7O0lBTURNLFdBQWEsQ0FBQ3ZHLFFBQUQsRUFBVzRDLFFBQVgsV0FBQTs7V0FBc0J6RCxRQUFELFlBQUE7V0FFaENhLFFBQUQsR0FBWXdHLGNBQUEsQ0FBdUI1RCxRQUF2QixFQUFpQzVDLFFBQWpDLENBQVo7V0FDQ3dDLEVBQUQsR0FBTWlFLElBQUksQ0FBQ0MsS0FBTCxDQUFXRCxJQUFJLENBQUNFLE1BQUwsS0FBYyxHQUF6QixFQUE4QkMsUUFBOUIsQ0FBdUMsRUFBdkMsQ0FBTjtXQUNDdEYsS0FBRCxHQUFTO1FBQUE4QixJQUFBLEVBQUssS0FBTDtRQUFZeUQsU0FBQSxFQUFVLEtBQXRCO1FBQTZCQyxNQUFBLEVBQU8sQ0FBcEM7UUFBdUNDLEtBQUEsRUFBTTtPQUF0RDs7VUFDcUMsS0FBQy9HLFFBQUQsQ0FBVU8sT0FBL0M7YUFBQ0EsT0FBRCxHQUFXekIsR0FBQSxDQUFJLEtBQUNrQixRQUFELENBQVVPLE9BQWQsQ0FBWDs7O01BRUE0RSxLQUFLLENBQUNrQixTQUFOLENBQWdCVyxJQUFoQixDQUFxQixJQUFyQjtNQUNBN0IsS0FBSyxDQUFDRyxRQUFOOztXQUNDMkIsZUFBRDs7V0FDQ0MsZUFBRDs7VUFDcUIsS0FBQ2xILFFBQUQsQ0FBVWIsUUFBVixJQUF1QixPQUFPLEtBQUNhLFFBQUQsQ0FBVWIsUUFBakIsS0FBNkIsUUFBekU7YUFBQ2dJLGNBQUQ7OztXQUVDQyxFQUFELENBQUlwQixTQUFKLENBQWNaLElBQWQ7O1VBQ1csS0FBQ3BGLFFBQUQsQ0FBVW9ELElBQXJCO2FBQUNBLElBQUQ7Ozs7SUFHRDZELGVBQWlCO1VBQ2hCckYsVUFBQXlGLFFBQUE5RyxZQUFBK0csTUFBQW5IO01BQUFtSCxJQUFBLEdBQU87UUFBQUEsSUFBQSxFQUFLO1VBQUUvRyxTQUFELEtBQUNBLE9BQUY7VUFBV2MsU0FBQSxFQUFVLEtBQUNyQixRQUFELENBQVVxQjs7T0FBM0M7TUFDQWdHLE1BQUEsR0FBUztRQUFBRSxlQUFBLEVBQWlCO09BQTFCO1dBRUNILEVBQUQsR0FBTSxLQUFDakksUUFBRCxDQUFVRCxLQUFWLENBQWdCMkcsS0FBaEIsQ0FBc0J5QixJQUF0QixFQUE0QkQsTUFBNUIsQ0FBTjtNQUNBbEgsVUFBQSxHQUFVLEtBQUNoQixRQUFELENBQVVnQixPQUFWLENBQWtCMEYsS0FBbEIsQ0FBd0J5QixJQUF4QixFQUE4QkQsTUFBOUIsRUFBc0NHLFFBQXRDLENBQStDLEtBQUNKLEVBQWhELENBQVY7TUFDQTdHLFVBQUEsR0FBVSxLQUFDcEIsUUFBRCxDQUFVb0IsT0FBVixDQUFrQnNGLEtBQWxCLENBQXdCeUIsSUFBeEIsRUFBOEJELE1BQTlCLEVBQXNDRyxRQUF0QyxDQUErQyxLQUFDSixFQUFoRCxDQUFWOztVQUNpRSxLQUFDcEgsUUFBRCxDQUFVNEIsS0FBVixDQUFnQkUsSUFBakY7ZUFBQUYsUUFBQSxHQUFRLEtBQUN6QyxRQUFELENBQVV5QyxLQUFWLENBQWdCaUUsS0FBaEIsQ0FBc0J5QixJQUF0QixFQUE0QkQsTUFBNUIsRUFBb0NHLFFBQXBDLENBQTZDakgsVUFBN0M7Ozs7SUFHVDRHLGNBQWdCO1VBQ2ZNLFFBQUFySTtNQUFBcUksTUFBQSxHQUFTLEtBQUN6SCxRQUFELENBQVViLFFBQW5COztXQUNBQyxHQUFBLGlCQUFBO1lBQzhDcUksTUFBTyxDQUFBckksR0FBQSxDQUFwRDtlQUFDZ0ksRUFBRCxDQUFJNUIsS0FBSixDQUFVcEcsR0FBVixFQUFlc0ksYUFBZixDQUE2QkQsTUFBTyxDQUFBckksR0FBQSxDQUFwQzs7Ozs7SUFJRjhILGVBQWlCO1VBQ2hCdEYsVUFBQTBDLFFBQUFxQixNQUFBZ0MsTUFBQXBEO01BQUEzQyxRQUFBLEdBQVEsS0FBQ0EsS0FBRCxDQUFPZ0csSUFBUCxDQUFZLElBQVosQ0FBUjtXQUNDUixFQUFELENBQUk1QixLQUFKLENBQVVyRixPQUFWLENBQWtCMEgsRUFBbEIsQ0FBcUIsa0JBQXJCLEVBQXlDakcsUUFBekM7OztZQUNlLENBQUVpRyxHQUFHLG9CQUFvQmpHOzs7VUFFckMsS0FBQzVCLFFBQUQsQ0FBVXFCLFNBQVYsS0FBdUIsUUFBMUI7UUFDQ3ZDLEdBQUEsQ0FBSThFLE1BQUosQ0FBQSxDQUFZaUUsRUFBWixDQUFlLFVBQVUsS0FBQ3JGLEVBQVgsRUFBZixFQUFnQztjQUFRLEtBQUNsQixLQUFELENBQU84QixJQUFWO21CQUNwQyxLQUFDekIsYUFBRDs7U0FERDs7O1VBR0UsS0FBQzNCLFFBQUQsQ0FBVXFELFFBQVYsQ0FBbUJ6QixLQUFuQixDQUF5QmtHLEdBQTVCO1FBQ0NoSixHQUFBLENBQUl1RixRQUFKLENBQUEsQ0FBY3dELEVBQWQsQ0FBaUIsU0FBUyxLQUFDckYsRUFBVixFQUFqQixFQUFrQ3VGLEtBQUQ7Y0FBYUEsS0FBSyxDQUFDQyxPQUFOLEtBQWlCLEVBQWpCLElBQXdCLEtBQUMxRyxLQUFELENBQU84QixJQUFsQztZQUMxQzJFLEtBQUssQ0FBQ0UsZUFBTjtZQUNBRixLQUFLLENBQUNHLGNBQU47bUJBQ0EsS0FBQ3RHLEtBQUQ7O1NBSEQ7OztVQUtFLEtBQUM1QixRQUFELENBQVVxRCxRQUFWLENBQW1CRCxJQUFuQixDQUF3QnZELFVBQTNCO1NBQ0M7VUFBQzBFLGdCQUFEO1VBQWtCRDtZQUFVa0MsaUJBQUEsRUFBNUI7UUFDQTFILEdBQUEsQ0FBSXVGLFFBQUosQ0FBQSxDQUFjd0QsRUFBZCxDQUFpQixHQUFHdEQsZ0JBQWlCLElBQUcsS0FBQy9CLEVBQXhCLEVBQWpCLEVBQStDO2NBQ3ZCNkIsUUFBUyxDQUFBQyxNQUFBLENBQWhDO21CQUFBLEtBQUNsQixJQUFELENBQU0sWUFBTjs7U0FERDs7O1VBR0UsS0FBQ3BELFFBQUQsQ0FBVXFELFFBQVYsQ0FBbUJELElBQW5CLENBQXdCK0UsVUFBM0I7UUFDQ3JKLEdBQUEsQ0FBSXVGLFFBQUosQ0FBQSxDQUFjd0QsRUFBZCxDQUFpQixjQUFjLEtBQUNyRixFQUFmLEVBQWpCLEVBQXVDdUYsS0FBRDtjQUNyQ0ssTUFBQUM7VUFBQUQsSUFBQSxHQUFVRSxJQUFBLElBQWdCQSxNQUFoQixJQUFrQ0EsTUFBbEMsR0FBc0QsR0FBdEQsR0FBK0QsQ0FBekU7VUFDQUQsU0FBQSxHQUFZLEtBQUNySSxRQUFELENBQVV1SSxVQUFWLEdBQXVCSCxJQUFuQzs7Y0FDdUJMLEtBQUssQ0FBQ1MsT0FBTixJQUFpQkgsU0FBeEM7bUJBQUEsS0FBQ2pGLElBQUQsQ0FBTSxZQUFOOztTQUhEOzs7VUFLRSxLQUFDcEQsUUFBRCxDQUFVcUQsUUFBVixDQUFtQkQsSUFBbkIsQ0FBd0JxRixVQUF4QiwyQ0FBcUQsQ0FBRUMsa0JBQXZELENBQUg7UUFDQzlFLE1BQU0sQ0FBQytFLE9BQVAsQ0FBZUMsWUFBZixDQUE0QjtVQUFDcEcsRUFBQSxFQUFHO1NBQWhDLEVBQXNELEVBQXRELEVBQTBELEVBQTFEO1FBQ0FvQixNQUFNLENBQUMrRSxPQUFQLENBQWVELFNBQWYsQ0FBeUI7VUFBQ2xHLEVBQUEsRUFBRztTQUE3QixFQUE0QyxFQUE1QyxFQUFnRCxFQUFoRDtlQUVBMUQsR0FBQSxDQUFJOEUsTUFBSixDQUFBLENBQVlpRSxFQUFaLENBQWUsWUFBWSxLQUFDckYsRUFBYixFQUFmLEVBQW1DdUYsS0FBRDtjQUM5QkEsS0FBSyxDQUFDekcsS0FBTixDQUFZQSxLQUFaLENBQWtCa0IsRUFBbEIsS0FBd0IsbUJBQXhCLElBQWdELEtBQUNZLElBQUQsQ0FBTSxZQUFOLENBQW5ELEdBQUEsTUFBQTttQkFHQ1EsTUFBTSxDQUFDK0UsT0FBUCxDQUFlRSxJQUFmOztTQUpGOzs7O0lBT0ZDLGVBQWlCO1VBQ2hCeEUsUUFBQXFCLE1BQUFwQjtXQUFDNkMsRUFBRCxDQUFJNUIsS0FBSixDQUFVckYsT0FBVixDQUFrQjRJLEdBQWxCOzs7WUFDZSxDQUFFQTs7O09BQ2pCO1FBQUN4RSxnQkFBRDtRQUFrQkQ7VUFBVWtDLGlCQUFBLEVBQTVCOztVQUVtQyxLQUFDeEcsUUFBRCxDQUFVcUIsU0FBVixLQUF1QixRQUExRDtRQUFBdkMsR0FBQSxDQUFJOEUsTUFBSixDQUFBLENBQVltRixHQUFaLENBQWdCLFVBQVUsS0FBQ3ZHLEVBQVgsRUFBaEI7OztVQUNxQyxLQUFDeEMsUUFBRCxDQUFVcUQsUUFBVixDQUFtQkQsSUFBbkIsQ0FBd0JxRixVQUE3RDtRQUFBM0osR0FBQSxDQUFJOEUsTUFBSixDQUFBLENBQVltRixHQUFaLENBQWdCLFlBQVksS0FBQ3ZHLEVBQWIsRUFBaEI7OztVQUN5QyxLQUFDeEMsUUFBRCxDQUFVcUQsUUFBVixDQUFtQkQsSUFBbkIsQ0FBd0IrRSxVQUFqRTtRQUFBckosR0FBQSxDQUFJdUYsUUFBSixDQUFBLENBQWMwRSxHQUFkLENBQWtCLGNBQWMsS0FBQ3ZHLEVBQWYsRUFBbEI7OztVQUNrRCxLQUFDeEMsUUFBRCxDQUFVcUQsUUFBVixDQUFtQkQsSUFBbkIsQ0FBd0J2RCxVQUExRTtRQUFBZixHQUFBLENBQUl1RixRQUFKLENBQUEsQ0FBYzBFLEdBQWQsQ0FBa0IsR0FBR3hFLGdCQUFpQixJQUFHLEtBQUMvQixFQUF4QixFQUFsQjs7O1VBQ29DLEtBQUN4QyxRQUFELENBQVVxRCxRQUFWLENBQW1CekIsS0FBbkIsQ0FBeUJrRyxHQUE3RDtlQUFBaEosR0FBQSxDQUFJdUYsUUFBSixDQUFBLENBQWMwRSxHQUFkLENBQWtCLFNBQVMsS0FBQ3ZHLEVBQVYsRUFBbEI7Ozs7SUFHRHdHLGVBQWlCO1lBQ1YsSUFBSUMsS0FBSixDQUFVLHVEQUFWLENBQU47OztJQWFEQyxVQUFZLENBQUNDLE1BQUQ7V0FDVjVJLE9BQUQ7Z0JBQVc7Z0JBQ0w3QixJQUFFLENBQUMwSyxPQUFILENBQVdELE1BQVg7bUJBQXdCQTs7Z0JBQ3hCekssSUFBRSxDQUFDMkssS0FBSCxDQUFTRixNQUFUO21CQUFzQnJLLEdBQUEsQ0FBSXFLLE1BQUo7O2dCQUN0QnpLLElBQUUsQ0FBQ1MsUUFBSCxDQUFZZ0ssTUFBWjttQkFBeUJBLE1BQU0sQ0FBQ3RELEtBQVA7O2dCQUN6Qm5ILElBQUUsQ0FBQ3FFLE1BQUgsQ0FBVW9HLE1BQVY7bUJBQXVCaEssSUFBQSxDQUFjMEcsS0FBZCxDQUFvQjtjQUFBeUIsSUFBQSxFQUFLO2dCQUFBNUUsSUFBQSxFQUFLeUc7O2FBQTlCOzs7a0JBQ2pCLElBQUlGLEtBQUosQ0FBVSxnREFBVixDQUFOOztTQUxOOztVQU9HLEtBQUM3QixFQUFELENBQUk1QixLQUFKLENBQVVqRixPQUFWLENBQWtCdUYsUUFBbEIsQ0FBMkJ3RCxNQUE5QjtlQUNDLEtBQUNsQyxFQUFELENBQUk1QixLQUFKLENBQVVqRixPQUFWLENBQWtCdUYsUUFBbEIsQ0FBMkIsQ0FBM0IsRUFBOEJ5RCxXQUE5QixDQUEwQyxLQUFDaEosT0FBM0M7T0FERCxNQUFBO2VBR0MsS0FBQzZHLEVBQUQsQ0FBSTVCLEtBQUosQ0FBVWpGLE9BQVYsQ0FBa0JnQixNQUFsQixDQUF5QixLQUFDaEIsT0FBMUI7Ozs7SUFHRm9CLGFBQWU7VUFDZDZILGVBQUExQyxRQUFBMkM7TUFBQUQsYUFBQSxHQUFnQixLQUFDcEMsRUFBRCxDQUFJNUIsS0FBSixDQUFVakYsT0FBVixDQUFrQm1KLEdBQWxCLENBQXNCQyxZQUF0QztNQUNBRixZQUFBLEdBQWU3RixNQUFNLENBQUNnRyxXQUF0Qjs7VUFFR0osYUFBQSxJQUFpQkMsWUFBQSxHQUFhLEVBQWpDO1FBQ0MzQyxNQUFBLEdBQVlsRCxNQUFNLENBQUNpRyxVQUFQLEdBQW9CLEdBQXBCLEdBQTZCLEdBQTdCLEdBQXNDLEVBQWxEO09BREQsTUFBQTtRQUdDL0MsTUFBQSxHQUFTLENBQUMyQyxZQUFBLEdBQWVELGFBQWhCLElBQStCLENBQXhDOzs7YUFFRCxLQUFDcEMsRUFBRCxDQUFJNUIsS0FBSixDQUFVakYsT0FBVixDQUFrQmxCLEtBQWxCLENBQXdCLFFBQXhCLEVBQWtDLEdBQUd5SCxNQUFPLFNBQTVDOzs7SUFHRDFELElBQU0sQ0FBQzBHLFdBQUQ7YUFDTEMsT0FBTyxDQUFDQyxPQUFSLEdBQ0VDLElBREYsQ0FDTztZQUNpQixLQUFDM0ksS0FBRCxDQUFPdUYsU0FBN0I7ZUFBQ21DLGVBQUQ7OztZQUNrQixBQUNqQixLQUFDMUgsS0FBRCxDQUFPOEIsSUFEVSxJQUNEK0IsS0FBSyxDQUFDK0UsT0FBTixJQUFrQixDQUFJLEtBQUNsSyxRQUFELENBQVVtSyxTQUQvQixJQUVqQixFQUFFLEtBQUM3SSxLQUFELENBQU95RixLQUFULElBQWtCLEtBQUMvRyxRQUFELENBQVVvSyxTQUZYLElBR2pCeEcsTUFBTSxDQUFDaUcsVUFBUCxHQUFvQixLQUFDN0osUUFBRCxDQUFVcUQsUUFBVixDQUFtQkQsSUFBbkIsQ0FBd0JpSCxRQUgzQixJQUlqQixLQUFDckssUUFBRCxDQUFVaUQsU0FBVixJQUF3QixDQUFJLEtBQUNqRCxRQUFELENBQVVpRCxTQUFWLEVBSjdCO2lCQUFBcUgsWUFBQTs7T0FIRixFQVNFTCxJQVRGLENBU087WUFDTE07YUFBQ0MsSUFBRCxDQUFNLFlBQU4sRUFBb0JWLFdBQXBCOztZQUVHLENBQUkzRSxLQUFLLENBQUMrRSxPQUFiO2lCQUNDLEtBQUM1SSxLQUFELENBQU93RixNQUFQLEdBQWdCTixZQUFBO1NBRGpCLE1BQUE7VUFHQytELFVBQUEsR0FBYXBGLEtBQUssQ0FBQ2tCLFNBQU4sQ0FBZ0J2RCxNQUFoQixDQUF3QjVELFFBQUQ7bUJBQVVBLFFBQUEsS0FBVyxJQUFYLElBQWlCQSxRQUFLLENBQUNvQyxLQUFOLENBQVk4QjtXQUE5RCxDQUFiO2lCQUNBMkcsT0FBTyxDQUFDcEYsR0FBUixDQUFZNEYsVUFBVSxDQUFDRSxHQUFYLENBQWdCdkwsUUFBRDtpQkFDekJvQyxLQUFELENBQU93RixNQUFQLEdBQWdCNUgsUUFBSyxDQUFDb0MsS0FBTixDQUFZd0YsTUFBNUI7bUJBQ0E1SCxRQUFLLENBQUMwQyxLQUFOLENBQVksSUFBWjtXQUZXLENBQVo7O09BaEJILEVBb0JFcUksSUFwQkYsQ0FvQk87WUFDTFM7UUFBQWxFLG1CQUFBLENBQTRCLENBQTVCO1FBQ0FyQixLQUFLLENBQUM1QyxXQUFOLENBQWtCakIsS0FBbEIsQ0FBd0IsTUFBeEIsRUFBZ0MsSUFBaEM7UUFDQTZELEtBQUssQ0FBQzVDLFdBQU4sQ0FBa0JsRCxLQUFsQixDQUF3QixLQUF4QixFQUErQixLQUFDaUMsS0FBRCxDQUFPd0YsTUFBUCxHQUFjLENBQUMsQ0FBOUM7YUFDQ00sRUFBRCxDQUFJOUYsS0FBSixDQUFVLE1BQVYsRUFBa0IsSUFBbEI7YUFDQ0EsS0FBRCxDQUFPOEIsSUFBUCxHQUFjK0IsS0FBSyxDQUFDK0UsT0FBTixHQUFnQixJQUE5Qjs7WUFDb0IsS0FBQ2xLLFFBQUQsQ0FBVXFCLFNBQVYsS0FBdUIsUUFBM0M7ZUFBQ00sYUFBRDs7O2FBQ0M2SSxJQUFELENBQU0sTUFBTixFQUFjVixXQUFkOztZQUVHLENBQUksS0FBQzlKLFFBQUQsQ0FBVUMsU0FBZCxJQUEyQixDQUFJa0YsS0FBSyxDQUFDckIsYUFBeEM7aUJBQ0MsS0FBQzBHLElBQUQsQ0FBTSxZQUFOO1NBREQsTUFBQTtVQUdDRSxPQUFBLEdBQVVDLFlBQUEsQ0FBYSxJQUFiLEVBQWdCLFlBQWhCLENBQVY7ZUFFQ3ZELEVBQUQsQ0FBSTVCLEtBQUosQ0FBVWpGLE9BQVYsQ0FBa0JzSCxFQUFsQixDQUFxQjFDLEtBQUssQ0FBQ3JCLGFBQTNCLEVBQTJDaUUsS0FBRDtnQkFBYUEsS0FBSyxDQUFDb0IsTUFBTixLQUFnQixLQUFDL0IsRUFBRCxDQUFJNUIsS0FBSixDQUFVakYsT0FBVixDQUFrQm1KLEdBQXJDO21CQUNsRGMsSUFBRCxDQUFNLFlBQU47cUJBQ0EsS0FBQ3BELEVBQUQsQ0FBSTVCLEtBQUosQ0FBVWpGLE9BQVYsQ0FBa0J3SSxHQUFsQixDQUFzQjVELEtBQUssQ0FBQ3JCLGFBQTVCOztXQUZEO2lCQUlPNEc7O09BdENWLEVBd0NFRSxLQXhDRixDQXdDUU4sWUFBWSxDQUFDTyxHQXhDckIsRUF5Q0VaLElBekNGLENBeUNPO2VBQUs7T0F6Q1o7OztJQTRDRHJJLEtBQU8sQ0FBQ2tKLFlBQUQ7YUFDTmYsT0FBTyxDQUFDQyxPQUFSLEdBQ0VDLElBREYsQ0FDTztZQUF1QixDQUFJLEtBQUMzSSxLQUFELENBQU84QixJQUE3QjtpQkFBQWtILFlBQUE7O09BRFosRUFFRUwsSUFGRixDQUVPO1lBQ0xTO2FBQUNGLElBQUQsQ0FBTSxhQUFOOztZQUVPTSxZQUFBLEtBQWdCLElBQXZCO1VBQ0NuSCxVQUFBLENBQVc7Z0JBQUtnQyxNQUFBZ0M7O2dCQUFBLENBQU94QyxLQUFLLENBQUMrRSxPQUFiOztvQkFDRSxDQUFFNUksTUFBTSxRQUFROzs7O29CQUNoQixDQUFFakMsTUFBTSxPQUFPOzs7cUJBQ2hDdUUsTUFBTSxDQUFDQyxNQUFQLENBQWMsQ0FBZCxFQUFpQixLQUFDdkMsS0FBRCxDQUFPd0YsTUFBUCxHQUFnQk4sY0FBQSxFQUFqQzs7V0FIRCxDQUFBO1VBS0FyQixLQUFLLENBQUMrRSxPQUFOLEdBQWdCLEtBQWhCOzs7YUFFQTlDLEVBQUQsQ0FBSTlGLEtBQUosQ0FBVSxNQUFWLEVBQWtCLEtBQWxCO2FBQ0NBLEtBQUQsQ0FBTzhCLElBQVAsR0FBYyxLQUFkO2FBQ0NvSCxJQUFELENBQU0sT0FBTjs7WUFDRyxDQUFJLEtBQUN4SyxRQUFELENBQVVDLFNBQWQsSUFBMkIsQ0FBSWtGLEtBQUssQ0FBQ3JCLGFBQXhDO2lCQUNDLEtBQUMwRyxJQUFELENBQU0sYUFBTjtTQURELE1BQUE7VUFHQ0UsT0FBQSxHQUFVQyxZQUFBLENBQWEsSUFBYixFQUFnQixhQUFoQixDQUFWO2VBRUN2RCxFQUFELENBQUk1QixLQUFKLENBQVVqRixPQUFWLENBQWtCc0gsRUFBbEIsQ0FBcUIxQyxLQUFLLENBQUNyQixhQUEzQixFQUEyQ2lFLEtBQUQ7Z0JBQWFBLEtBQUssQ0FBQ29CLE1BQU4sS0FBZ0IsS0FBQy9CLEVBQUQsQ0FBSTVCLEtBQUosQ0FBVWpGLE9BQVYsQ0FBa0JtSixHQUFyQzttQkFDbERjLElBQUQsQ0FBTSxhQUFOO3FCQUNBLEtBQUNwRCxFQUFELENBQUk1QixLQUFKLENBQVVqRixPQUFWLENBQWtCd0ksR0FBbEIsQ0FBc0I1RCxLQUFLLENBQUNyQixhQUE1Qjs7V0FGRDtpQkFJTzRHOztPQXpCVixFQTJCRUUsS0EzQkYsQ0EyQlFOLFlBQVksQ0FBQ08sR0EzQnJCLEVBNEJFWixJQTVCRixDQTRCTztlQUFLO09BNUJaOzs7SUErQkQzRCxPQUFTO1VBQ2MsS0FBQ3RHLFFBQUQsQ0FBVTZHLFNBQWhDO2FBQUNtQyxlQUFEOzs7V0FDQ3BILEtBQUQ7O1dBQ0NrSCxlQUFEOztXQUNDMUIsRUFBRCxDQUFJbEIsTUFBSjtNQUNBZixLQUFLLENBQUNrQixTQUFOLENBQWdCMEUsTUFBaEIsQ0FBdUI1RixLQUFLLENBQUNrQixTQUFOLENBQWdCMkUsT0FBaEIsQ0FBd0IsSUFBeEIsQ0FBdkIsRUFBbUQsQ0FBbkQ7YUFDTzs7OztBQXpPUjdGLEVBQUFBLEtBQUMsQ0FBQWtCLFNBQUQsR0FBWSxFQUFaO0VBQ0FsQixLQUFDLENBQUErRSxPQUFELEdBQVUsS0FBVjtFQUNBL0UsS0FBQyxDQUFBNUMsV0FBRCxHQUFjLElBQWQ7RUFDQTRDLEtBQUMsQ0FBQXJCLGFBQUQsR0FBZ0IwQyxhQUFBLEVBQWhCOztpQkFKSzs7QUErT04sY0FBZXJCLEtBQWYsQ0N6UEEsZUFDQztFQUFBOUQsU0FBQSxFQUFXLFFBQVg7RUFDQStCLElBQUEsRUFBTSxLQUROO0VBRUErRyxTQUFBLEVBQVcsS0FGWDtFQUdBaEwsUUFBQSxFQUFVLElBSFY7RUFJQThELFNBQUEsRUFBVyxJQUpYO0VBS0FoRCxTQUFBLEVBQVcsR0FMWDtFQU1BVyxjQUFBLEVBQWdCLENBTmhCO0VBT0EySCxVQUFBLEVBQVksRUFQWjtFQVFBNkIsU0FBQSxFQUFXLEtBUlg7RUFTQTlKLFlBQUEsRUFBYyxrQkFUZDtFQVVBc0IsS0FBQSxFQUNDO0lBQUFFLElBQUEsRUFBTSxLQUFOO0lBQ0FuQixPQUFBLEVBQVMsRUFEVDtJQUVBb0IsTUFBQSxFQUFRLEtBRlI7SUFHQUMsSUFBQSxFQUFNO0dBZFA7RUFnQkFxQixRQUFBLEVBQ0M7SUFBQUQsSUFBQSxFQUNDO01BQUFxRixVQUFBLEVBQVksS0FBWjtNQUNBNUksVUFBQSxFQUFZLEtBRFo7TUFFQXNJLFVBQUEsRUFBWTtLQUhiO0lBSUF2RyxLQUFBLEVBQ0M7TUFBQWtHLEdBQUEsRUFBSzs7O0NBdkJSLHVCQ0FBLElBQUFtRCxVQUFBLEVBQUFDLFVBQUE7QUFBQTtBQVVBRCxVQUFBLEdBQWEsVUFBQ3JJLFdBQUQsRUFBV3VJLFNBQVg7TUFDWkM7O0VBQUFBLE9BQUEsR0FBVSxVQUFDQyxHQUFEOztZQUVUO1dBQ01DLFNBQVMsQ0FBQ2hDLE1BQVYsS0FBb0I7ZUFDeEIsSUFBSW5FLE9BQUosQ0FBVSxJQUFWLEVBQWdCdkMsV0FBaEIsRUFBMEJ1SSxTQUExQjs7V0FFSSxPQUFPRSxHQUFQLEtBQWM7ZUFDbEIsSUFBSWxHLE9BQUosQ0FBVTtVQUFBNUUsT0FBQSxFQUFRZ0wsSUFBWSxDQUFDMUYsS0FBYixDQUFtQjtZQUFBeUIsSUFBQSxFQUFLO2NBQUE1RSxJQUFBLEVBQUsySTs7V0FBN0I7U0FBbEIsRUFBcUR6SSxXQUFyRCxFQUErRHVJLFNBQS9EOztZQUVJck0sR0FBRyxDQUFDQyxJQUFKLENBQVNzTSxHQUFUO1lBQWV2TSxHQUFHLENBQUNFLFNBQUosQ0FBY3FNLEdBQWQ7ZUFDbkIsSUFBSWxHLE9BQUosQ0FBVTtVQUFBNUUsT0FBQSxFQUFROEs7U0FBbEIsRUFBdUJ6SSxXQUF2QixFQUFpQ3VJLFNBQWpDOztZQUVJck0sR0FBRyxDQUFDRyxVQUFKLENBQWVvTSxHQUFmO2VBQ0osSUFBSWxHLE9BQUosQ0FBVTtVQUFBNUUsT0FBQSxFQUFROEssR0FBRyxDQUFDeEYsS0FBSjtTQUFsQixFQUErQmpELFdBQS9CLEVBQXlDdUksU0FBekM7O2FBRUlFLEdBQUEsSUFBUSxPQUFPQSxHQUFQLEtBQWM7ZUFDMUIsSUFBSWxHLE9BQUosQ0FBVWtHLEdBQVYsRUFBZXpJLFdBQWYsRUFBeUJ1SSxTQUF6Qjs7O2NBRVUsSUFBSWxDLEtBQUosQ0FBVSx5Q0FBVixDQUFOOztHQWxCUDs7RUFxQkFtQyxPQUFPLENBQUMvRCxNQUFSLEdBQWlCLFVBQUNtRSxXQUFELEVBQWNDLFlBQWQ7UUFDaEJDLFNBQUFDLGdCQUFBQyxpQkFBQXpNOztRQUE2RixDQUFJVCxJQUFFLENBQUNtTixNQUFILENBQVVMLFdBQVYsQ0FBakc7WUFBTSxJQUFJdkMsS0FBSixDQUFVLHFEQUFxRDZDLE1BQUEsQ0FBT04sV0FBUCxDQUFyRCxFQUFWLENBQU47OztJQUNBRyxjQUFBLEdBQWlCOUksTUFBTSxDQUFDUyxLQUFQLENBQWFDLElBQWIsQ0FBa0JYLFdBQWxCLEVBQTRCNEksV0FBNUIsQ0FBakI7O1FBRUcsQ0FBSTlNLElBQUUsQ0FBQ21OLE1BQUgsQ0FBVUosWUFBVixDQUFQO01BQ0NHLGVBQUEsR0FBa0JULFNBQWxCO0tBREQsTUFBQTtNQUdDUyxlQUFBLEdBQWtCRyxNQUFNLENBQUNuTixNQUFQLENBQWMsSUFBZCxDQUFsQjs7V0FDQThNLE9BQUEsYUFBQTs7O1lBQ0lELFlBQWEsQ0FBQUMsT0FBQSxDQUFoQjtVQUNDRSxlQUFnQixDQUFBRixPQUFBLENBQWhCLEdBQXdCdk0sUUFBUSxDQUFDMEQsTUFBVCxDQUFnQjRJLFlBQWEsQ0FBQUMsT0FBQSxDQUE3QixDQUF4QjtTQURELE1BQUE7VUFHQ0UsZUFBZ0IsQ0FBQUYsT0FBQSxDQUFoQixHQUF3QnZNLFFBQXhCOzs7OztXQUVJOEwsVUFBQSxDQUFXVSxjQUFYLEVBQTJCQyxlQUEzQjtHQWRSOztFQWlCQVIsT0FBTyxDQUFDOUYsUUFBUixHQUFtQjtXQUFLSCxPQUFLLENBQUNHLFFBQU47R0FBeEI7O0VBQ0E4RixPQUFPLENBQUNuRixVQUFSLEdBQXFCO1dBQUtkLE9BQUssQ0FBQ2MsVUFBTjtHQUExQjs7RUFDQW1GLE9BQU8sQ0FBQ2pGLFVBQVIsR0FBcUI7V0FBS2hCLE9BQUssQ0FBQ2dCLFVBQU47R0FBMUI7O0VBQ0FpRixPQUFPLENBQUNZLE9BQVIsR0FBa0JBLE9BQWxCO0VBQ0FaLE9BQU8sQ0FBQ3hJLFFBQVIsR0FBbUJBLFdBQW5CO0VBQ0F3SSxPQUFPLENBQUNELFNBQVIsR0FBb0JBLFNBQXBCO1NBQ09DO0NBN0NSOztBQW1EQUYsVUFBQSxHQUFhRCxVQUFBLENBQVdySSxRQUFYLEVBQXFCdUksU0FBckIsQ0FBYjtBQUNBLG1CQUFlRCxVQUFmIn0=
