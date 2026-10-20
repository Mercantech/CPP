import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'

/** Bagudkompatibilitet: start præsentation fra Oversigt med side-kæde. */
export default function Praesentation() {
  useEffect(() => {
    document.title = 'H3 · Præsentation | CPP'
  }, [])

  return <Navigate to="/h3?present=1" replace />
}
