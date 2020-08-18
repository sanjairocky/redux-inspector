## What’s a Redux Inspector?

[Redux Inspector](https://www.npmjs.com/package/redux-inspector) is a plugin for Redux.

[![npm version](https://img.shields.io/npm/v/redux-inspector.svg?style=flat-square)](https://www.npmjs.com/package/redux-inspector)
[![npm downloads](https://img.shields.io/npm/dm/redux-inspector.svg?style=flat-square)](https://www.npmjs.com/package/redux-inspector)
[![npm license](https://img.shields.io/npm/l/redux-inspector.svg?style=flat-square)](https://www.npmjs.com/package/redux-inspector)

## Why Do I Need This?

With a plain basic Redux store, you can only do simple synchronous updates by
dispatching an action. this extends the store's abilities, and lets you
write async logic that interacts with the store.

ReduxInspector is for basic Redux side effects logic which is used to target specific
attribute of the state,including complex synchronous logic that needs access to the store,
and simple async logic like AJAX requests.

## API's

- ReduxInspector({}) : it will accept options via constructor. Currently there is only one option. which is to customise the delimiter between the attributes.

  - delimiter : ['.','/'] : default is '.'

- watch(STORE) : it consumes the initialized store object to be watched.
- spyOn(ATTRIBUTE_PATH,PARENT_PATH,CALLBACK) : this will add a listener for that attribute to the store. if the attribute doesn't exists, it has no effect. But, if the attribute is dynamically adding to the store, this will get triggered.
- spyOff(ATTRIBUTE_PATH,PARENT_PATH) : this will remove the registered listeners to the store. if the attribute doesn't exists, it has no effect.

# Path findings

consider an example of Object :

```js
const ex = {
  name: "sampleName",
  details: {
    personal: {
      nickName: "dummy",
    },
    official: {
      nickName: "genius",
    },
  },
};
```

The possible AttributePath's might be as follows:

- using '/' as a delimiter.

```js
const Attributes = [
  ["name", "", "name"],
  ["nickName", "details/personal", "details/personal/nickName"],
  ["nickName", "details/official", "details/official/nickName"],
];
```

- using '.' as a delimiter.

```js
const Attributes = [
  ["name", "", "name"],
  ["nickName", "details.personal", "details.personal.nickName"],
  ["nickName", "details.official", "details.official.nickName"],
];
```

Above is the example usage. take one & look detail.

i.e: nickName inside personal

```js
["nickName", "details.personal", "details.personal.nickName"];
```

first : attributePath or name
second : parentPath
third : completePath of the attribute

# installation

```bash
npm install redux-inspector

```

or

```bash
yarn add redux-inspector

```

# Import

```js
const ReduxInspector = require("redux-inspector");
```

or

```js
import ReduxInspector from "redux-inspector";
```

## SpyOn & SpyOff usage

consider same example :

```js
const ex = {
  name: "sampleName",
  details: {
    personal: {
      nickName: "dummy",
    },
    official: {
      nickName: "genius",
    },
  },
};
const inspector = new ReduxInspector();
```

adding listener for nickName attribute inside personal :

- SpyOn

```js
inspector.spyOn("details.personal.nickName", (prevState, newState) => {});
```

or

```js
inspector.spyOn("nickName", "details.personal", (prevState, newState) => {});
```

- SpyOff

```js
inspector.spyOff("details.personal.nickName");
```

or

```js
inspector.spyOff("nickName", "details.personal");
```

# Example Usage

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

// this only works when root is a attribute
inspector.spyOn("", (prevState, newState) => {
  // validate
  console.log(prevState, newState);
});

inspector.spyOn("text", (prevState, newState) => {
  // validate
  console.log(prevState, newState);
});

inspector.spyOff("");

inspector.spyOff("text");

function addTodo(text) {
  return {
    type: "ADD_TODO",
    text,
  };
}

store.dispatch(addTodo("Read the docs"));
store.dispatch(addTodo("Read about the middleware"));
```

# Issues & Features

Feel free to raise an issue to get a new feature / bug fix.

# License

MIT
