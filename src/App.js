import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PostMain from './components/section/Post_main'

const App = () => {
  return (
    <BrowserRouter>
      <div className='app'>
        <Routes>
          <Route path='/Post_main' element={<PostMain />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;