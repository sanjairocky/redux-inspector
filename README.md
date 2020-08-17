# Redux Emitter

[Redux Emitter](https://www.npmjs.com/package/redux-emitter) is Event Emitter for Redux

[![npm version](https://img.shields.io/npm/v/redux-emitter.svg?style=flat-square)](https://www.npmjs.com/package/redux-emitter)
[![npm downloads](https://img.shields.io/npm/dm/redux-emitter.svg?style=flat-square)](https://www.npmjs.com/package/redux-emitter)

# installation

```bash
npm install redux-emitter

```

or

```bash
yarn add redux-emitter

```

## Why Do I Need This?

With a plain basic Redux store, you can only do simple synchronous updates by
dispatching an action. this extends the store's abilities, and lets you
write async logic that interacts with the store.

Redux-Emitter is for basic Redux side effects logic,
including complex synchronous logic that needs access to the store, and simple
async logic like AJAX requests.

# Import

```js
const ReduxEmitter = require("redux-emitter");
```

or

```js
import ReduxEmitter from "redux-emitter";
```

# Usage

```js
const emitter = new ReduxEmitter({
  delimiter: "/",
});

function todos(
  state = {
    text: [],
  },
  action
) {
  switch (action.type) {
    case "ADD_TODO":
      return { ...state, text: state.text.concat([action.text]) };
    default:
      return state;
  }
}

const store = Redux.createStore(todos, { text: ["helo"] });

emitter.watch(store);

emitter.onChange("", (prevState, newState) => {
  // validate
  console.log(prevState, newState);
});

emitter.onChange("text", (prevState, newState) => {
  // validate
  console.log(prevState, newState);
});

emitter.offChange("");

emitter.offChange("text");

function addTodo(text) {
  return {
    type: "ADD_TODO",
    text,
  };
}

store.dispatch(addTodo("Read the docs"));
store.dispatch(addTodo("Read about the middleware"));
```

## What’s a redux-emitter?!
