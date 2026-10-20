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
import H5Placeholder from './pages/h5/Placeholder'

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
          <Route path="h3/scope" element={<Scope />} />
          <Route path="h3/filer" element={<Filer />} />
          <Route path="h3/kodestandarder" element={<Kodestandarder />} />
          <Route path="h3/refaktorering" element={<Refaktorering />} />
          <Route path="h3/videnstjek" element={<VidenstjekPage />} />
          <Route path="h5" element={<H5Placeholder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
