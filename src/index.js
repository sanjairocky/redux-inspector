const Emitter = require("./lib/wildemitter");

const ReduxEmitter = function () {
  if (!(this instanceof ReduxEmitter)) return new ReduxEmitter(arguments);
  Emitter.mixin(this);
};

ReduxEmitter.prototype.watch = function (store) {
  if (!(this instanceof ReduxEmitter)) return;
  if (store && store.subscribe) {
    this.store = store;
    store.subscribe(this.listen);
  }
};

ReduxEmitter.prototype.listen = (props) => {
  if (!(this instanceof ReduxEmitter)) return;
  console.log(props, this);
};

ReduxEmitter.prototype.author = "sanjairocky";

modules.export = ReduxEmitter;
