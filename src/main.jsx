import React from 'react';
import ReactDOM from 'react-dom';  // Correct import for React 16
import App from './App';
import './App.css';  // This imports your CSS file.
import { TicketContextProvider } from './contexts/TicketContext'; // Assuming this is your context provider
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <TicketContextProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </TicketContextProvider>
  </React.StrictMode>,
  document.getElementById('root') // This is where the root will be rendered
);