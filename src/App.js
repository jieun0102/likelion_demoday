import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './components/section/Main';
import Post_main from './components/section/Post_main'

const App = () => {
  return (
    <BrowserRouter>
      <div className='app'>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/Post_main' element={<Post_main />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;