# Redux Inspector

[Redux Inspector](https://www.npmjs.com/package/redux-inspector) is Event Emitter for Redux

[![npm version](https://img.shields.io/npm/v/redux-inspector.svg?style=flat-square)](https://www.npmjs.com/package/redux-inspector)
[![npm downloads](https://img.shields.io/npm/dm/redux-inspector.svg?style=flat-square)](https://www.npmjs.com/package/redux-inspector)

# installation

```bash
npm install redux-inspector

```

or

```bash
yarn add redux-inspector

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
const ReduxInspector = require("redux-inspector");
```

or

```js
import ReduxInspector from "redux-inspector";
```

# Usage

```js
const inspector = new ReduxInspector({
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

inspector.watch(store);

inspector.addSpy("", (prevState, newState) => {
  // validate
  console.log(prevState, newState);
});

inspector.addSpy("text", (prevState, newState) => {
  // validate
  console.log(prevState, newState);
});

inspector.removeSpy("");

inspector.removeSpy("text");

function addTodo(text) {
  return {
    type: "ADD_TODO",
    text,
  };
}

store.dispatch(addTodo("Read the docs"));
store.dispatch(addTodo("Read about the middleware"));
```

## What’s a redux-inspector?
