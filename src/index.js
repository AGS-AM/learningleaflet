import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import MapFun from './maps';
import Charts from './charts';
import TabsInfo from './tabs';

ReactDOM.render(
  <React.StrictMode>
    <MapFun />
    <TabsInfo />
  </React.StrictMode>,
  document.getElementById('root')
);
// ReactDOM.render(
//   <React.StrictMode>
//     <Charts />
//   </React.StrictMode>,
//   document.getElementById('root2')
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
