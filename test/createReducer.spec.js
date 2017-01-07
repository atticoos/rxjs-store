import {Observable, Subject} from 'rx/dist/rx.all';
import {createReducer} from '../src/reducer';

describe('createReducer', () => {
  const Actions = {
    increment: () => count => count + 1,
    decrement: () => count => count - 1
  };

  it('should create a set of callable actions', () => {
    const {actions} = createReducer(Actions);
    expect(typeof actions.increment).toBe('function');
    expect(typeof actions.decrement).toBe('function');
  });

  it('should create an observable store', () => {
    const {store} = createReducer(Actions);
    expect(store).toBeInstanceOf(Observable);
  });

  it('should have the store start off with an initial value', () => {
    const {store} = createReducer(Actions, 3);
    store.subscribe(count => expect(count).toBe(3));
  });

  it('should update the store when actions are called', () => {
    const {actions, store} = createReducer(Actions, 0);

    store
      .skip(1)
      .take(1)
      .subscribe(count => expect(count).toBe(1));

    store
      .skip(2)
      .take(1)
      .subscribe(count => expect(count).toBe(2));

    store
      .skip(3)
      .take(1)
      .subscribe(count => expect(count).toBe(1));

    store
      .skip(4)
      .take(1)
      .subscribe(count => expect(count).toBe(0));

    actions.increment();
    actions.increment();
    actions.decrement();
    actions.decrement();
  });
});
