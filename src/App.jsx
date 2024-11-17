import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Import QueryClient and QueryClientProvider
import { useState } from 'react';
import './App.css';
import ScrollToTop from './components/ScrollToTop';

// Import pages
import Home from './pages/Home';
import Ticket from './pages/Ticket';
import CheckTicket from './pages/checkTicket';

// Create a QueryClient instance
const queryClient = new QueryClient();

function App() {
  const [count, setCount] = useState(0);

  return (
    // Wrap the entire app in QueryClientProvider and pass queryClient
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
