# RxJS Store

An RxJS Store Container implementation.

## How it works

The library produces two things:
- A set of actions
- An observable store

### Actions
An action is defined as an object that has a set of functions. Each function accepts the input as an argument, and returns a function that will accept the last state as an argument. That last function will return the next state.

```js
const Action = {
  methodName: input => lastState => { /* business logic */ },

  // example as a "counter":
  increment: (amount = 1) => count => count + 1,
  decrement: (amount = 1) => count => count - amount
};
```

This will become provided to a method the library defines called `createReducer`.

```js
const {store, actions} = createReducer(Action, initialState);
```

The `store` is an `Rx.Observable` and will produce values that become transitioned by our actions.

When an `action` is called, the input will be passed to the first argument in our action's function. Then, internally, the last state will be passed to the second function our action's function returned. Then finally the action will return the next state.

This next state, if changed, becomes sent through the store to the subscribers.


## Example Usage

### Single Store

```js
import {createReducer} from 'rxjs-store';

const CounterActions = {
  increment: (amount = 1) => count => count + amount,
  decrement: (amount = 1) => count => count - amount
};

const {store, actions} = createReducer(CounterActions, 0);

store.subscribe(count => console.log('Count:', count));

store.increment(); // Count: 1
store.increment(); // Count: 2
store.decrement(); // Count: 3
store.decrement(); // Count: 4
```


### Multiple Stores

```js
import {createReducer, combineReducers} from 'rxjs-store';

const CounterActions = {
  increment: (amount = 1) => count => count + amount,
  decrement: (amount = 1) => count => count - amount
};

const WordActions = {
  setWord: word => () => word,
  clearWord: () => () => ''
};

const counter = createReducer(CounterActions, 0);
const word = createReducer(WordActions, '');

const store = combineReducers({
  count: counter.store,
  word: word.store
});

store.subscribe(state => console.log(state));

counter.actions.increment();   // {count: 1, word: ''}
counter.actions.increment();   // {count: 2, word: ''}
word.actions.setWord('hello'); // {count: 2, word: 'hello'}
word.actions.clearWord();      // {count: 2, word: ''}
```

### Usage With React
```js
import {Provider, connect} from 'rxjs-react-store';

// .. same from above

// Create the application store
const store = combineReducers({
  count: counter.store,
  word: word.store
});

// Create an object of the store actions
const actions = {
  counter: counter.actions,
  word: word.actions
};

// Wrap the application in the Provider, passing the store and actions
class App extends React.Component {
  render () {
    return (
      <Provider store={store} actions={actions}>
        <Counter />
      </Provider>
    );
  }
}

// Create a basic counter component.
// The store's state and actions will come in as properties.
class Counter extends React.Component {
  render () {
    return (
      <div>
        <Button onPress={() => this.props.increment()}>
          Increment
        </Button>
        <Button onPress={() => this.props.decrement()}>
          Decrement
        </Button>
        Count: {this.props.count}
      </div>
    );
  }
}

// Select the state for the component.
// These will come in as properties
const selector = state => ({
  count: state.count
});

// Select the actions for the component.
// These will come in as properties
const actions = storeActions => ({
  increment: storeActions.counter.increment,
  decrement: storeActions.counter.decrement
});

// Connect the component with the store and actions
connect(selector, actions)(Counter);
```
