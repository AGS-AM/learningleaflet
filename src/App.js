import React, { useReducer } from 'react';
import './App.css';
import MapFun from './maps';
import Charts from './charts';
import TabsInfo from './tabs';

export const AppContext = React.createContext();

const initialState = {

  inputArray: ["null", ""],
  inputFly: [13, 100, 6],

};
function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_INPUT':
      return {
        inputArray: action.layer,
        inputFly: action.fly,
      };


    default:
      return initialState;
  }
}
function App() {

  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <div className="App">
      <AppContext.Provider value={{ state, dispatch }}>
        <MapFun />
        <TabsInfo />
      </AppContext.Provider>
    </div>
  );
}

export default App;
