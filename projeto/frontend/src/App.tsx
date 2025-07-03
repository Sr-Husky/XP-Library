import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/home'
import Login from './pages/login'
import Cadastro from './pages/cadastro'
import Me from './pages/me'
import Favoritas from './pages/favoritas'
import Nova from './pages/nova'

import Rodape from './components/rodape'
import Navbar from './components/navbar'

import './App.css'

function App() {

  return (
    <>
      <Navbar />
      <div className='mt-14 md:mt-16'>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path='/cadastro' element={<Cadastro />} />
            <Route path='/me' element={<Me />} />
            <Route path='/favoritas' element={<Favoritas />} />
            <Route path='/nova' element={<Nova />} />
            <Route path='*' element={<Home />} />
          </Routes>
        </BrowserRouter>
      </div>
      <Rodape />
    </>
  )
}

export default App
