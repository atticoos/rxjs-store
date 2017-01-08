export function applyMiddleware (...middlewares) {
  return function (store) {
    return middlewares.reduce((decoratedStore, middleware) => {
      return middleware(decoratedStore);
    }, store);
  }
}
