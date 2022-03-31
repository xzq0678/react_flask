import { createStore, combineReducers } from 'redux'
import { CollapsedReducer } from './reducers/CollapsedReducer';
import { LoadingReducer } from './reducers/LoadingReducer';
import { SearchReducer } from './reducers/SearchReducer';

import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

const persistConfig = {
    key: 'root',
    storage,
    blacklist:['LoadingReducer']
}


const reducer = combineReducers({
    CollapsedReducer,
    LoadingReducer,
    SearchReducer
})

const persistedReducer = persistReducer(persistConfig, reducer)
const store = createStore(persistedReducer);
const persistor = persistStore(store)
export { store, persistor }

