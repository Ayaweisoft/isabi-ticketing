import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useState } from 'react'
// import { useAuthContext } from './hooks/useAuthContext'
import './App.css'
import ScrollToTop from './components/ScrollToTop';

import Ticket from './pages/Ticket'
import CheckTicket from './pages/checkTicket'


function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>
      <main className="App">
        <ScrollToTop>
          <Routes>
            <Route exact path="/" element={<Ticket />} />
            <Route exact path="/:id" element={<Ticket />} />
            <Route exact path="/check-ticket/:id" element={<CheckTicket />} />
          </Routes>
        </ScrollToTop>
      </main>
    </Router>
  )
}

export default App
