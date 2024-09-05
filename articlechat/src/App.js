import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import {Route,Routes,BrowserRouter} from 'react-router-dom'
import About from './components/About';

function App() {
  return (
    <>
    <BrowserRouter>
    <div className="App">
       <Navbar/>
       <Routes>
        <Route path='/' element={<Chatbot/>}/>
        <Route path='/about' element={<About/>}/>
       </Routes>
    </div>
    </BrowserRouter>
    </>
  );
}

export default App;
