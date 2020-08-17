const WildEmitter = require("./lib/wildemitter");

const ReduxEmitter = function (props) {
  if (!(this instanceof ReduxEmitter)) return new ReduxEmitter(arguments);

  if (!props) props = {};

  this.delimiter = props.delimiter || "/";
  Object.keys(WildEmitter.prototype).forEach((key) => {
    this[`_${key}`] = WildEmitter.prototype[key];
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
      const event = `${key === this.delimiter ? "" : key}${this.delimiter}${k}`;

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
    console.log(key, prevState, newState);
    self._emit(key, prevState, newState);
  }
};

ReduxEmitter.prototype.on = function (attributePath, reducerName, callback) {
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

  this._on(path, callBackFn);
  return this;
};

ReduxEmitter.prototype.off = function (attributePath, reducerName) {
  if (!(this instanceof ReduxEmitter)) return;

  if (arguments.length == 2) {
    const path = `${this.delimiter}${arguments[1]}${this.delimiter}${arguments[0]}`;
    if (!path) return;

    this._off(path);
  } else {
    return;
  }

  return this;
};

ReduxEmitter.prototype.author = "sanjairocky";

ReduxEmitter.prototype.organization = "Sanazu";

modules.export = ReduxEmitter;
