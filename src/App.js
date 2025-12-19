import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Main from './components/section/Main'
import Post_main from './components/section/Post_main'

const App = () => {
  return (
    <div>
       <div className='app'>
        <Routes>
          <Route path='/' element={<Main />} />
          <Route path='/Post_main' element={<Post_main />} />
        </Routes>
    </div>

    </div>
  )
}

export default App
