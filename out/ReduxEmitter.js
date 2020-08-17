(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.reduxEmitter = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const WildEmitter = require("./lib/wildemitter");

const ReduxEmitter = function (props) {
  if (!(this instanceof ReduxEmitter)) return new ReduxEmitter(arguments);

  if (!props) props = {};

  this.delimiter = props.delimiter || "/";
  Object.keys(WildEmitter.prototype).forEach((key) => {
    this[key] = WildEmitter.prototype[key];
  });
};

ReduxEmitter.prototype.watch = function (store) {
  if (!(this instanceof ReduxEmitter)) return;
  if (store && store.subscribe) {
    this.store = store;
    if (this.store.getState) this.currentState = this.store.getState();
    this.unwatch = store.subscribe(() => this.listen(this.store.getState()));
  }
};

ReduxEmitter.prototype.listen = function (newState) {
  if (!(this instanceof ReduxEmitter)) return;
  const prevState = this.currentState;
  this.currentState = newState;

  checkKey({
    key: this.delimiter,
    prevState,
    newState,
    self: this,
  });
};

const checkKey = function ({ key, prevState, newState, self }) {
  if (
    newState instanceof Object &&
    prevState instanceof Object &&
    !(newState instanceof Array) &&
    !(prevState instanceof Array)
  ) {
    Object.keys(newState).forEach((k) => {
      const event = `${key === self.delimiter ? "" : key}${self.delimiter}${k}`;
      checkKey({
        key: event,
        prevState: prevState[k],
        newState: newState[k],
        self: self,
      });
    });
  } else if (
    !(newState instanceof Object) ||
    !(prevState instanceof Object) ||
    newState instanceof Array ||
    prevState instanceof Array
  ) {
    if (
      (newState instanceof Array &&
        prevState instanceof Array &&
        newState.length === prevState.length) ||
      prevState === newState
    ) {
      return;
    }

    // console.log(key, prevState, newState);
    self.emit(key, prevState, newState);
  }
};

ReduxEmitter.prototype.onChange = function (
  attributePath,
  reducerName,
  callback
) {
  if (!(this instanceof ReduxEmitter)) return;

  let path, callBackFn;

  if (arguments.length == 2) {
    path = `${this.delimiter}${arguments[0]}`;
    callBackFn = arguments[1];
  } else if (arguments.length === 3) {
    path = `${this.delimiter}${arguments[1]}${this.delimiter}${arguments[0]}`;
    callBackFn = arguments[2];
  } else {
    return;
  }

  if (!path || !callBackFn) return;

  this.on(path, callBackFn);
  return this;
};

ReduxEmitter.prototype.offChange = function (attributePath, reducerName) {
  if (!(this instanceof ReduxEmitter)) return;

  if (arguments.length == 2) {
    const path = `${this.delimiter}${arguments[1]}${this.delimiter}${arguments[0]}`;
    if (!path) return;

    this.off(path);
  } else {
    return;
  }

  return this;
};

ReduxEmitter.prototype.author = "sanjairocky";

ReduxEmitter.prototype.isReduxEmitter = true;

ReduxEmitter.prototype.organization = "Sanazu";

module.exports = ReduxEmitter;

},{"./lib/wildemitter":2}],2:[function(require,module,exports){
function WildEmitter() {}

WildEmitter.mixin = function (constructor) {
  var prototype = constructor.prototype || constructor;

  // Listen on the given `event` with `fn`. Store a group name if present.
  prototype.on = function (event, groupName, fn) {
    this.callbacks = this.callbacks || {};
    var hasGroup = arguments.length === 3,
      group = hasGroup ? arguments[1] : undefined,
      func = hasGroup ? arguments[2] : arguments[1];
    func._groupName = group;
    (this.callbacks[event] = this.callbacks[event] || []).push(func);
    return this;
  };

  // Adds an `event` listener that will be invoked a single
  // time then automatically removed.
  prototype.once = function (event, groupName, fn) {
    var self = this,
      hasGroup = arguments.length === 3,
      group = hasGroup ? arguments[1] : undefined,
      func = hasGroup ? arguments[2] : arguments[1];
    function on() {
      self.off(event, on);
      func.apply(this, arguments);
    }
    this.on(event, group, on);
    return this;
  };

  // Unbinds an entire group
  prototype.releaseGroup = function (groupName) {
    this.callbacks = this.callbacks || {};
    var item, i, len, handlers;
    for (item in this.callbacks) {
      handlers = this.callbacks[item];
      for (i = 0, len = handlers.length; i < len; i++) {
        if (handlers[i]._groupName === groupName) {
          //console.log('removing');
          // remove it and shorten the array we're looping through
          handlers.splice(i, 1);
          i--;
          len--;
        }
      }
    }
    return this;
  };

  // Remove the given callback for `event` or all
  // registered callbacks.
  prototype.off = function (event, fn) {
    this.callbacks = this.callbacks || {};
    var callbacks = this.callbacks[event],
      i;

    if (!callbacks) return this;

    // remove all handlers
    if (arguments.length === 1) {
      delete this.callbacks[event];
      return this;
    }

    // remove specific handler
    i = callbacks.indexOf(fn);
    if (i !== -1) {
      callbacks.splice(i, 1);
      if (callbacks.length === 0) {
        delete this.callbacks[event];
      }
    }
    return this;
  };

  /// Emit `event` with the given args.
  // also calls any `*` handlers
  prototype.emit = function (event) {
    this.callbacks = this.callbacks || {};
    var args = [].slice.call(arguments, 1),
      callbacks = this.callbacks[event],
      specialCallbacks = this.getWildcardCallbacks(event),
      i,
      len,
      item,
      listeners;

    if (callbacks) {
      listeners = callbacks.slice();
      for (i = 0, len = listeners.length; i < len; ++i) {
        if (!listeners[i]) {
          break;
        }
        listeners[i].apply(this, args);
      }
    }

    if (specialCallbacks) {
      len = specialCallbacks.length;
      listeners = specialCallbacks.slice();
      for (i = 0, len = listeners.length; i < len; ++i) {
        if (!listeners[i]) {
          break;
        }
        listeners[i].apply(this, [event].concat(args));
      }
    }

    return this;
  };

  // Helper for for finding special wildcard event handlers that match the event
  prototype.getWildcardCallbacks = function (eventName) {
    this.callbacks = this.callbacks || {};
    var item,
      split,
      result = [];

    for (item in this.callbacks) {
      split = item.split("*");
      if (
        item === "*" ||
        (split.length === 2 && eventName.slice(0, split[0].length) === split[0])
      ) {
        result = result.concat(this.callbacks[item]);
      }
    }
    return result;
  };
};

WildEmitter.mixin(WildEmitter);

module.exports = WildEmitter;

},{}]},{},[1])(1)
});
