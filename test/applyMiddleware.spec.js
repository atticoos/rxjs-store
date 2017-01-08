import {Observable} from 'rx/dist/rx.all';
import {createReducer, combineReducers} from '../src/reducer';
import {applyMiddleware} from '../src/middleware';

describe('applyMiddleware', () => {
  const CounterActions = {
    increment: () => count => count + 1,
    decrement: () => count => count - 1
  };

  var countStore;
  beforeEach(() => {
    countStore = createReducer(CounterActions, 0);
  });

  it('passes the store into the middleware', (done) => {
    const store = combineReducers({
      count: countStore.store
    });

    const middleware = injectedStore => {
      expect(injectedStore).toBe(store);
      done();
      return injectedStore;
    };

    applyMiddleware(middleware)(store);
  });

  it('returns an observable store', () => {
    const store = combineReducers({
      count: countStore.store
    });

    const middleware = store => store.map(state => state);

    const decoratedStore = applyMiddleware(middleware)(store);

    expect(decoratedStore).toBeInstanceOf(Observable);
  });

  it('should be a decorated store', () => {
    const store = combineReducers({count: countStore.store});

    const middleware = store => store.map(() => 'intercepted');

    const decoratedStore = applyMiddleware(middleware)(store);

    store.subscribe(state => expect(state).toEqual({count: 0}));
    decoratedStore.subscribe(state => expect(state).toBe('intercepted'));
  })

  it('supports multiple middlewares, from left to right', (done) => {
    const store = combineReducers({count: countStore.store});

    const middlewares = [];
    for (let i = 0; i < 100; i++) {
      middlewares.push(store => store.map(state => {
        return i;
      }));
    }

    const decoratedStore = applyMiddleware(...middlewares)(store);

    decoratedStore.subscribe(state => {
      expect(state).toBe(middlewares.length - 1);
      done();
    })
  });
});
