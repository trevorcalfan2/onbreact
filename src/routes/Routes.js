import React from "react";
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Menu from '../pages/Menu';
import Login from '../pages/Login';
import '../css/Index.css'
import MenuAdmin from "../pages/MenuAdmin";


function App() {
  return (
    

    <BrowserRouter>
      <Routes>
        
        <Route path='/' element={<Login />} />
        <Route path='/menu' element={<Menu />} />
        <Route path='/menuadmin' element={<MenuAdmin />} />
      

      </Routes>
    </BrowserRouter>
  

   

  );
};

export default App;
