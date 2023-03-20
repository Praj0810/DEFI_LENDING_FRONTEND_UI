import { Provider } from 'react-redux';
import { BrowserRouter as Router} from 'react-router-dom'
import Deposit from './components/Deposit';
import Navbar from './components/Navbar';
import store from './reducers/store';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Navbar/>
        <Deposit/>
        
      </Router>
    </Provider>  
    );
}

export default App;
