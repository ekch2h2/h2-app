import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import userReducer from './reducers/userReducers';
import dataReducer from './reducers/dataReducers';
import uiReducer from './reducers/uiReducers';


const initialState = {};

const middleware = [thunk];

const reducers = combineReducers({
    user: userReducer,
    data: dataReducer,
    UI: uiReducer
});

const isReduxDevToolsSupported = () => {
    const ua = window.navigator.userAgent;
    return ua.includes('Chrome')
        && ! ua.includes('Windows')
        && ! ua.includes('Android')
};

const store = createStore(reducers, initialState,
    isReduxDevToolsSupported() ? (
        compose(
            applyMiddleware(...middleware),
            window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
        )
    ) : (
        compose(
            applyMiddleware(...middleware)
        )
    )

);

export default store;