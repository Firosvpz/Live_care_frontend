
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';

import Home from './pages/home_page/Home';
import Register from './pages/user_pages/register';
const App: React.FC = () => {
  
  return (
    <>

      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/user/user_register' element={<Register />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
