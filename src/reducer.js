import {Observable, Subject} from 'rx/dist/rx.all';

/**
 * Creates an Rx Store Reducer.
 */
export function createReducer (reducerActions, initialState) {
  var subjects = Object.keys(reducerActions).reduce((map, actionName) => {
    map[actionName] = new Subject();
    return map;
  }, {});

  var intents = Object.keys(reducerActions).reduce((map, actionName) => {
    map[actionName] = subjects[actionName].map(reducerActions[actionName]);
    return map;
  }, {});

  var actions = Object.keys(reducerActions).reduce((map, actionName) => {
    map[actionName] = (...args) => subjects[actionName].onNext(...args);
    return map;
  }, {});

  const store = Observable
    .merge(...Object.keys(intents).map(key => intents[key]))
    .scan((state, reducer) => reducer(state), initialState)
    .startWith(initialState);

  return {actions, store};
}

/**
 * Create an output stream mirror the same structure of nodes in the provided tree.
 *
 * The following store tree structure:
 * {
 *   todos: todoStore,
 *   newTodo: newTodoStore
 * }
 *
 * Becomes the following output in the stream:
 * {
 *   todos: ['a', 'b'],
 *   newTodo: 'c'
 * }
 */
export function combineReducers (tree) {
  // Update each store to output the same structure as the store's node in the tree.
  // Eg: {todos: storeTodo} becomes {todos: ['a', 'b']}
  const stores = Object.keys(tree)
    .map(node => (
      tree[node].map(state => ({[node]: state}))
    ));

  // Merge each individual store's output into a single tree
  //
  // Eg:
  // {todos: ['a', 'b']}
  // {newTodo: 'c'}
  //
  // Becomes:
  // {todos: ['a', 'b'], newTodo: 'c'}
  return Observable
    .merge(...stores)
    .scan((lastState, currentState) => ({
      ...lastState,
      ...currentState
    }), {})
    .skip(stores.length - 1)
}
