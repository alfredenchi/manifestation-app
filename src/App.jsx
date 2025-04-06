import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Feed from './components/Feed';
import Readme from './components/Readme';
import Navigation from './components/Navigation';
import AirtableVideos from './components/AirtableVideos';
import LionGlassUK from './components/LionGlassUK';
import './index.css';

function AppContent() {
  const location = useLocation();
  const isReadmePage = location.pathname === '/readme';
  
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Navigation />
      
      <main className="flex-1 relative">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/readme" element={<Readme />} />
          <Route path="/sales" element={<AirtableVideos />} />
          <Route path="/lionglass" element={<LionGlassUK />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router basename="/manifestation-app">
      <AppContent />
    </Router>
  );
}

export default App;
