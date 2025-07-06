import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useState } from 'react'

import Home from './pages/home'
import Entrar from './pages/entrar'
import Me from './pages/me'

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
                <Route path="/" element={<Home navMsg={tipo} limpaNavMsg={() => setTipo("")}/>} />
                <Route path="/entrar" element={<Entrar navMsg={tipo} limpaNavMsg={() => setTipo("")}/>} />
                <Route path="/me" element={<Me navMsg={tipo} limpaNavMsg={() => setTipo("")} />} />
                <Route path="*" element={<Home navMsg={tipo} limpaNavMsg={() => setTipo("")}/>} />
              </Routes>
            </div>
          </div>
        </BrowserRouter>
        <Rodape />
    </>
  );
}

export default App
