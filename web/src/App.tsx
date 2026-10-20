import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import Historie from './pages/Historie'
import Home from './pages/Home'
import Datatyper from './pages/h3/Datatyper'
import Filer from './pages/h3/Filer'
import Funktioner from './pages/h3/Funktioner'
import Kodestandarder from './pages/h3/Kodestandarder'
import Oversigt from './pages/h3/Oversigt'
import Refaktorering from './pages/h3/Refaktorering'
import Scope from './pages/h3/Scope'
import VidenstjekPage from './pages/h3/VidenstjekPage'
import Kontrolflow from './pages/h3/Kontrolflow'
import Mission from './pages/h3/Mission'
import H5Oversigt from './pages/h5/Oversigt'
import Objekter from './pages/h5/Objekter'
import Hukommelse from './pages/h5/Hukommelse'
import Standardbibliotek from './pages/h5/Standardbibliotek'
import Projekt from './pages/h5/Projekt'
import Laboratorium from './pages/Laboratorium'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="historie" element={<Historie />} />
          <Route path="h3" element={<Oversigt />} />
          <Route path="h3/funktioner" element={<Funktioner />} />
          <Route path="h3/datatyper" element={<Datatyper />} />
          <Route path="h3/kontrolflow" element={<Kontrolflow />} />
          <Route path="h3/scope" element={<Scope />} />
          <Route path="h3/filer" element={<Filer />} />
          <Route path="h3/kodestandarder" element={<Kodestandarder />} />
          <Route path="h3/refaktorering" element={<Refaktorering />} />
          <Route path="h3/videnstjek" element={<VidenstjekPage />} />
          <Route path="h3/mission" element={<Mission />} />
          <Route path="h5" element={<H5Oversigt />} />
          <Route path="h5/objekter" element={<Objekter />} />
          <Route path="h5/hukommelse" element={<Hukommelse />} />
          <Route path="h5/standardbibliotek" element={<Standardbibliotek />} />
          <Route path="h5/projekt" element={<Projekt />} />
          <Route path="laboratorium" element={<Laboratorium />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
