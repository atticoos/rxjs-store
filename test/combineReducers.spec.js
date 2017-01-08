import {Observable, Subject} from 'rx/dist/rx.all';
import {createReducer, combineReducers} from '../src/reducer';

describe('combineReducers', () => {
  const CountActions = {
    increment: () => count => count + 1,
    decrement: () => count => count - 1
  };

  const WordActions = {
    setText: word => () => word,
    clearText: () => () => ''
  };

  var countStore;
  var wordStore;

  beforeEach(() => {
    countStore = createReducer(CountActions, 0);
    wordStore = createReducer(WordActions, '');
  });

  it('creates a store contianing the spcified nodes', () => {
    const store = combineReducers({
      count: countStore.store,
      word: wordStore.store
    });

    store.subscribe(state => {
      expect(state.count).toBe(0);
      expect(state.word).toBe('')
    });
  });

  it('updates the store when actions are called', () => {
    const store = combineReducers({
      count: countStore.store,
      word: wordStore.store
    });

    store
      .skip(1)
      .take(1)
      .subscribe(state => {
        expect(state.count).toBe(1);
        expect(state.word).toBe('');
      });

    store
      .skip(2)
      .take(1)
      .subscribe(state => {
        expect(state.count).toBe(1);
        expect(state.word).toBe('word')
      });

    store
      .skip(3)
      .take(1)
      .subscribe(state => {
        expect(state.count).toBe(1);
        expect(state.word).toBe('');
      });

    store
      .skip(4)
      .take(1)
      .subscribe(state => {
        expect(state.count).toBe(0);
        expect(state.word).toBe('');
      });

    countStore.actions.increment();
    wordStore.actions.setText('word');
    wordStore.actions.clearText();
    countStore.actions.decrement();
  });
});
