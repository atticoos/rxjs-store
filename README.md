# RxJS Store

An RxJS Store Container implementation.

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
