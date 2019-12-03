import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { logger, router, reduxRouterMiddleware } from '../../middleware';
import rootReducer from '../reducer';

const nextReducer = require('../reducer');

export default function configure(initialState) {
  // console.log('initialState', initialState)
  const create = window.devToolsExtension
    ? window.devToolsExtension()(createStore)
    : createStore

  const createStoreWithMiddleware = applyMiddleware(
    reduxRouterMiddleware,
    thunkMiddleware,
    logger,
    router
  )(create)

  window.store = createStoreWithMiddleware(rootReducer, initialState)

  if (module.hot) {
    module.hot.accept('../reducer', () => {
      store.replaceReducer(nextReducer)
    })
  }

  return store
}