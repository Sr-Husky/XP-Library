import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'

import Home from './pages/home'
import Entrar from './pages/entrar'
import Me from './pages/me'
import Favoritas from './pages/favoritas'
import Nova from './pages/nova'

import Rodape from './components/rodape'
import Navbar from './components/navbar'

function App() {

  const [tipo, setTipo] = useState<string>('');

  return (
    <>
        <BrowserRouter>
          <Navbar func={setTipo} />
          <div className="flex flex-col min-h-screen mt-16 md:mt-20">
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/entrar" element={<Entrar />} />
                <Route path="/me" element={<Me navMsg={tipo} limpaNavMsg={() => setTipo("")} />} />
                <Route path="/favoritas" element={<Favoritas />} />
                <Route path="/nova" element={<Nova />} />
                <Route path="*" element={<Home />} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
        <Rodape />
    </>
  );
}

export default App
