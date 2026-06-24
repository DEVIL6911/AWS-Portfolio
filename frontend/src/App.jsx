import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import TeamPage from './pages/TeamPage';
import FoundingPage from './pages/FoundingPage';
import AdminPage from './pages/AdminPage';

function ScrollToTop() {
  return null; // scroll handled per-page
}

export default function App() {
  useEffect(() => {
    // Mark body as loaded for the fade-in transition
    document.body.classList.add('is-loaded');
  }, []);

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/technical-team" element={<TeamPage teamKey="technical" />} />
        <Route path="/community-team" element={<TeamPage teamKey="community" />} />
        <Route path="/event-management" element={<TeamPage teamKey="event-management" />} />
        <Route path="/event-coordination" element={<TeamPage teamKey="event-coordination" />} />
        <Route path="/marketing-team" element={<TeamPage teamKey="marketing" />} />
        <Route path="/founding-members" element={<FoundingPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
