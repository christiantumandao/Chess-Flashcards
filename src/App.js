import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import MainBody from './components/MainBody';
import More from './components/More';

import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './firebase.config';
import LogIn from './components/LogIn';
import Profile from './components/Profile';

/**
 * 
 * TO DO
 * 
 *  make move animation only for bot movements
 *  explore: show possible openings with current positon ?
 *  
 */

function App() {

  const [user] = useAuthState(auth);

  return (
    <div className="App">
      <Navbar />

      <Routes>
        <Route path="/" element={<MainBody />}></Route>
        <Route path="/more" element={<More />}></Route>
        <Route path="/log-in" element={<LogIn login={true}/>}></Route>
        <Route path="/sign-up" element={<LogIn  login={false}/>}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/flashcards" element={<MainBody />}></Route>
      </Routes>


    </div>
  );
}

export default App;
