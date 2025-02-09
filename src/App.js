import { Route, Routes } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar';
import MainBody from './components/MainBody';
import More from './components/More';

import LogIn from './components/LogIn';
import Profile from './components/Profile';
import { useState } from 'react';

/**
 * 
 * TO DO
 * 
 *  make move animation only for bot movements
 *  explore: show possible openings with current positon ?
 *  
 */

function App() {

  const [tab, setTab] = useState("explore");

  return (
    <div className="App">
      <Navbar tab = { tab } setTab = { setTab } />

      <Routes>
        <Route path="/" element={<MainBody tab = { tab } />}></Route>
        <Route path="/more" element={<More />}></Route>
        <Route path="/log-in" element={<LogIn login={true}/>}></Route>
        <Route path="/sign-up" element={<LogIn  login={false}/>}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/flashcards" element={<MainBody tab = { tab } />}></Route>
      </Routes>


    </div>
  );
}

export default App;
