import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'
import ScrollToTop from './components/ScrollToTop';

import Discover from './pages/Home'
import Ticket from './pages/Ticket'
import CheckTicket from './pages/checkTicket'
import FindMyTicket from './pages/FindMyTicket'
import Invoice from './pages/Invoice'
import About from './pages/About'

function App() {
  return (
    <Router>
      <main className="App">
        <ScrollToTop>
          <Routes>
            {/* Discover all events */}
            <Route path="/discover" element={<Discover />} />

            {/* Per-event ticket purchase */}
            <Route path="/:id" element={<Ticket />} />

            {/* Verify a ticket by ID */}
            <Route path="/check-ticket/:id" element={<CheckTicket />} />

            {/* Find my ticket by email */}
            <Route path="/find-ticket/:id" element={<FindMyTicket />} />

            {/* View / download QR invoice */}
            <Route path="/invoice/:ticketId" element={<Invoice />} />

            {/* About i-Sabi */}
            <Route path="/about" element={<About />} />

            {/* Default: redirect to discover */}
            <Route path="/" element={<Discover />} />
          </Routes>
        </ScrollToTop>
      </main>
    </Router>
  )
}

export default App
