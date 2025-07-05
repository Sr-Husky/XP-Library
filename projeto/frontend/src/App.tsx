import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Home from './pages/home'
import Entrar from './pages/entrar'
import Me from './pages/me'
import Favoritas from './pages/favoritas'
import Nova from './pages/nova'

import Rodape from './components/rodape'
import Navbar from './components/navbar'

function App() {
  return (
    <>
      <Navbar />
      <div className="flex flex-col min-h-screen mt-16 md:mt-20">
        <BrowserRouter>
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/entrar" element={<Entrar />} />
              <Route path="/me" element={<Me />} />
              <Route path="/favoritas" element={<Favoritas />} />
              <Route path="/nova" element={<Nova />} />
              <Route path="*" element={<Home />} />
            </Routes>
          </div>
        </BrowserRouter>
        <Rodape />
      </div>
    </>
  );
}

export default App
