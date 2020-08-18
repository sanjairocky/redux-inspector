const WildEmitter = require("./lib/wildemitter");

const ReduxInspector = function (props) {
  if (!(this instanceof ReduxInspector)) return new ReduxInspector(arguments);

  if (!props) props = {};

  this.delimiter = props.delimiter || ".";
  Object.keys(WildEmitter.prototype).forEach((key) => {
    this[key] = WildEmitter.prototype[key];
  });
};

ReduxInspector.prototype.watch = function (store) {
  if (!(this instanceof ReduxInspector)) return;
  if (store && store.subscribe) {
    this.store = store;
    if (this.store.getState) this.currentState = this.store.getState();
    this.unwatch = store.subscribe(() => this.listen(this.store.getState()));
  }
};

ReduxInspector.prototype.listen = function (newState) {
  if (!(this instanceof ReduxInspector)) return;
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

ReduxInspector.prototype.spyOn = function (
  attributePath,
  parentPath,
  callback
) {
  if (!(this instanceof ReduxInspector)) return;

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

ReduxInspector.prototype.spyOff = function (attributePath, parentPath) {
  if (!(this instanceof ReduxInspector)) return;

  if (arguments.length === 1) {
    const path = `${this.delimiter}${arguments[0]}`;
    if (!path) return;

    this.off(path);
  } else if (arguments.length === 2) {
    const path = `${this.delimiter}${arguments[1]}${this.delimiter}${arguments[0]}`;
    if (!path) return;

    this.off(path);
  } else {
    return;
  }

  return this;
};

ReduxInspector.prototype.author = "sanjairocky";

ReduxInspector.prototype.isReduxInspector = true;

ReduxInspector.prototype.organization = "Sanazu";

module.exports = ReduxInspector;
