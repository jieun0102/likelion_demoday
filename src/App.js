import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './components/section/Main'
import PostMain from './components/section/Post_main'
import Result from './components/section/Result';
import ResultArchive from './components/section/Result_archive';
import ArchiveResult from './components/section/ArchiveResult';

const App = () => {
  return (
    <BrowserRouter>
      <div className='app'>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/Post_main' element={<PostMain />} />
          <Route path='/Result' element={<Result />} />
          <Route path= '/Result_archive' element={<ResultArchive/>}/>
          <Route path="/ArchiveResult" element={<ArchiveResult />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;