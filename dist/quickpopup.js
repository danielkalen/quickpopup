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
var quickpopup$1 = quickpopup;return quickpopup$1;})));