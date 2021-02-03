import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {createStore,combineReducers, applyMiddleware} from 'redux';
import {Provider} from 'react-redux'
import ReduxThunk from 'redux-thunk';
import vehicles from './store/reducers/vehicles';
import homeZones from './store/reducers/homeZones';

const rootReducer = combineReducers({
  vehicles: vehicles,
  homeZones: homeZones
})
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
