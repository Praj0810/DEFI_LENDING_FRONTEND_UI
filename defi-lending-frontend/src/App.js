import { Provider } from 'react-redux';
import { BrowserRouter as Router, Route} from 'react-router-dom'
// import Deposit from './components/Deposit';
import Navbar from './components/Navbar';
import store from './reducers/store';
import LaunchPage from './components/LaunchPage';
import React from 'react';
import AdminLogin from './components/AdminLogin';
import AdminSignUp from './components/AdminSignUp';
function App() {

  
  return (
    <Provider store={store}>
      <Router>
        <Navbar/>
        <LaunchPage/>
        <Route path='\adminSignUp' element={AdminSignUp}></Route>
        <Route path='\adminLogin' element={AdminLogin}></Route>
      </Router>
    </Provider>  
    );
}

export default App;
