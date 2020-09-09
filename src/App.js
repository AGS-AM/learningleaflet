import React, { useReducer } from 'react';
import './App.css';
import MapFun from './maps';
import Charts from './charts';
import TabsInfo from './tabs';

export const AppContext = React.createContext();
const initialState = {

  inputArray: ["null",""],
  inputFly: [10,100],

};
function reducer(state, action) {
  switch (action.type) {
    case 'UPDATE_INPUT':
      return {
        inputArray: action.data
      };
    case 'UPDATE_FLY':
      return{
        inputFly: action.data
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
        {console.log("loaded Map")}
        <MapFun />
        {console.log("loaded Tabs")}
        <TabsInfo />
      </AppContext.Provider>
    </div>
  );
}

export default App;
